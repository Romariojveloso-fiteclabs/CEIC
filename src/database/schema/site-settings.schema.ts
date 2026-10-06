import { jsonb, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { user } from './auth.schema.js';
import { media } from './media.schema.js';

export const siteSettings = pgTable('site_settings', {
  id: varchar('id', { length: 50 }).primaryKey().default('default'),
  siteName: varchar('site_name', { length: 200 }).notNull(),
  siteDescription: text('site_description'),
  heroTitle: varchar('hero_title', { length: 200 }),
  heroSubtitle: text('hero_subtitle'),
  heroMediaId: uuid('hero_media_id').references(() => media.id, { onDelete: 'set null' }),
  contactEmail: varchar('contact_email', { length: 255 }),
  contactPhone: varchar('contact_phone', { length: 50 }),
  address: text('address'),
  socialLinks: jsonb('social_links').default({}).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  updatedBy: uuid('updated_by').references(() => user.id, { onDelete: 'set null' }),
});
