import { index, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { user } from './auth.schema.js';
import { media } from './media.schema.js';

export const courses = pgTable('courses', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  slug: varchar('slug', { length: 200 }).notNull().unique(),
  shortDescription: text('short_description'),
  description: text('description').notNull().default(''),
  coverMediaId: uuid('cover_media_id').references(() => media.id, { onDelete: 'set null' }),
  status: varchar('status', { length: 20 }).notNull().default('draft'),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  createdBy: uuid('created_by').references(() => user.id, { onDelete: 'set null' }),
  updatedBy: uuid('updated_by').references(() => user.id, { onDelete: 'set null' }),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => [
  index('courses_slug_idx').on(table.slug),
  index('courses_status_idx').on(table.status),
  index('courses_deleted_at_idx').on(table.deletedAt),
  index('courses_published_at_idx').on(table.publishedAt),
]);
