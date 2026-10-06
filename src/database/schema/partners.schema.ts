import { index, integer, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { user } from './auth.schema.js';
import { media } from './media.schema.js';
import { people } from './people.schema.js';

export const partners = pgTable('partners', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  slug: varchar('slug', { length: 200 }).notNull().unique(),
  description: text('description'),
  logoMediaId: uuid('logo_media_id').references(() => media.id, { onDelete: 'set null' }),
  websiteUrl: text('website_url'),
  representativePersonId: uuid('representative_person_id').references(() => people.id, { onDelete: 'set null' }),
  testimonial: text('testimonial'),
  position: integer('position').notNull().default(0),
  status: varchar('status', { length: 20 }).notNull().default('draft'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  createdBy: uuid('created_by').references(() => user.id, { onDelete: 'set null' }),
  updatedBy: uuid('updated_by').references(() => user.id, { onDelete: 'set null' }),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => [
  index('partners_slug_idx').on(table.slug),
  index('partners_status_idx').on(table.status),
  index('partners_position_idx').on(table.position),
  index('partners_deleted_at_idx').on(table.deletedAt),
]);
