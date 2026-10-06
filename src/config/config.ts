import { env } from './env.js';

export const config = Object.freeze({
  app: { port: env.port, production: env.nodeEnv === 'production', swagger: env.swaggerEnabled },
  database: { url: env.databaseUrl },
  auth: {
    secret: env.secret,
    url: env.authUrl,
    trustedOrigins: [...new Set([...env.corsOrigins, new URL(env.frontendUrl).origin])],
  },
  cors: { origin: env.corsOrigins, credentials: true },
  email: { apiKey: env.resendApiKey, from: env.emailFrom },
  media: { storagePath: env.mediaStoragePath, maxFileSize: env.mediaMaxFileSize },
  pagination: { defaultPageSize: env.defaultPageSize, maxPageSize: env.maxPageSize },
});
