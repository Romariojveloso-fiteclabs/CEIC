import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { config } from './config/config.js';
import { setupSwagger } from './config/swagger.config.js';

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_ATTEMPTS = 60;

const SENSITIVE_AUTH_PATHS = new Set([
  '/api/auth/sign-in',
  '/api/auth/sign-in/email',
  '/api/auth/sign-up',
  '/api/auth/sign-up/email',
  '/api/auth/request-password-reset',
  '/api/auth/send-verification-email',
]);

export async function createApp() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  app.setGlobalPrefix('api');
  app.enableCors(config.cors);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));

  app.use((
    req: { method?: string; url?: string; originalUrl?: string; ip?: string; socket?: { remoteAddress?: string } },
    res: { setHeader?: (k: string, v: string) => void; status?: (code: number) => { json: (data: unknown) => void } },
    next: () => void,
  ) => {
    res.setHeader?.('X-Content-Type-Options', 'nosniff');
    res.setHeader?.('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader?.('Referrer-Policy', 'strict-origin-when-cross-origin');

    if (typeof req.url === 'string') {
      const [pathname, search] = req.url.split('?');
      const cleanPath = pathname?.replace(/\/+$/, '') ?? '';

      if (req.method === 'POST' && SENSITIVE_AUTH_PATHS.has(cleanPath)) {
        const clientIp = req.ip || req.socket?.remoteAddress || 'unknown';
        const key = `${clientIp}:${cleanPath}`;
        const now = Date.now();
        const entry = rateLimitMap.get(key);

        if (entry && now < entry.resetAt) {
          entry.count += 1;
          if (entry.count > RATE_LIMIT_MAX_ATTEMPTS) {
            res.status?.(429).json({
              statusCode: 429,
              message: 'Muitas tentativas. Tente novamente em instantes.',
              error: 'Too Many Requests',
            });
            return;
          }
        } else {
          rateLimitMap.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
        }
      }

      if (req.method === 'POST') {
        if (cleanPath === '/api/auth/sign-in' || cleanPath === '/api/auth/login') {
          const target = `/api/auth/sign-in/email${search ? `?${search}` : ''}`;
          req.url = target;
          req.originalUrl = target;
        } else if (cleanPath === '/api/auth/sign-up' || cleanPath === '/api/auth/register') {
          const target = `/api/auth/sign-up/email${search ? `?${search}` : ''}`;
          req.url = target;
          req.originalUrl = target;
        }
      } else if (req.method === 'GET' && cleanPath === '/api/auth/session') {
        const target = `/api/auth/get-session${search ? `?${search}` : ''}`;
        req.url = target;
        req.originalUrl = target;
      }
    }
    next();
  });

  if (config.app.swagger) {
    await setupSwagger(app);
  }
  app.enableShutdownHooks();

  return app;
}
