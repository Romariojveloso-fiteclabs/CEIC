import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { and, desc, eq, ilike, isNull, or, sql } from 'drizzle-orm';
import { assertOwnership } from '../../auth/permissions.js';
import type { AuthUser } from '../../common/decorators/current-user.decorator.js';
import type { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';
import { slugify } from '../../common/utils/slug.util.js';
import { DatabaseService } from '../../database/database.service.js';
import { news, newsPeople, people } from '../../database/schema/index.js';
import { AuditLogsService } from '../audit-logs/audit-logs.service.js';
import type { CreateNewsDto } from './dto/create-news.dto.js';
import type { UpdateNewsDto } from './dto/update-news.dto.js';

@Injectable()
export class NewsService {
  constructor(
    private readonly database: DatabaseService,
    private readonly auditLogs: AuditLogsService,
  ) {}

  findPublished() {
    return this.database.db
      .select()
      .from(news)
      .where(and(eq(news.status, 'published'), isNull(news.deletedAt)))
      .orderBy(desc(news.publishedAt));
  }

  async findPublishedBySlug(slug: string) {
    const [item] = await this.database.db
      .select()
      .from(news)
      .where(and(eq(news.slug, slug), eq(news.status, 'published'), isNull(news.deletedAt)))
      .limit(1);

    if (!item) throw new NotFoundException('Notícia não encontrada.');

    const authors = await this.database.db
      .select({ id: people.id, name: people.name, slug: people.slug, title: people.title })
      .from(newsPeople)
      .innerJoin(people, eq(newsPeople.personId, people.id))
      .where(eq(newsPeople.newsId, item.id));

    return { ...item, authors, people: authors };
  }

  async findAllAdmin(query: PaginationQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const offset = (page - 1) * limit;

    const conditions = [isNull(news.deletedAt)];
    if (query.status) conditions.push(eq(news.status, query.status));
    if (query.q) {
      conditions.push(or(ilike(news.title, `%${query.q}%`), ilike(news.slug, `%${query.q}%`))!);
    }

    const where = and(...conditions);

    const [totalRow] = await this.database.db
      .select({ count: sql<number>`count(*)::int` })
      .from(news)
      .where(where);

    const total = totalRow?.count ?? 0;
    const data = await this.database.db
      .select()
      .from(news)
      .where(where)
      .orderBy(desc(news.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async findByIdAdmin(id: string) {
    const [item] = await this.database.db
      .select()
      .from(news)
      .where(and(eq(news.id, id), isNull(news.deletedAt)))
      .limit(1);

    if (!item) throw new NotFoundException('Notícia não encontrada.');

    const authors = await this.database.db
      .select({ id: people.id, name: people.name, slug: people.slug, title: people.title })
      .from(newsPeople)
      .innerJoin(people, eq(newsPeople.personId, people.id))
      .where(eq(newsPeople.newsId, id));

    return { ...item, authors };
  }

  async create(input: CreateNewsDto, user?: AuthUser) {
    const slug = input.slug || slugify(input.title);

    return this.handleConflict(async () => {
      const { personIds, ...data } = input;

      const [item] = await this.database.db
        .insert(news)
        .values({
          ...data,
          slug,
          status: 'draft',
          createdBy: user?.id ?? null,
          updatedBy: user?.id ?? null,
        })
        .returning();

      if (!item) throw new NotFoundException('Falha ao criar notícia.');

      if (personIds && personIds.length > 0) {
        await this.database.db.insert(newsPeople).values(
          personIds.map((personId) => ({ newsId: item.id, personId })),
        );
      }

      await this.auditLogs.log({
        actorUserId: user?.id,
        action: 'create',
        entityType: 'news',
        entityId: item.id,
        after: item,
      });

      return item;
    });
  }

  async update(id: string, input: UpdateNewsDto, user?: AuthUser) {
    const existing = await this.findByIdAdmin(id);
    if (user) assertOwnership(existing, user, { allowDraftOnly: true });

    return this.handleConflict(async () => {
      const { personIds, ...data } = input;

      const [item] = await this.database.db
        .update(news)
        .set({
          ...data,
          updatedAt: new Date(),
          updatedBy: user?.id ?? null,
        })
        .where(eq(news.id, id))
        .returning();

      if (!item) throw new NotFoundException('Notícia não encontrada.');

      if (personIds !== undefined) {
        await this.database.db.delete(newsPeople).where(eq(newsPeople.newsId, id));
        if (personIds.length > 0) {
          await this.database.db.insert(newsPeople).values(
            personIds.map((personId) => ({ newsId: id, personId })),
          );
        }
      }

      await this.auditLogs.log({
        actorUserId: user?.id,
        action: 'update',
        entityType: 'news',
        entityId: item.id,
        before: existing,
        after: item,
      });

      return item;
    });
  }

  async publish(id: string, user?: AuthUser) {
    const existing = await this.findByIdAdmin(id);

    const [item] = await this.database.db
      .update(news)
      .set({
        status: 'published',
        publishedAt: new Date(),
        updatedAt: new Date(),
        updatedBy: user?.id ?? null,
      })
      .where(eq(news.id, id))
      .returning();

    if (!item) throw new NotFoundException('Notícia não encontrada.');

    await this.auditLogs.log({
      actorUserId: user?.id,
      action: 'publish',
      entityType: 'news',
      entityId: item.id,
      before: existing,
      after: item,
    });

    return item;
  }

  async archive(id: string, user?: AuthUser) {
    const existing = await this.findByIdAdmin(id);

    const [item] = await this.database.db
      .update(news)
      .set({
        status: 'archived',
        updatedAt: new Date(),
        updatedBy: user?.id ?? null,
      })
      .where(eq(news.id, id))
      .returning();

    if (!item) throw new NotFoundException('Notícia não encontrada.');

    await this.auditLogs.log({
      actorUserId: user?.id,
      action: 'archive',
      entityType: 'news',
      entityId: item.id,
      before: existing,
      after: item,
    });

    return item;
  }

  async restore(id: string, user?: AuthUser) {
    const [existing] = await this.database.db
      .select()
      .from(news)
      .where(eq(news.id, id))
      .limit(1);

    if (!existing) throw new NotFoundException('Notícia não encontrada.');

    const newStatus = existing.status === 'archived' ? 'draft' : existing.status;

    const [item] = await this.database.db
      .update(news)
      .set({
        deletedAt: null,
        status: newStatus,
        updatedAt: new Date(),
        updatedBy: user?.id ?? null,
      })
      .where(eq(news.id, id))
      .returning();

    if (!item) throw new NotFoundException('Notícia não encontrada.');

    await this.auditLogs.log({
      actorUserId: user?.id,
      action: 'restore',
      entityType: 'news',
      entityId: item.id,
      before: existing,
      after: item,
    });

    return item;
  }

  async remove(id: string, user?: AuthUser) {
    const existing = await this.findByIdAdmin(id);
    if (user) assertOwnership(existing, user, { allowDraftOnly: false });

    const [item] = await this.database.db
      .update(news)
      .set({
        deletedAt: new Date(),
        updatedBy: user?.id ?? null,
      })
      .where(eq(news.id, id))
      .returning();

    await this.auditLogs.log({
      actorUserId: user?.id,
      action: 'delete',
      entityType: 'news',
      entityId: id,
      before: existing,
      after: item,
    });
  }

  async addPerson(newsId: string, personId: string, user?: AuthUser) {
    await this.findByIdAdmin(newsId);
    await this.database.db.insert(newsPeople).values({ newsId, personId }).onConflictDoNothing();
    await this.auditLogs.log({
      actorUserId: user?.id,
      action: 'update',
      entityType: 'news_person',
      entityId: `${newsId}:${personId}`,
    });
  }

  async removePerson(newsId: string, personId: string, user?: AuthUser) {
    await this.database.db
      .delete(newsPeople)
      .where(and(eq(newsPeople.newsId, newsId), eq(newsPeople.personId, personId)));

    await this.auditLogs.log({
      actorUserId: user?.id,
      action: 'delete',
      entityType: 'news_person',
      entityId: `${newsId}:${personId}`,
    });
  }

  private async handleConflict<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      const cause = error instanceof Error ? (error as { cause?: unknown }).cause : error;
      if (cause && typeof cause === 'object' && 'code' in cause && (cause as { code: string }).code === '23505') {
        throw new ConflictException('Já existe uma notícia com este slug.');
      }
      throw error;
    }
  }
}
