import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { and, desc, eq, ilike, isNull, or, sql } from 'drizzle-orm';
import { assertOwnership } from '../../auth/permissions.js';
import type { AuthUser } from '../../common/decorators/current-user.decorator.js';
import type { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';
import { slugify } from '../../common/utils/slug.util.js';
import { DatabaseService } from '../../database/database.service.js';
import { disciplines } from '../../database/schema/disciplines.schema.js';
import { AuditLogsService } from '../audit-logs/audit-logs.service.js';
import type { CreateDisciplineDto } from './dto/create-discipline.dto.js';
import type { UpdateDisciplineDto } from './dto/update-discipline.dto.js';

@Injectable()
export class DisciplinesService {
  constructor(
    private readonly database: DatabaseService,
    private readonly auditLogs: AuditLogsService,
  ) {}

  findPublished() {
    return this.database.db
      .select()
      .from(disciplines)
      .where(and(eq(disciplines.status, 'published'), isNull(disciplines.deletedAt)))
      .orderBy(desc(disciplines.createdAt));
  }

  async findPublishedBySlug(slug: string) {
    const [discipline] = await this.database.db
      .select()
      .from(disciplines)
      .where(and(eq(disciplines.slug, slug), eq(disciplines.status, 'published'), isNull(disciplines.deletedAt)))
      .limit(1);

    if (!discipline) throw new NotFoundException('Disciplina não encontrada.');
    return discipline;
  }

  async findAllAdmin(query: PaginationQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const offset = (page - 1) * limit;

    const conditions = [isNull(disciplines.deletedAt)];
    if (query.status) conditions.push(eq(disciplines.status, query.status));
    if (query.q) {
      conditions.push(or(ilike(disciplines.title, `%${query.q}%`), ilike(disciplines.slug, `%${query.q}%`))!);
    }

    const where = and(...conditions);

    const [totalRow] = await this.database.db
      .select({ count: sql<number>`count(*)::int` })
      .from(disciplines)
      .where(where);

    const total = totalRow?.count ?? 0;
    const data = await this.database.db
      .select()
      .from(disciplines)
      .where(where)
      .orderBy(desc(disciplines.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async findByIdAdmin(id: string) {
    const [discipline] = await this.database.db
      .select()
      .from(disciplines)
      .where(and(eq(disciplines.id, id), isNull(disciplines.deletedAt)))
      .limit(1);

    if (!discipline) throw new NotFoundException('Disciplina não encontrada.');
    return discipline;
  }

  async create(input: CreateDisciplineDto, user?: AuthUser) {
    const slug = input.slug || slugify(input.title);

    return this.handleConflict(async () => {
      const [discipline] = await this.database.db
        .insert(disciplines)
        .values({
          ...input,
          slug,
          status: 'draft',
          createdBy: user?.id ?? null,
          updatedBy: user?.id ?? null,
        })
        .returning();

      if (!discipline) throw new NotFoundException('Falha ao criar disciplina.');

      await this.auditLogs.log({
        actorUserId: user?.id,
        action: 'create',
        entityType: 'discipline',
        entityId: discipline.id,
        after: discipline,
      });

      return discipline;
    });
  }

  async update(id: string, input: UpdateDisciplineDto, user?: AuthUser) {
    const existing = await this.findByIdAdmin(id);
    if (user) assertOwnership(existing, user, { allowDraftOnly: true });

    return this.handleConflict(async () => {
      const [discipline] = await this.database.db
        .update(disciplines)
        .set({
          ...input,
          updatedAt: new Date(),
          updatedBy: user?.id ?? null,
        })
        .where(eq(disciplines.id, id))
        .returning();

      if (!discipline) throw new NotFoundException('Disciplina não encontrada.');

      await this.auditLogs.log({
        actorUserId: user?.id,
        action: 'update',
        entityType: 'discipline',
        entityId: discipline.id,
        before: existing,
        after: discipline,
      });

      return discipline;
    });
  }

  async archive(id: string, user?: AuthUser) {
    const existing = await this.findByIdAdmin(id);

    const [discipline] = await this.database.db
      .update(disciplines)
      .set({
        status: 'archived',
        updatedAt: new Date(),
        updatedBy: user?.id ?? null,
      })
      .where(eq(disciplines.id, id))
      .returning();

    if (!discipline) throw new NotFoundException('Disciplina não encontrada.');

    await this.auditLogs.log({
      actorUserId: user?.id,
      action: 'archive',
      entityType: 'discipline',
      entityId: discipline.id,
      before: existing,
      after: discipline,
    });

    return discipline;
  }

  async restore(id: string, user?: AuthUser) {
    const [existing] = await this.database.db
      .select()
      .from(disciplines)
      .where(eq(disciplines.id, id))
      .limit(1);

    if (!existing) throw new NotFoundException('Disciplina não encontrada.');

    const newStatus = existing.status === 'archived' ? 'draft' : existing.status;

    const [discipline] = await this.database.db
      .update(disciplines)
      .set({
        deletedAt: null,
        status: newStatus,
        updatedAt: new Date(),
        updatedBy: user?.id ?? null,
      })
      .where(eq(disciplines.id, id))
      .returning();

    if (!discipline) throw new NotFoundException('Disciplina não encontrada.');

    await this.auditLogs.log({
      actorUserId: user?.id,
      action: 'restore',
      entityType: 'discipline',
      entityId: discipline.id,
      before: existing,
      after: discipline,
    });

    return discipline;
  }

  async remove(id: string, user?: AuthUser) {
    const existing = await this.findByIdAdmin(id);
    if (user) assertOwnership(existing, user, { allowDraftOnly: false });

    const [discipline] = await this.database.db
      .update(disciplines)
      .set({
        deletedAt: new Date(),
        updatedBy: user?.id ?? null,
      })
      .where(eq(disciplines.id, id))
      .returning();

    await this.auditLogs.log({
      actorUserId: user?.id,
      action: 'delete',
      entityType: 'discipline',
      entityId: id,
      before: existing,
      after: discipline,
    });
  }

  private async handleConflict<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      const cause = error instanceof Error ? (error as { cause?: unknown }).cause : error;
      if (cause && typeof cause === 'object' && 'code' in cause && (cause as { code: string }).code === '23505') {
        throw new ConflictException('Já existe uma disciplina com este slug.');
      }
      throw error;
    }
  }
}
