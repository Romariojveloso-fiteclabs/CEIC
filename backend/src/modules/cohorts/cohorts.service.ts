import { Injectable, NotFoundException } from '@nestjs/common';
import { and, desc, eq, ilike, isNull, or, sql } from 'drizzle-orm';
import { assertOwnership } from '../../auth/permissions.js';
import type { AuthUser } from '../../common/decorators/current-user.decorator.js';
import type { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';
import { DatabaseService } from '../../database/database.service.js';
import {
  cohortDisciplinePeople,
  cohortDisciplines,
  cohorts,
  disciplines,
  people,
  scheduleEntries,
} from '../../database/schema/index.js';
import { AuditLogsService } from '../audit-logs/audit-logs.service.js';
import type { AddCohortDisciplineDto } from './dto/add-cohort-discipline.dto.js';
import type { AddDisciplinePersonDto } from './dto/add-discipline-person.dto.js';
import type { CreateCohortDto } from './dto/create-cohort.dto.js';
import type { CreateScheduleEntryDto } from './dto/create-schedule-entry.dto.js';
import type { UpdateCohortDto } from './dto/update-cohort.dto.js';

@Injectable()
export class CohortsService {
  constructor(
    private readonly database: DatabaseService,
    private readonly auditLogs: AuditLogsService,
  ) {}

  async findAllAdmin(query: PaginationQueryDto & { courseId?: string }) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const offset = (page - 1) * limit;

    const conditions = [isNull(cohorts.deletedAt)];
    if (query.courseId) conditions.push(eq(cohorts.courseId, query.courseId));
    if (query.status) conditions.push(eq(cohorts.status, query.status));
    if (query.q) {
      conditions.push(or(ilike(cohorts.name, `%${query.q}%`))!);
    }

    const where = and(...conditions);

    const [totalRow] = await this.database.db
      .select({ count: sql<number>`count(*)::int` })
      .from(cohorts)
      .where(where);

    const total = totalRow?.count ?? 0;
    const data = await this.database.db
      .select()
      .from(cohorts)
      .where(where)
      .orderBy(desc(cohorts.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async findByIdAdmin(id: string) {
    const [cohort] = await this.database.db
      .select()
      .from(cohorts)
      .where(and(eq(cohorts.id, id), isNull(cohorts.deletedAt)))
      .limit(1);

    if (!cohort) throw new NotFoundException('Turma não encontrada.');

    const cohortDiscs = await this.database.db
      .select({
        id: cohortDisciplines.id,
        cohortId: cohortDisciplines.cohortId,
        disciplineId: cohortDisciplines.disciplineId,
        position: cohortDisciplines.position,
        credits: cohortDisciplines.credits,
        workloadHours: cohortDisciplines.workloadHours,
        startDate: cohortDisciplines.startDate,
        endDate: cohortDisciplines.endDate,
        notes: cohortDisciplines.notes,
        disciplineTitle: disciplines.title,
        disciplineSlug: disciplines.slug,
      })
      .from(cohortDisciplines)
      .innerJoin(disciplines, eq(cohortDisciplines.disciplineId, disciplines.id))
      .where(eq(cohortDisciplines.cohortId, id))
      .orderBy(cohortDisciplines.position);

    return { ...cohort, disciplines: cohortDiscs };
  }

  async findPublishedById(id: string) {
    const [cohort] = await this.database.db
      .select()
      .from(cohorts)
      .where(and(eq(cohorts.id, id), eq(cohorts.status, 'published'), isNull(cohorts.deletedAt)))
      .limit(1);

    if (!cohort) throw new NotFoundException('Turma não encontrada.');

    const cohortDiscs = await this.database.db
      .select({
        id: cohortDisciplines.id,
        cohortId: cohortDisciplines.cohortId,
        disciplineId: cohortDisciplines.disciplineId,
        position: cohortDisciplines.position,
        credits: cohortDisciplines.credits,
        workloadHours: cohortDisciplines.workloadHours,
        startDate: cohortDisciplines.startDate,
        endDate: cohortDisciplines.endDate,
        notes: cohortDisciplines.notes,
        title: disciplines.title,
        slug: disciplines.slug,
        syllabus: disciplines.syllabus,
        bibliography: disciplines.bibliography,
      })
      .from(cohortDisciplines)
      .innerJoin(disciplines, eq(cohortDisciplines.disciplineId, disciplines.id))
      .where(and(eq(cohortDisciplines.cohortId, id), isNull(disciplines.deletedAt)))
      .orderBy(cohortDisciplines.position);

    const detailedDisciplines = await Promise.all(
      cohortDiscs.map(async (disc) => {
        const peopleList = await this.database.db
          .select({
            id: cohortDisciplinePeople.id,
            personId: people.id,
            name: people.name,
            slug: people.slug,
            title: people.title,
            organization: people.organization,
            photoMediaId: people.photoMediaId,
            role: cohortDisciplinePeople.role,
          })
          .from(cohortDisciplinePeople)
          .innerJoin(people, eq(cohortDisciplinePeople.personId, people.id))
          .where(and(eq(cohortDisciplinePeople.cohortDisciplineId, disc.id), isNull(people.deletedAt)));

        const schedules = await this.database.db
          .select()
          .from(scheduleEntries)
          .where(eq(scheduleEntries.cohortDisciplineId, disc.id))
          .orderBy(scheduleEntries.position, scheduleEntries.date);

        return {
          ...disc,
          people: peopleList,
          schedules,
        };
      }),
    );

    return { ...cohort, disciplines: detailedDisciplines };
  }

  findPublishedByCourse(courseId: string) {
    return this.database.db
      .select()
      .from(cohorts)
      .where(and(eq(cohorts.courseId, courseId), eq(cohorts.status, 'published'), isNull(cohorts.deletedAt)))
      .orderBy(desc(cohorts.createdAt));
  }

  async create(input: CreateCohortDto, user?: AuthUser) {
    const [cohort] = await this.database.db
      .insert(cohorts)
      .values({
        ...input,
        startDate: input.startDate ? new Date(input.startDate) : null,
        endDate: input.endDate ? new Date(input.endDate) : null,
        enrollmentStart: input.enrollmentStart ? new Date(input.enrollmentStart) : null,
        enrollmentEnd: input.enrollmentEnd ? new Date(input.enrollmentEnd) : null,
        price: input.price ? input.price.toString() : null,
        status: 'draft',
        createdBy: user?.id ?? null,
        updatedBy: user?.id ?? null,
      })
      .returning();

    if (!cohort) throw new NotFoundException('Falha ao criar turma.');

    await this.auditLogs.log({
      actorUserId: user?.id,
      action: 'create',
      entityType: 'cohort',
      entityId: cohort.id,
      after: cohort,
    });

    return cohort;
  }

  async update(id: string, input: UpdateCohortDto, user?: AuthUser) {
    const existing = await this.findByIdAdmin(id);
    if (user) assertOwnership(existing, user, { allowDraftOnly: true });

    const [cohort] = await this.database.db
      .update(cohorts)
      .set({
        ...input,
        startDate: input.startDate ? new Date(input.startDate) : undefined,
        endDate: input.endDate ? new Date(input.endDate) : undefined,
        enrollmentStart: input.enrollmentStart ? new Date(input.enrollmentStart) : undefined,
        enrollmentEnd: input.enrollmentEnd ? new Date(input.enrollmentEnd) : undefined,
        price: input.price !== undefined ? input.price?.toString() : undefined,
        updatedAt: new Date(),
        updatedBy: user?.id ?? null,
      })
      .where(eq(cohorts.id, id))
      .returning();

    if (!cohort) throw new NotFoundException('Turma não encontrada.');

    await this.auditLogs.log({
      actorUserId: user?.id,
      action: 'update',
      entityType: 'cohort',
      entityId: cohort.id,
      before: existing,
      after: cohort,
    });

    return cohort;
  }

  async publish(id: string, user?: AuthUser) {
    const existing = await this.findByIdAdmin(id);

    const [cohort] = await this.database.db
      .update(cohorts)
      .set({
        status: 'published',
        publishedAt: new Date(),
        updatedAt: new Date(),
        updatedBy: user?.id ?? null,
      })
      .where(eq(cohorts.id, id))
      .returning();

    if (!cohort) throw new NotFoundException('Turma não encontrada.');

    await this.auditLogs.log({
      actorUserId: user?.id,
      action: 'publish',
      entityType: 'cohort',
      entityId: cohort.id,
      before: existing,
      after: cohort,
    });

    return cohort;
  }

  async archive(id: string, user?: AuthUser) {
    const existing = await this.findByIdAdmin(id);

    const [cohort] = await this.database.db
      .update(cohorts)
      .set({
        status: 'archived',
        updatedAt: new Date(),
        updatedBy: user?.id ?? null,
      })
      .where(eq(cohorts.id, id))
      .returning();

    if (!cohort) throw new NotFoundException('Turma não encontrada.');

    await this.auditLogs.log({
      actorUserId: user?.id,
      action: 'archive',
      entityType: 'cohort',
      entityId: cohort.id,
      before: existing,
      after: cohort,
    });

    return cohort;
  }

  async restore(id: string, user?: AuthUser) {
    const [existing] = await this.database.db
      .select()
      .from(cohorts)
      .where(eq(cohorts.id, id))
      .limit(1);

    if (!existing) throw new NotFoundException('Turma não encontrada.');

    const [cohort] = await this.database.db
      .update(cohorts)
      .set({
        deletedAt: null,
        status: 'draft',
        updatedAt: new Date(),
        updatedBy: user?.id ?? null,
      })
      .where(eq(cohorts.id, id))
      .returning();

    if (!cohort) throw new NotFoundException('Turma não encontrada.');

    await this.auditLogs.log({
      actorUserId: user?.id,
      action: 'restore',
      entityType: 'cohort',
      entityId: cohort.id,
      before: existing,
      after: cohort,
    });

    return cohort;
  }

  async remove(id: string, user?: AuthUser) {
    const existing = await this.findByIdAdmin(id);
    if (user) assertOwnership(existing, user, { allowDraftOnly: false });

    const [cohort] = await this.database.db
      .update(cohorts)
      .set({
        deletedAt: new Date(),
        updatedBy: user?.id ?? null,
      })
      .where(eq(cohorts.id, id))
      .returning();

    await this.auditLogs.log({
      actorUserId: user?.id,
      action: 'delete',
      entityType: 'cohort',
      entityId: id,
      before: existing,
      after: cohort,
    });
  }

  async addDiscipline(cohortId: string, input: AddCohortDisciplineDto, user?: AuthUser) {
    await this.findByIdAdmin(cohortId);

    const [relation] = await this.database.db
      .insert(cohortDisciplines)
      .values({
        cohortId,
        disciplineId: input.disciplineId,
        position: input.position ?? 0,
        credits: input.credits,
        workloadHours: input.workloadHours,
        startDate: input.startDate ? new Date(input.startDate) : null,
        endDate: input.endDate ? new Date(input.endDate) : null,
        notes: input.notes,
      })
      .returning();

    await this.auditLogs.log({
      actorUserId: user?.id,
      action: 'create',
      entityType: 'cohort_discipline',
      entityId: relation!.id,
      after: relation,
    });

    return relation;
  }

  async removeDiscipline(cohortDisciplineId: string, user?: AuthUser) {
    const [deleted] = await this.database.db
      .delete(cohortDisciplines)
      .where(eq(cohortDisciplines.id, cohortDisciplineId))
      .returning();

    if (!deleted) throw new NotFoundException('Associação não encontrada.');

    await this.auditLogs.log({
      actorUserId: user?.id,
      action: 'delete',
      entityType: 'cohort_discipline',
      entityId: cohortDisciplineId,
      before: deleted,
    });
  }

  async addDisciplinePerson(cohortDisciplineId: string, input: AddDisciplinePersonDto, user?: AuthUser) {
    const [relation] = await this.database.db
      .insert(cohortDisciplinePeople)
      .values({
        cohortDisciplineId,
        personId: input.personId,
        role: input.role,
      })
      .returning();

    await this.auditLogs.log({
      actorUserId: user?.id,
      action: 'create',
      entityType: 'cohort_discipline_person',
      entityId: relation!.id,
      after: relation,
    });

    return relation;
  }

  async removeDisciplinePerson(cohortDisciplinePersonId: string, user?: AuthUser) {
    const [deleted] = await this.database.db
      .delete(cohortDisciplinePeople)
      .where(eq(cohortDisciplinePeople.id, cohortDisciplinePersonId))
      .returning();

    if (!deleted) throw new NotFoundException('Vínculo de pessoa não encontrado.');

    await this.auditLogs.log({
      actorUserId: user?.id,
      action: 'delete',
      entityType: 'cohort_discipline_person',
      entityId: cohortDisciplinePersonId,
      before: deleted,
    });
  }

  async addScheduleEntry(cohortDisciplineId: string, input: CreateScheduleEntryDto, user?: AuthUser) {
    const [entry] = await this.database.db
      .insert(scheduleEntries)
      .values({
        cohortDisciplineId,
        date: input.date ? new Date(input.date) : null,
        startTime: input.startTime,
        endTime: input.endTime,
        modality: input.modality ?? 'in_person',
        description: input.description,
        position: input.position ?? 0,
      })
      .returning();

    await this.auditLogs.log({
      actorUserId: user?.id,
      action: 'create',
      entityType: 'schedule_entry',
      entityId: entry!.id,
      after: entry,
    });

    return entry;
  }

  async removeScheduleEntry(scheduleEntryId: string, user?: AuthUser) {
    const [deleted] = await this.database.db
      .delete(scheduleEntries)
      .where(eq(scheduleEntries.id, scheduleEntryId))
      .returning();

    if (!deleted) throw new NotFoundException('Entrada de cronograma não encontrada.');

    await this.auditLogs.log({
      actorUserId: user?.id,
      action: 'delete',
      entityType: 'schedule_entry',
      entityId: scheduleEntryId,
      before: deleted,
    });
  }
}
