import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { and, desc, eq, ilike, isNull, or, sql } from 'drizzle-orm';
import { assertOwnership } from '../../auth/permissions.js';
import type { AuthUser } from '../../common/decorators/current-user.decorator.js';
import type { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';
import { slugify } from '../../common/utils/slug.util.js';
import { DatabaseService } from '../../database/database.service.js';
import { partners } from '../../database/schema/partners.schema.js';
import { AuditLogsService } from '../audit-logs/audit-logs.service.js';
import type { CreatePartnerDto } from './dto/create-partner.dto.js';
import type { UpdatePartnerDto } from './dto/update-partner.dto.js';

@Injectable()
export class PartnersService {
  constructor(
    private readonly database: DatabaseService,
    private readonly auditLogs: AuditLogsService,
  ) {}

  findPublished() {
    return this.database.db
      .select()
      .from(partners)
      .where(and(eq(partners.status, 'published'), isNull(partners.deletedAt)))
      .orderBy(partners.position, desc(partners.createdAt));
  }

  async findPublishedBySlug(slug: string) {
    const [partner] = await this.database.db
      .select()
      .from(partners)
      .where(and(eq(partners.slug, slug), eq(partners.status, 'published'), isNull(partners.deletedAt)))
      .limit(1);

    if (!partner) throw new NotFoundException('Parceiro não encontrado.');
    return partner;
  }

  async findAllAdmin(query: PaginationQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const offset = (page - 1) * limit;

    const conditions = [isNull(partners.deletedAt)];
    if (query.status) conditions.push(eq(partners.status, query.status));
    if (query.q) {
      conditions.push(or(ilike(partners.name, `%${query.q}%`), ilike(partners.slug, `%${query.q}%`))!);
    }

    const where = and(...conditions);

    const [totalRow] = await this.database.db
      .select({ count: sql<number>`count(*)::int` })
      .from(partners)
      .where(where);

    const total = totalRow?.count ?? 0;
    const data = await this.database.db
      .select()
      .from(partners)
      .where(where)
      .orderBy(partners.position, desc(partners.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async findByIdAdmin(id: string) {
    const [partner] = await this.database.db
      .select()
      .from(partners)
      .where(and(eq(partners.id, id), isNull(partners.deletedAt)))
      .limit(1);

    if (!partner) throw new NotFoundException('Parceiro não encontrado.');
    return partner;
  }

  async create(input: CreatePartnerDto, user?: AuthUser) {
    const slug = input.slug || slugify(input.name);

    return this.handleConflict(async () => {
      const [partner] = await this.database.db
        .insert(partners)
        .values({
          ...input,
          slug,
          status: 'draft',
          createdBy: user?.id ?? null,
          updatedBy: user?.id ?? null,
        })
        .returning();

      if (!partner) throw new NotFoundException('Falha ao criar parceiro.');

      await this.auditLogs.log({
        actorUserId: user?.id,
        action: 'create',
        entityType: 'partner',
        entityId: partner.id,
        after: partner,
      });

      return partner;
    });
  }

  async update(id: string, input: UpdatePartnerDto, user?: AuthUser) {
    const existing = await this.findByIdAdmin(id);
    if (user) assertOwnership(existing, user, { allowDraftOnly: true });

    return this.handleConflict(async () => {
      const [partner] = await this.database.db
        .update(partners)
        .set({
          ...input,
          updatedAt: new Date(),
          updatedBy: user?.id ?? null,
        })
        .where(eq(partners.id, id))
        .returning();

      if (!partner) throw new NotFoundException('Parceiro não encontrado.');

      await this.auditLogs.log({
        actorUserId: user?.id,
        action: 'update',
        entityType: 'partner',
        entityId: partner.id,
        before: existing,
        after: partner,
      });

      return partner;
    });
  }

  async archive(id: string, user?: AuthUser) {
    const existing = await this.findByIdAdmin(id);

    const [partner] = await this.database.db
      .update(partners)
      .set({
        status: 'archived',
        updatedAt: new Date(),
        updatedBy: user?.id ?? null,
      })
      .where(eq(partners.id, id))
      .returning();

    if (!partner) throw new NotFoundException('Parceiro não encontrado.');

    await this.auditLogs.log({
      actorUserId: user?.id,
      action: 'archive',
      entityType: 'partner',
      entityId: partner.id,
      before: existing,
      after: partner,
    });

    return partner;
  }

  async publish(id: string, user?: AuthUser) {
    const existing = await this.findByIdAdmin(id);

    const [partner] = await this.database.db
      .update(partners)
      .set({
        status: 'published',
        updatedAt: new Date(),
        updatedBy: user?.id ?? null,
      })
      .where(eq(partners.id, id))
      .returning();

    if (!partner) throw new NotFoundException('Parceiro não encontrado.');

    await this.auditLogs.log({
      actorUserId: user?.id,
      action: 'publish',
      entityType: 'partner',
      entityId: partner.id,
      before: existing,
      after: partner,
    });

    return partner;
  }

  async restore(id: string, user?: AuthUser) {
    const [existing] = await this.database.db
      .select()
      .from(partners)
      .where(eq(partners.id, id))
      .limit(1);

    if (!existing) throw new NotFoundException('Parceiro não encontrado.');

    const [partner] = await this.database.db
      .update(partners)
      .set({
        deletedAt: null,
        status: 'draft',
        updatedAt: new Date(),
        updatedBy: user?.id ?? null,
      })
      .where(eq(partners.id, id))
      .returning();

    if (!partner) throw new NotFoundException('Parceiro não encontrado.');

    await this.auditLogs.log({
      actorUserId: user?.id,
      action: 'restore',
      entityType: 'partner',
      entityId: partner.id,
      before: existing,
      after: partner,
    });

    return partner;
  }

  async remove(id: string, user?: AuthUser) {
    const existing = await this.findByIdAdmin(id);
    if (user) assertOwnership(existing, user, { allowDraftOnly: false });

    const [partner] = await this.database.db
      .update(partners)
      .set({
        deletedAt: new Date(),
        updatedBy: user?.id ?? null,
      })
      .where(eq(partners.id, id))
      .returning();

    await this.auditLogs.log({
      actorUserId: user?.id,
      action: 'delete',
      entityType: 'partner',
      entityId: id,
      before: existing,
      after: partner,
    });
  }

  private async handleConflict<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      const cause = error instanceof Error ? (error as { cause?: unknown }).cause : error;
      if (cause && typeof cause === 'object' && 'code' in cause && (cause as { code: string }).code === '23505') {
        throw new ConflictException('Já existe um parceiro com este slug.');
      }
      throw error;
    }
  }
}
