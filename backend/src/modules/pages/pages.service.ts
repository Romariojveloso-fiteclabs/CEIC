import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { and, desc, eq, ilike, isNull, or, sql } from 'drizzle-orm';
import { assertOwnership } from '../../auth/permissions.js';
import type { AuthUser } from '../../common/decorators/current-user.decorator.js';
import type { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';
import { slugify } from '../../common/utils/slug.util.js';
import { DatabaseService } from '../../database/database.service.js';
import { pages } from '../../database/schema/pages.schema.js';
import { AuditLogsService } from '../audit-logs/audit-logs.service.js';
import type { CreatePageDto } from './dto/create-page.dto.js';
import type { UpdatePageDto } from './dto/update-page.dto.js';

@Injectable()
export class PagesService {
  constructor(
    private readonly database: DatabaseService,
    private readonly auditLogs: AuditLogsService,
  ) {}

  findPublished() {
    return this.database.db
      .select()
      .from(pages)
      .where(and(eq(pages.status, 'published'), isNull(pages.deletedAt)))
      .orderBy(desc(pages.createdAt));
  }

  async findPublishedBySlug(slug: string) {
    const [page] = await this.database.db
      .select()
      .from(pages)
      .where(and(eq(pages.slug, slug), eq(pages.status, 'published'), isNull(pages.deletedAt)))
      .limit(1);

    if (!page) throw new NotFoundException('Página não encontrada.');
    return page;
  }

  async findAllAdmin(query: PaginationQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const offset = (page - 1) * limit;

    const conditions = [isNull(pages.deletedAt)];
    if (query.status) conditions.push(eq(pages.status, query.status));
    if (query.q) {
      conditions.push(or(ilike(pages.title, `%${query.q}%`), ilike(pages.slug, `%${query.q}%`))!);
    }

    const where = and(...conditions);

    const [totalRow] = await this.database.db
      .select({ count: sql<number>`count(*)::int` })
      .from(pages)
      .where(where);

    const total = totalRow?.count ?? 0;
    const data = await this.database.db
      .select()
      .from(pages)
      .where(where)
      .orderBy(desc(pages.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async findByIdAdmin(id: string) {
    const [page] = await this.database.db
      .select()
      .from(pages)
      .where(and(eq(pages.id, id), isNull(pages.deletedAt)))
      .limit(1);

    if (!page) throw new NotFoundException('Página não encontrada.');
    return page;
  }

  async create(input: CreatePageDto, user?: AuthUser) {
    const slug = input.slug || slugify(input.title);

    return this.handleConflict(async () => {
      const [page] = await this.database.db
        .insert(pages)
        .values({
          ...input,
          slug,
          status: 'draft',
          createdBy: user?.id ?? null,
          updatedBy: user?.id ?? null,
        })
        .returning();

      if (!page) throw new NotFoundException('Falha ao criar página.');

      await this.auditLogs.log({
        actorUserId: user?.id,
        action: 'create',
        entityType: 'page',
        entityId: page.id,
        after: page,
      });

      return page;
    });
  }

  async update(id: string, input: UpdatePageDto, user?: AuthUser) {
    const existing = await this.findByIdAdmin(id);
    if (user) assertOwnership(existing, user, { allowDraftOnly: true });

    return this.handleConflict(async () => {
      const [page] = await this.database.db
        .update(pages)
        .set({
          ...input,
          updatedAt: new Date(),
          updatedBy: user?.id ?? null,
        })
        .where(eq(pages.id, id))
        .returning();

      if (!page) throw new NotFoundException('Página não encontrada.');

      await this.auditLogs.log({
        actorUserId: user?.id,
        action: 'update',
        entityType: 'page',
        entityId: page.id,
        before: existing,
        after: page,
      });

      return page;
    });
  }

  async publish(id: string, user?: AuthUser) {
    const existing = await this.findByIdAdmin(id);

    const [page] = await this.database.db
      .update(pages)
      .set({
        status: 'published',
        publishedAt: new Date(),
        updatedAt: new Date(),
        updatedBy: user?.id ?? null,
      })
      .where(eq(pages.id, id))
      .returning();

    if (!page) throw new NotFoundException('Página não encontrada.');

    await this.auditLogs.log({
      actorUserId: user?.id,
      action: 'publish',
      entityType: 'page',
      entityId: page.id,
      before: existing,
      after: page,
    });

    return page;
  }

  async archive(id: string, user?: AuthUser) {
    const existing = await this.findByIdAdmin(id);

    const [page] = await this.database.db
      .update(pages)
      .set({
        status: 'archived',
        updatedAt: new Date(),
        updatedBy: user?.id ?? null,
      })
      .where(eq(pages.id, id))
      .returning();

    if (!page) throw new NotFoundException('Página não encontrada.');

    await this.auditLogs.log({
      actorUserId: user?.id,
      action: 'archive',
      entityType: 'page',
      entityId: page.id,
      before: existing,
      after: page,
    });

    return page;
  }

  async restore(id: string, user?: AuthUser) {
    const [existing] = await this.database.db
      .select()
      .from(pages)
      .where(eq(pages.id, id))
      .limit(1);

    if (!existing) throw new NotFoundException('Página não encontrada.');

    const newStatus = existing.status === 'archived' ? 'draft' : existing.status;

    const [page] = await this.database.db
      .update(pages)
      .set({
        deletedAt: null,
        status: newStatus,
        updatedAt: new Date(),
        updatedBy: user?.id ?? null,
      })
      .where(eq(pages.id, id))
      .returning();

    if (!page) throw new NotFoundException('Página não encontrada.');

    await this.auditLogs.log({
      actorUserId: user?.id,
      action: 'restore',
      entityType: 'page',
      entityId: page.id,
      before: existing,
      after: page,
    });

    return page;
  }

  async remove(id: string, user?: AuthUser) {
    const existing = await this.findByIdAdmin(id);
    if (user) assertOwnership(existing, user, { allowDraftOnly: false });

    const [page] = await this.database.db
      .update(pages)
      .set({
        deletedAt: new Date(),
        updatedBy: user?.id ?? null,
      })
      .where(eq(pages.id, id))
      .returning();

    await this.auditLogs.log({
      actorUserId: user?.id,
      action: 'delete',
      entityType: 'page',
      entityId: id,
      before: existing,
      after: page,
    });
  }

  private async handleConflict<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      const cause = error instanceof Error ? (error as { cause?: unknown }).cause : error;
      if (cause && typeof cause === 'object' && 'code' in cause && (cause as { code: string }).code === '23505') {
        throw new ConflictException('Já existe uma página com este slug.');
      }
      throw error;
    }
  }
}
