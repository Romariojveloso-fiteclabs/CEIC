import { index, integer, jsonb, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { user } from './auth.schema.js';

export const disciplines = pgTable('disciplines', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  slug: varchar('slug', { length: 200 }).notNull().unique(),
  syllabus: text('syllabus'),
  bibliography: jsonb('bibliography').default([]).notNull(),
  defaultCredits: integer('default_credits'),
  defaultWorkloadHours: integer('default_workload_hours'),
  status: varchar('status', { length: 20 }).notNull().default('draft'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  createdBy: uuid('created_by').references(() => user.id, { onDelete: 'set null' }),
  updatedBy: uuid('updated_by').references(() => user.id, { onDelete: 'set null' }),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => [
  index('disciplines_slug_idx').on(table.slug),
  index('disciplines_status_idx').on(table.status),
  index('disciplines_deleted_at_idx').on(table.deletedAt),
]);
