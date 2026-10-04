import { Module } from '@nestjs/common';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { DatabaseModule } from '../database/database.module.js';
import { DatabaseService } from '../database/database.service.js';
import { EmailModule } from '../email/email.module.js';
import { EmailService } from '../email/email.service.js';
import { createAuth } from './auth.js';

@Module({
  imports: [BetterAuthModule.forRootAsync({
    imports: [DatabaseModule, EmailModule],
    inject: [DatabaseService, EmailService],
    useFactory: (database: DatabaseService, email: EmailService) => ({
      auth: createAuth(database.db, email),
      disableTrustedOriginsCors: true,
    }),
  })],
})
export class AuthModule {}
