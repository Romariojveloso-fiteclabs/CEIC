import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module.js';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module.js';
import { CohortsModule } from './modules/cohorts/cohorts.module.js';
import { CoursesModule } from './modules/courses/courses.module.js';
import { DisciplinesModule } from './modules/disciplines/disciplines.module.js';
import { HealthModule } from './modules/health/health.module.js';
import { MediaModule } from './modules/media/media.module.js';
import { MentorshipsModule } from './modules/mentorships/mentorships.module.js';
import { NewsModule } from './modules/news/news.module.js';
import { PagesModule } from './modules/pages/pages.module.js';
import { PartnersModule } from './modules/partners/partners.module.js';
import { PeopleModule } from './modules/people/people.module.js';
import { SiteSettingsModule } from './modules/site-settings/site-settings.module.js';

@Module({
  imports: [
    AuthModule,
    AuditLogsModule,
    MediaModule,
    CoursesModule,
    CohortsModule,
    DisciplinesModule,
    PeopleModule,
    PagesModule,
    NewsModule,
    PartnersModule,
    MentorshipsModule,
    SiteSettingsModule,
    HealthModule,
  ],
})
export class AppModule {}
