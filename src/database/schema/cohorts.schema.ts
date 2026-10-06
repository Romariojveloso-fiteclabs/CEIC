import { index, integer, numeric, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { user } from './auth.schema.js';
import { courses } from './courses.schema.js';

export const cohorts = pgTable('cohorts', {
  id: uuid('id').defaultRandom().primaryKey(),
  courseId: uuid('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 200 }).notNull(),
  startDate: timestamp('start_date', { withTimezone: true }),
  endDate: timestamp('end_date', { withTimezone: true }),
  enrollmentStart: timestamp('enrollment_start', { withTimezone: true }),
  enrollmentEnd: timestamp('enrollment_end', { withTimezone: true }),
  enrollmentStatus: varchar('enrollment_status', { length: 20 }).notNull().default('upcoming'),
  registrationUrl: text('registration_url'),
  selectionNoticeUrl: text('selection_notice_url'),
  classHours: integer('class_hours'),
  practicalHours: integer('practical_hours'),
  price: numeric('price', { precision: 10, scale: 2 }),
  availableSeats: integer('available_seats'),
  status: varchar('status', { length: 20 }).notNull().default('draft'),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  createdBy: uuid('created_by').references(() => user.id, { onDelete: 'set null' }),
  updatedBy: uuid('updated_by').references(() => user.id, { onDelete: 'set null' }),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => [
  index('cohorts_course_id_idx').on(table.courseId),
  index('cohorts_status_idx').on(table.status),
  index('cohorts_enrollment_status_idx').on(table.enrollmentStatus),
  index('cohorts_deleted_at_idx').on(table.deletedAt),
]);
