import { index, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { user } from './auth.schema.js';

export const pages = pgTable('pages', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  slug: varchar('slug', { length: 200 }).notNull().unique(),
  summary: text('summary'),
  content: text('content').notNull().default(''),
  status: varchar('status', { length: 20 }).notNull().default('draft'),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  createdBy: uuid('created_by').references(() => user.id, { onDelete: 'set null' }),
  updatedBy: uuid('updated_by').references(() => user.id, { onDelete: 'set null' }),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => [
  index('pages_slug_idx').on(table.slug),
  index('pages_status_idx').on(table.status),
  index('pages_deleted_at_idx').on(table.deletedAt),
]);
