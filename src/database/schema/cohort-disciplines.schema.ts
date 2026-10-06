import { index, integer, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { cohorts } from './cohorts.schema.js';
import { disciplines } from './disciplines.schema.js';
import { people } from './people.schema.js';

export const cohortDisciplines = pgTable('cohort_disciplines', {
  id: uuid('id').defaultRandom().primaryKey(),
  cohortId: uuid('cohort_id').notNull().references(() => cohorts.id, { onDelete: 'cascade' }),
  disciplineId: uuid('discipline_id').notNull().references(() => disciplines.id, { onDelete: 'restrict' }),
  position: integer('position').notNull().default(0),
  credits: integer('credits'),
  workloadHours: integer('workload_hours'),
  startDate: timestamp('start_date', { withTimezone: true }),
  endDate: timestamp('end_date', { withTimezone: true }),
  notes: text('notes'),
}, (table) => [
  index('cohort_disciplines_cohort_id_idx').on(table.cohortId),
  index('cohort_disciplines_discipline_id_idx').on(table.disciplineId),
]);

export const cohortDisciplinePeople = pgTable('cohort_discipline_people', {
  id: uuid('id').defaultRandom().primaryKey(),
  cohortDisciplineId: uuid('cohort_discipline_id').notNull().references(() => cohortDisciplines.id, { onDelete: 'cascade' }),
  personId: uuid('person_id').notNull().references(() => people.id, { onDelete: 'restrict' }),
  role: varchar('role', { length: 50 }).notNull().default('professor'),
}, (table) => [
  index('cohort_discipline_people_cd_id_idx').on(table.cohortDisciplineId),
  index('cohort_discipline_people_person_id_idx').on(table.personId),
]);

export const scheduleEntries = pgTable('schedule_entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  cohortDisciplineId: uuid('cohort_discipline_id').notNull().references(() => cohortDisciplines.id, { onDelete: 'cascade' }),
  date: timestamp('date', { withTimezone: true }),
  startTime: varchar('start_time', { length: 10 }),
  endTime: varchar('end_time', { length: 10 }),
  modality: varchar('modality', { length: 20 }).notNull().default('in_person'),
  description: text('description'),
  position: integer('position').notNull().default(0),
}, (table) => [
  index('schedule_entries_cd_id_idx').on(table.cohortDisciplineId),
]);
