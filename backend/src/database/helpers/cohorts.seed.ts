import { and, eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import {
  cohortDisciplinePeople,
  cohortDisciplines,
  cohorts,
  scheduleEntries,
} from '../schema/index.js';

export async function seedCohorts(
  db: NodePgDatabase<Record<string, unknown>>,
  courseMap: Map<string, string>,
  disciplineMap: Map<string, string>,
  peopleMap: Map<string, string>,
  adminUserId?: string,
): Promise<void> {
  const defesaCourseId = courseMap.get('defesa-cibernetica');
  if (!defesaCourseId) return;

  const [existingCohort] = await db
    .select({ id: cohorts.id })
    .from(cohorts)
    .where(and(eq(cohorts.courseId, defesaCourseId), eq(cohorts.name, 'Turma Alfa - 2026.1')))
    .limit(1);

  let cohortId = existingCohort?.id;

  if (!cohortId) {
    const [inserted] = await db
      .insert(cohorts)
      .values({
        courseId: defesaCourseId,
        name: 'Turma Alfa - 2026.1',
        startDate: new Date('2026-03-01T00:00:00Z'),
        endDate: new Date('2026-11-30T00:00:00Z'),
        enrollmentStart: new Date('2026-01-15T00:00:00Z'),
        enrollmentEnd: new Date('2026-02-28T00:00:00Z'),
        enrollmentStatus: 'open',
        price: '5400.00',
        availableSeats: 35,
        classHours: 360,
        practicalHours: 120,
        registrationUrl: 'https://ceic.tec.br/inscricao/turma-alfa-2026-1',
        selectionNoticeUrl: 'https://ceic.tec.br/editais/edital-turma-alfa-2026-1.pdf',
        status: 'published',
        publishedAt: new Date('2026-01-15T12:00:00Z'),
        createdBy: adminUserId ?? null,
        updatedBy: adminUserId ?? null,
      })
      .returning({ id: cohorts.id });

    cohortId = inserted!.id;
  }

  const discDefesaId = disciplineMap.get('arquitetura-defesa-monitoramento');
  if (!discDefesaId) return;

  const [existingCohortDisc] = await db
    .select({ id: cohortDisciplines.id })
    .from(cohortDisciplines)
    .where(and(eq(cohortDisciplines.cohortId, cohortId), eq(cohortDisciplines.disciplineId, discDefesaId)))
    .limit(1);

  let cohortDisciplineId = existingCohortDisc?.id;

  if (!cohortDisciplineId) {
    const [insertedCohortDisc] = await db
      .insert(cohortDisciplines)
      .values({
        cohortId,
        disciplineId: discDefesaId,
        position: 1,
        credits: 4,
        workloadHours: 60,
        startDate: new Date('2026-03-01T00:00:00Z'),
        endDate: new Date('2026-04-30T00:00:00Z'),
        notes: 'Aulas teóricas e práticas em laboratório de telemetria.',
      })
      .returning({ id: cohortDisciplines.id });

    cohortDisciplineId = insertedCohortDisc!.id;
  }

  const profEduardoId = peopleMap.get('eduardo-ramos');
  if (profEduardoId) {
    const [existingPerson] = await db
      .select({ id: cohortDisciplinePeople.id })
      .from(cohortDisciplinePeople)
      .where(and(
        eq(cohortDisciplinePeople.cohortDisciplineId, cohortDisciplineId),
        eq(cohortDisciplinePeople.personId, profEduardoId),
      ))
      .limit(1);

    if (!existingPerson) {
      await db.insert(cohortDisciplinePeople).values({
        cohortDisciplineId,
        personId: profEduardoId,
        role: 'professor',
      });
    }
  }

  const [existingSchedule] = await db
    .select({ id: scheduleEntries.id })
    .from(scheduleEntries)
    .where(eq(scheduleEntries.cohortDisciplineId, cohortDisciplineId))
    .limit(1);

  if (!existingSchedule) {
    await db.insert(scheduleEntries).values({
      cohortDisciplineId,
      date: new Date('2026-03-07T00:00:00Z'),
      startTime: '08:30',
      endTime: '12:30',
      modality: 'hybrid',
      description: 'Aula Inaugural: Arquitetura de Defesa e Monitoramento de Redes.',
      position: 1,
    });
  }
}
