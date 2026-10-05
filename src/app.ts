import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { config } from './config/config.js';

export async function createApp() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  app.setGlobalPrefix('api');
  app.enableCors(config.cors);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));
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
