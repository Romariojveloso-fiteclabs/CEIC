import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { config } from './config/config.js';
import { setupSwagger } from './config/swagger.config.js';

export async function createApp() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  app.setGlobalPrefix('api');
  app.enableCors(config.cors);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));
  app.use((req: { method?: string; url?: string; originalUrl?: string }, _res: unknown, next: () => void) => {
    if (typeof req.url === 'string') {
      const [pathname, search] = req.url.split('?');
      const cleanPath = pathname?.replace(/\/+$/, '');
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
  await setupSwagger(app);
  app.enableShutdownHooks();
  if (config.app.swagger) {
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('CEIC API')
        .setVersion('0.1.0')
        .addCookieAuth('better-auth.session_token')
        .build(),
    );
    SwaggerModule.setup('docs', app, document, { useGlobalPrefix: true });
  }
  return app;
}
