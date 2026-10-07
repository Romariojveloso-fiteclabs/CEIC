import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import type { AuthUser } from '../../common/decorators/current-user.decorator.js';
import { DatabaseService } from '../../database/database.service.js';
import { siteSettings } from '../../database/schema/site-settings.schema.js';
import { AuditLogsService } from '../audit-logs/audit-logs.service.js';
import type { UpdateSiteSettingsDto } from './dto/update-site-settings.dto.js';

const SETTINGS_ID = 'default';

@Injectable()
export class SiteSettingsService {
  constructor(
    private readonly database: DatabaseService,
    private readonly auditLogs: AuditLogsService,
  ) {}

  async get() {
    const [existing] = await this.database.db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.id, SETTINGS_ID))
      .limit(1);

    if (existing) return existing;

    const [created] = await this.database.db
      .insert(siteSettings)
      .values({
        id: SETTINGS_ID,
        siteName: 'CEIC',
        siteDescription: 'Centro de Educação e Inovação',
        socialLinks: {},
      })
      .returning();

    return created;
  }

  async update(input: UpdateSiteSettingsDto, user?: AuthUser) {
    const existing = await this.get();

    const [updated] = await this.database.db
      .update(siteSettings)
      .set({
        ...input,
        updatedAt: new Date(),
        updatedBy: user?.id ?? null,
      })
      .where(eq(siteSettings.id, SETTINGS_ID))
      .returning();

    await this.auditLogs.log({
      actorUserId: user?.id,
      action: 'update',
      entityType: 'siteSettings',
      entityId: SETTINGS_ID,
      before: existing,
      after: updated,
    });

    return updated;
  }
}
