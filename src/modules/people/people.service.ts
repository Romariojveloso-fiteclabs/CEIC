import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { and, desc, eq, ilike, isNull, or, sql } from 'drizzle-orm';
import { assertOwnership } from '../../auth/permissions.js';
import type { AuthUser } from '../../common/decorators/current-user.decorator.js';
import type { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';
import { slugify } from '../../common/utils/slug.util.js';
import { DatabaseService } from '../../database/database.service.js';
import { people } from '../../database/schema/people.schema.js';
import { AuditLogsService } from '../audit-logs/audit-logs.service.js';
import type { CreatePersonDto } from './dto/create-person.dto.js';
import type { UpdatePersonDto } from './dto/update-person.dto.js';

@Injectable()
export class PeopleService {
  constructor(
    private readonly database: DatabaseService,
    private readonly auditLogs: AuditLogsService,
  ) {}

  findPublished() {
    return this.database.db
      .select()
      .from(people)
      .where(and(eq(people.status, 'published'), isNull(people.deletedAt)))
      .orderBy(desc(people.createdAt));
  }

  async findPublishedBySlug(slug: string) {
    const [person] = await this.database.db
      .select()
      .from(people)
      .where(and(eq(people.slug, slug), eq(people.status, 'published'), isNull(people.deletedAt)))
      .limit(1);

    if (!person) throw new NotFoundException('Pessoa não encontrada.');
    return person;
  }

  async findAllAdmin(query: PaginationQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const offset = (page - 1) * limit;

    const conditions = [isNull(people.deletedAt)];
    if (query.status) conditions.push(eq(people.status, query.status));
    if (query.q) {
      conditions.push(or(ilike(people.name, `%${query.q}%`), ilike(people.slug, `%${query.q}%`))!);
    }

    const where = and(...conditions);

    const [totalRow] = await this.database.db
      .select({ count: sql<number>`count(*)::int` })
      .from(people)
      .where(where);

    const total = totalRow?.count ?? 0;
    const data = await this.database.db
      .select()
      .from(people)
      .where(where)
      .orderBy(desc(people.createdAt))
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
    const [person] = await this.database.db
      .select()
      .from(people)
      .where(and(eq(people.id, id), isNull(people.deletedAt)))
      .limit(1);

    if (!person) throw new NotFoundException('Pessoa não encontrada.');
    return person;
  }

  async create(input: CreatePersonDto, user?: AuthUser) {
    const slug = input.slug || slugify(input.name);

    return this.handleConflict(async () => {
      const [person] = await this.database.db
        .insert(people)
        .values({
          ...input,
          slug,
          status: 'draft',
          createdBy: user?.id ?? null,
          updatedBy: user?.id ?? null,
        })
        .returning();

      if (!person) throw new NotFoundException('Falha ao cadastrar pessoa.');

      await this.auditLogs.log({
        actorUserId: user?.id,
        action: 'create',
        entityType: 'people',
        entityId: person.id,
        after: person,
      });

      return person;
    });
  }

  async update(id: string, input: UpdatePersonDto, user?: AuthUser) {
    const existing = await this.findByIdAdmin(id);
    if (user) assertOwnership(existing, user, { allowDraftOnly: true });

    return this.handleConflict(async () => {
      const [person] = await this.database.db
        .update(people)
        .set({
          ...input,
          updatedAt: new Date(),
          updatedBy: user?.id ?? null,
        })
        .where(eq(people.id, id))
        .returning();

      if (!person) throw new NotFoundException('Pessoa não encontrada.');

      await this.auditLogs.log({
        actorUserId: user?.id,
        action: 'update',
        entityType: 'people',
        entityId: person.id,
        before: existing,
        after: person,
      });

      return person;
    });
  }

  async archive(id: string, user?: AuthUser) {
    const existing = await this.findByIdAdmin(id);

    const [person] = await this.database.db
      .update(people)
      .set({
        status: 'archived',
        updatedAt: new Date(),
        updatedBy: user?.id ?? null,
      })
      .where(eq(people.id, id))
      .returning();

    if (!person) throw new NotFoundException('Pessoa não encontrada.');

    await this.auditLogs.log({
      actorUserId: user?.id,
      action: 'archive',
      entityType: 'people',
      entityId: person.id,
      before: existing,
      after: person,
    });

    return person;
  }

  async restore(id: string, user?: AuthUser) {
    const [existing] = await this.database.db
      .select()
      .from(people)
      .where(eq(people.id, id))
      .limit(1);

    if (!existing) throw new NotFoundException('Pessoa não encontrada.');

    const newStatus = existing.status === 'archived' ? 'draft' : existing.status;

    const [person] = await this.database.db
      .update(people)
      .set({
        deletedAt: null,
        status: newStatus,
        updatedAt: new Date(),
        updatedBy: user?.id ?? null,
      })
      .where(eq(people.id, id))
      .returning();

    if (!person) throw new NotFoundException('Pessoa não encontrada.');

    await this.auditLogs.log({
      actorUserId: user?.id,
      action: 'restore',
      entityType: 'people',
      entityId: person.id,
      before: existing,
      after: person,
    });

    return person;
  }

  async remove(id: string, user?: AuthUser) {
    const existing = await this.findByIdAdmin(id);
    if (user) assertOwnership(existing, user, { allowDraftOnly: false });

    const [person] = await this.database.db
      .update(people)
      .set({
        deletedAt: new Date(),
        updatedBy: user?.id ?? null,
      })
      .where(eq(people.id, id))
      .returning();

    await this.auditLogs.log({
      actorUserId: user?.id,
      action: 'delete',
      entityType: 'people',
      entityId: id,
      before: existing,
      after: person,
    });
  }

  private async handleConflict<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      const cause = error instanceof Error ? (error as { cause?: unknown }).cause : error;
      if (cause && typeof cause === 'object' && 'code' in cause && (cause as { code: string }).code === '23505') {
        throw new ConflictException('Já existe uma pessoa com este slug.');
      }
      throw error;
    }
  }
}
