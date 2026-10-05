import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { betterAuth } from 'better-auth';
import { APIError, createAuthMiddleware } from 'better-auth/api';
import { bearer, openAPI } from 'better-auth/plugins';
import { admin } from 'better-auth/plugins/admin';
import { config } from '../config/config.js';
import type { DatabaseService } from '../database/database.service.js';
import * as schema from '../database/schema/auth.schema.js';
import type { EmailService } from '../email/email.service.js';
import { accessControl, adminRole, defaultRole, roles } from './permissions.js';

export function createAuth(database: DatabaseService['db'], email: EmailService) {
  return betterAuth({
    appName: 'CEIC CMS',
    baseURL: config.auth.url,
    basePath: '/api/auth',
    secret: config.auth.secret,
    trustedOrigins: config.auth.trustedOrigins,
    database: drizzleAdapter(database, { provider: 'pg', schema }),
    advanced: {
      database: { generateId: 'uuid' },
      useSecureCookies: config.app.production,
      disableOriginCheck: false,
      disableCSRFCheck: false,
    },
    emailAndPassword: {
      enabled: true,
      revokeSessionsOnPasswordReset: true,
      sendResetPassword: ({ user, url }) => email.send({
        to: user.email,
        subject: 'Redefina sua senha — CEIC',
        text: `Para redefinir sua senha, acesse: ${url}`,
      }),
    },
    emailVerification: {
      sendOnSignUp: false,
      sendVerificationEmail: ({ user, url }) => email.send({
        to: user.email,
        subject: 'Confirme seu e-mail — CEIC',
        text: `Para confirmar seu e-mail, acesse: ${url}`,
      }),
    },
    hooks: {
      before: createAuthMiddleware(async (context) => {
        if (context.path === '/change-password') {
          return { context: { ...context, body: { ...context.body, revokeOtherSessions: true } } };
        }
        if (['/request-password-reset', '/send-verification-email'].includes(context.path) && !email.configured) {
          throw new APIError('SERVICE_UNAVAILABLE', {
            code: 'EMAIL_NOT_CONFIGURED',
            message: 'Configure RESEND_API_KEY para enviar e-mails de verificação e recuperação de senha.',
          });
        }
      }),
    },
    plugins: [
      admin({ ac: accessControl, roles, defaultRole, adminRoles: [adminRole] }),
      openAPI(),
      bearer(),
    ],
  });
}
