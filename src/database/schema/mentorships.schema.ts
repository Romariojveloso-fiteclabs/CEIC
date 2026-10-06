import { index, integer, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { user } from './auth.schema.js';
import { people } from './people.schema.js';

export const mentorships = pgTable('mentorships', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  slug: varchar('slug', { length: 200 }).notNull().unique(),
  shortDescription: text('short_description'),
  description: text('description').notNull().default(''),
  mentorPersonId: uuid('mentor_person_id').references(() => people.id, { onDelete: 'set null' }),
  durationMonths: integer('duration_months'),
  workloadHours: integer('workload_hours'),
  applicationUrl: text('application_url'),
  noticeUrl: text('notice_url'),
  status: varchar('status', { length: 20 }).notNull().default('draft'),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  createdBy: uuid('created_by').references(() => user.id, { onDelete: 'set null' }),
  updatedBy: uuid('updated_by').references(() => user.id, { onDelete: 'set null' }),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => [
  index('mentorships_slug_idx').on(table.slug),
  index('mentorships_status_idx').on(table.status),
  index('mentorships_deleted_at_idx').on(table.deletedAt),
]);

export const mentorshipScheduleEntries = pgTable('mentorship_schedule_entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  mentorshipId: uuid('mentorship_id').notNull().references(() => mentorships.id, { onDelete: 'cascade' }),
  date: timestamp('date', { withTimezone: true }),
  startTime: varchar('start_time', { length: 10 }),
  endTime: varchar('end_time', { length: 10 }),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  position: integer('position').notNull().default(0),
}, (table) => [
  index('mentorship_schedules_mentorship_id_idx').on(table.mentorshipId),
]);
