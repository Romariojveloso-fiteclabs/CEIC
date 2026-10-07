import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { and, desc, eq, ilike, isNull, or, sql } from 'drizzle-orm';
import { assertOwnership } from '../../auth/permissions.js';
import type { AuthUser } from '../../common/decorators/current-user.decorator.js';
import type { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';
import { slugify } from '../../common/utils/slug.util.js';
import { DatabaseService } from '../../database/database.service.js';
import { mentorshipScheduleEntries, mentorships, people } from '../../database/schema/index.js';
import { AuditLogsService } from '../audit-logs/audit-logs.service.js';
import type { CreateMentorshipScheduleDto } from './dto/create-mentorship-schedule.dto.js';
import type { CreateMentorshipDto } from './dto/create-mentorship.dto.js';
import type { UpdateMentorshipDto } from './dto/update-mentorship.dto.js';

@Injectable()
export class MentorshipsService {
  constructor(
    private readonly database: DatabaseService,
    private readonly auditLogs: AuditLogsService,
  ) {}

  findPublished() {
    return this.database.db
      .select()
      .from(mentorships)
      .where(and(eq(mentorships.status, 'published'), isNull(mentorships.deletedAt)))
      .orderBy(desc(mentorships.createdAt));
  }

  async findPublishedBySlug(slug: string) {
    const [mentorship] = await this.database.db
      .select()
      .from(mentorships)
      .where(and(eq(mentorships.slug, slug), eq(mentorships.status, 'published'), isNull(mentorships.deletedAt)))
      .limit(1);

    if (!mentorship) throw new NotFoundException('Mentoria não encontrada.');

    const schedules = await this.database.db
      .select()
      .from(mentorshipScheduleEntries)
      .where(eq(mentorshipScheduleEntries.mentorshipId, mentorship.id))
      .orderBy(mentorshipScheduleEntries.position);

    let mentor = null;
    if (mentorship.mentorPersonId) {
      const [p] = await this.database.db
        .select()
        .from(people)
        .where(eq(people.id, mentorship.mentorPersonId))
        .limit(1);
      mentor = p ?? null;
    }

    return { ...mentorship, mentor, schedules };
  }

  async findAllAdmin(query: PaginationQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const offset = (page - 1) * limit;

    const conditions = [isNull(mentorships.deletedAt)];
    if (query.status) conditions.push(eq(mentorships.status, query.status));
    if (query.q) {
      conditions.push(or(ilike(mentorships.title, `%${query.q}%`), ilike(mentorships.slug, `%${query.q}%`))!);
    }

    const where = and(...conditions);

    const [totalRow] = await this.database.db
      .select({ count: sql<number>`count(*)::int` })
      .from(mentorships)
      .where(where);

    const total = totalRow?.count ?? 0;
    const data = await this.database.db
      .select()
      .from(mentorships)
      .where(where)
      .orderBy(desc(mentorships.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async findByIdAdmin(id: string) {
    const [mentorship] = await this.database.db
      .select()
      .from(mentorships)
      .where(and(eq(mentorships.id, id), isNull(mentorships.deletedAt)))
      .limit(1);

    if (!mentorship) throw new NotFoundException('Mentoria não encontrada.');

    const schedules = await this.database.db
      .select()
      .from(mentorshipScheduleEntries)
      .where(eq(mentorshipScheduleEntries.mentorshipId, id))
      .orderBy(mentorshipScheduleEntries.position);

    return { ...mentorship, schedules };
  }

  async create(input: CreateMentorshipDto, user?: AuthUser) {
    const slug = input.slug || slugify(input.title);

    return this.handleConflict(async () => {
      const [mentorship] = await this.database.db
        .insert(mentorships)
        .values({
          ...input,
          slug,
          status: 'draft',
          createdBy: user?.id ?? null,
          updatedBy: user?.id ?? null,
        })
        .returning();

      if (!mentorship) throw new NotFoundException('Falha ao criar mentoria.');

      await this.auditLogs.log({
        actorUserId: user?.id,
        action: 'create',
        entityType: 'mentorship',
        entityId: mentorship.id,
        after: mentorship,
      });

      return mentorship;
    });
  }

  async update(id: string, input: UpdateMentorshipDto, user?: AuthUser) {
    const existing = await this.findByIdAdmin(id);
    if (user) assertOwnership(existing, user, { allowDraftOnly: true });

    return this.handleConflict(async () => {
      const [mentorship] = await this.database.db
        .update(mentorships)
        .set({
          ...input,
          updatedAt: new Date(),
          updatedBy: user?.id ?? null,
        })
        .where(eq(mentorships.id, id))
        .returning();

      if (!mentorship) throw new NotFoundException('Mentoria não encontrada.');

      await this.auditLogs.log({
        actorUserId: user?.id,
        action: 'update',
        entityType: 'mentorship',
        entityId: mentorship.id,
        before: existing,
        after: mentorship,
      });

      return mentorship;
    });
  }

  async publish(id: string, user?: AuthUser) {
    const existing = await this.findByIdAdmin(id);

    const [mentorship] = await this.database.db
      .update(mentorships)
      .set({
        status: 'published',
        publishedAt: new Date(),
        updatedAt: new Date(),
        updatedBy: user?.id ?? null,
      })
      .where(eq(mentorships.id, id))
      .returning();

    if (!mentorship) throw new NotFoundException('Mentoria não encontrada.');

    await this.auditLogs.log({
      actorUserId: user?.id,
      action: 'publish',
      entityType: 'mentorship',
      entityId: mentorship.id,
      before: existing,
      after: mentorship,
    });

    return mentorship;
  }

  async archive(id: string, user?: AuthUser) {
    const existing = await this.findByIdAdmin(id);

    const [mentorship] = await this.database.db
      .update(mentorships)
      .set({
        status: 'archived',
        updatedAt: new Date(),
        updatedBy: user?.id ?? null,
      })
      .where(eq(mentorships.id, id))
      .returning();

    if (!mentorship) throw new NotFoundException('Mentoria não encontrada.');

    await this.auditLogs.log({
      actorUserId: user?.id,
      action: 'archive',
      entityType: 'mentorship',
      entityId: mentorship.id,
      before: existing,
      after: mentorship,
    });

    return mentorship;
  }

  async restore(id: string, user?: AuthUser) {
    const [existing] = await this.database.db
      .select()
      .from(mentorships)
      .where(eq(mentorships.id, id))
      .limit(1);

    if (!existing) throw new NotFoundException('Mentoria não encontrada.');

    const newStatus = existing.status === 'archived' ? 'draft' : existing.status;

    const [mentorship] = await this.database.db
      .update(mentorships)
      .set({
        deletedAt: null,
        status: newStatus,
        updatedAt: new Date(),
        updatedBy: user?.id ?? null,
      })
      .where(eq(mentorships.id, id))
      .returning();

    if (!mentorship) throw new NotFoundException('Mentoria não encontrada.');

    await this.auditLogs.log({
      actorUserId: user?.id,
      action: 'restore',
      entityType: 'mentorship',
      entityId: mentorship.id,
      before: existing,
      after: mentorship,
    });

    return mentorship;
  }

  async remove(id: string, user?: AuthUser) {
    const existing = await this.findByIdAdmin(id);
    if (user) assertOwnership(existing, user, { allowDraftOnly: false });

    const [mentorship] = await this.database.db
      .update(mentorships)
      .set({
        deletedAt: new Date(),
        updatedBy: user?.id ?? null,
      })
      .where(eq(mentorships.id, id))
      .returning();

    await this.auditLogs.log({
      actorUserId: user?.id,
      action: 'delete',
      entityType: 'mentorship',
      entityId: id,
      before: existing,
      after: mentorship,
    });
  }

  async addScheduleEntry(mentorshipId: string, input: CreateMentorshipScheduleDto, user?: AuthUser) {
    await this.findByIdAdmin(mentorshipId);

    const [entry] = await this.database.db
      .insert(mentorshipScheduleEntries)
      .values({
        mentorshipId,
        date: input.date ? new Date(input.date) : null,
        startTime: input.startTime,
        endTime: input.endTime,
        title: input.title,
        description: input.description,
        position: input.position ?? 0,
      })
      .returning();

    await this.auditLogs.log({
      actorUserId: user?.id,
      action: 'create',
      entityType: 'mentorship_schedule',
      entityId: entry!.id,
      after: entry,
    });

    return entry;
  }

  async removeScheduleEntry(scheduleId: string, user?: AuthUser) {
    const [deleted] = await this.database.db
      .delete(mentorshipScheduleEntries)
      .where(eq(mentorshipScheduleEntries.id, scheduleId))
      .returning();

    if (!deleted) throw new NotFoundException('Entrada de cronograma de mentoria não encontrada.');

    await this.auditLogs.log({
      actorUserId: user?.id,
      action: 'delete',
      entityType: 'mentorship_schedule',
      entityId: scheduleId,
      before: deleted,
    });
  }

  private async handleConflict<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      const cause = error instanceof Error ? (error as { cause?: unknown }).cause : error;
      if (cause && typeof cause === 'object' && 'code' in cause && (cause as { code: string }).code === '23505') {
        throw new ConflictException('Já existe uma mentoria com este slug.');
      }
      throw error;
    }
  }
}
