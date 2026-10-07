import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, desc, eq, ilike, isNull, or, sql } from 'drizzle-orm';
import { assertOwnership } from '../../auth/permissions.js';
import type { AuthUser } from '../../common/decorators/current-user.decorator.js';
import type { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';
import { slugify } from '../../common/utils/slug.util.js';
import { DatabaseService } from '../../database/database.service.js';
import { courses } from '../../database/schema/courses.schema.js';
import { AuditLogsService } from '../audit-logs/audit-logs.service.js';
import type { CreateCourseDto } from './dto/create-course.dto.js';
import type { UpdateCourseDto } from './dto/update-course.dto.js';

@Injectable()
export class CoursesService {
  constructor(
    @Inject(DatabaseService) private readonly database: DatabaseService,
    @Inject(AuditLogsService) private readonly auditLogs: AuditLogsService,
  ) {}

  findPublished() {
    return this.database.db
      .select()
      .from(courses)
      .where(and(eq(courses.status, 'published'), isNull(courses.deletedAt)))
      .orderBy(desc(courses.createdAt));
  }

  async findPublishedBySlug(slug: string) {
    const [course] = await this.database.db
      .select()
      .from(courses)
      .where(and(eq(courses.slug, slug), eq(courses.status, 'published'), isNull(courses.deletedAt)))
      .limit(1);

    if (!course) throw new NotFoundException('Curso não encontrado.');
    return course;
  }

  async findAllAdmin(query: PaginationQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const offset = (page - 1) * limit;

    const conditions = [isNull(courses.deletedAt)];
    if (query.status) conditions.push(eq(courses.status, query.status));
    if (query.q) {
      conditions.push(or(ilike(courses.title, `%${query.q}%`), ilike(courses.slug, `%${query.q}%`))!);
    }

    const where = and(...conditions);

    const [totalRow] = await this.database.db
      .select({ count: sql<number>`count(*)::int` })
      .from(courses)
      .where(where);

    const total = totalRow?.count ?? 0;
    const data = await this.database.db
      .select()
      .from(courses)
      .where(where)
      .orderBy(desc(courses.createdAt))
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
    const [course] = await this.database.db
      .select()
      .from(courses)
      .where(and(eq(courses.id, id), isNull(courses.deletedAt)))
      .limit(1);

    if (!course) throw new NotFoundException('Curso não encontrado.');
    return course;
  }

  async create(input: CreateCourseDto, user?: AuthUser) {
    const slug = input.slug || slugify(input.title);

    return this.handleConflict(async () => {
      const [course] = await this.database.db
        .insert(courses)
        .values({
          ...input,
          slug,
          status: 'draft',
          createdBy: user?.id ?? null,
          updatedBy: user?.id ?? null,
        })
        .returning();

      if (!course) throw new NotFoundException('Falha ao criar curso.');

      await this.auditLogs.log({
        actorUserId: user?.id,
        action: 'create',
        entityType: 'course',
        entityId: course.id,
        after: course,
      });

      return course;
    });
  }

  async update(id: string, input: UpdateCourseDto, user?: AuthUser) {
    const existing = await this.findByIdAdmin(id);
    if (user) assertOwnership(existing, user, { allowDraftOnly: true });

    return this.handleConflict(async () => {
      const [course] = await this.database.db
        .update(courses)
        .set({
          ...input,
          updatedAt: new Date(),
          updatedBy: user?.id ?? null,
        })
        .where(eq(courses.id, id))
        .returning();

      if (!course) throw new NotFoundException('Curso não encontrado.');

      await this.auditLogs.log({
        actorUserId: user?.id,
        action: 'update',
        entityType: 'course',
        entityId: course.id,
        before: existing,
        after: course,
      });

      return course;
    });
  }

  async publish(id: string, user?: AuthUser) {
    const existing = await this.findByIdAdmin(id);

    const [course] = await this.database.db
      .update(courses)
      .set({
        status: 'published',
        publishedAt: new Date(),
        updatedAt: new Date(),
        updatedBy: user?.id ?? null,
      })
      .where(eq(courses.id, id))
      .returning();

    if (!course) throw new NotFoundException('Curso não encontrado.');

    await this.auditLogs.log({
      actorUserId: user?.id,
      action: 'publish',
      entityType: 'course',
      entityId: course.id,
      before: existing,
      after: course,
    });

    return course;
  }

  async archive(id: string, user?: AuthUser) {
    const existing = await this.findByIdAdmin(id);

    const [course] = await this.database.db
      .update(courses)
      .set({
        status: 'archived',
        updatedAt: new Date(),
        updatedBy: user?.id ?? null,
      })
      .where(eq(courses.id, id))
      .returning();

    if (!course) throw new NotFoundException('Curso não encontrado.');

    await this.auditLogs.log({
      actorUserId: user?.id,
      action: 'archive',
      entityType: 'course',
      entityId: course.id,
      before: existing,
      after: course,
    });

    return course;
  }

  async restore(id: string, user?: AuthUser) {
    const [existing] = await this.database.db
      .select()
      .from(courses)
      .where(eq(courses.id, id))
      .limit(1);

    if (!existing) throw new NotFoundException('Curso não encontrado.');

    const newStatus = existing.status === 'archived' ? 'draft' : existing.status;

    const [course] = await this.database.db
      .update(courses)
      .set({
        deletedAt: null,
        status: newStatus,
        updatedAt: new Date(),
        updatedBy: user?.id ?? null,
      })
      .where(eq(courses.id, id))
      .returning();

    if (!course) throw new NotFoundException('Curso não encontrado.');

    await this.auditLogs.log({
      actorUserId: user?.id,
      action: 'restore',
      entityType: 'course',
      entityId: course.id,
      before: existing,
      after: course,
    });

    return course;
  }

  async remove(id: string, user?: AuthUser) {
    const existing = await this.findByIdAdmin(id);
    if (user) assertOwnership(existing, user, { allowDraftOnly: false });

    const [course] = await this.database.db
      .update(courses)
      .set({
        deletedAt: new Date(),
        updatedBy: user?.id ?? null,
      })
      .where(eq(courses.id, id))
      .returning();

    await this.auditLogs.log({
      actorUserId: user?.id,
      action: 'delete',
      entityType: 'course',
      entityId: id,
      before: existing,
      after: course,
    });
  }

  private async handleConflict<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      const cause = error instanceof Error ? (error as { cause?: unknown }).cause : error;
      if (cause && typeof cause === 'object' && 'code' in cause && (cause as { code: string }).code === '23505') {
        throw new ConflictException('Já existe um curso com este slug.');
      }
      throw error;
    }
  }
}
