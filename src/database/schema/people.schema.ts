import { index, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { user } from './auth.schema.js';
import { media } from './media.schema.js';

export const people = pgTable('people', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  slug: varchar('slug', { length: 200 }).notNull().unique(),
  title: varchar('title', { length: 200 }),
  organization: varchar('organization', { length: 200 }),
  bio: text('bio'),
  photoMediaId: uuid('photo_media_id').references(() => media.id, { onDelete: 'set null' }),
  email: varchar('email', { length: 255 }),
  linkedinUrl: text('linkedin_url'),
  websiteUrl: text('website_url'),
  status: varchar('status', { length: 20 }).notNull().default('draft'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  createdBy: uuid('created_by').references(() => user.id, { onDelete: 'set null' }),
  updatedBy: uuid('updated_by').references(() => user.id, { onDelete: 'set null' }),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => [
  index('people_slug_idx').on(table.slug),
  index('people_status_idx').on(table.status),
  index('people_deleted_at_idx').on(table.deletedAt),
]);
