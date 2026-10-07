import { index, pgTable, primaryKey, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { user } from './auth.schema.js';
import { media } from './media.schema.js';
import { people } from './people.schema.js';

export const news = pgTable('news', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  slug: varchar('slug', { length: 200 }).notNull().unique(),
  summary: text('summary'),
  content: text('content').notNull().default(''),
  coverMediaId: uuid('cover_media_id').references(() => media.id, { onDelete: 'set null' }),
  status: varchar('status', { length: 20 }).notNull().default('draft'),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  createdBy: uuid('created_by').references(() => user.id, { onDelete: 'set null' }),
  updatedBy: uuid('updated_by').references(() => user.id, { onDelete: 'set null' }),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => [
  index('news_slug_idx').on(table.slug),
  index('news_status_idx').on(table.status),
  index('news_published_at_idx').on(table.publishedAt),
  index('news_deleted_at_idx').on(table.deletedAt),
]);

export const newsPeople = pgTable('news_people', {
  newsId: uuid('news_id').notNull().references(() => news.id, { onDelete: 'cascade' }),
  personId: uuid('person_id').notNull().references(() => people.id, { onDelete: 'cascade' }),
}, (table) => [
  primaryKey({ columns: [table.newsId, table.personId] }),
  index('news_people_news_id_idx').on(table.newsId),
  index('news_people_person_id_idx').on(table.personId),
]);
