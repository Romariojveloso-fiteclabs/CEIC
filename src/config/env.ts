import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';

if (existsSync('.env')) loadEnvFile('.env');

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} é obrigatório.`);
  return value;
}

function httpUrl(name: string): string {
  const value = required(name);
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
    throw new Error(`${name} deve ser uma URL HTTP ou HTTPS sem credenciais.`);
  }
  return value;
}

function origin(value: string): string {
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol) || url.origin !== value) {
    throw new Error('CORS_ORIGIN deve conter origens HTTP/HTTPS exatas, separadas por vírgula.');
  }
  return value;
}

function readEnv() {
  const nodeEnv = process.env.NODE_ENV ?? 'development';
  if (!['development', 'test', 'production'].includes(nodeEnv)) {
    throw new Error('NODE_ENV inválido.');
  }
  const port = Number(process.env.PORT ?? 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT deve ser um inteiro entre 1 e 65535.');
  }
  const databaseUrl = required('DATABASE_URL');
  if (!['postgres:', 'postgresql:'].includes(new URL(databaseUrl).protocol)) {
    throw new Error('DATABASE_URL deve apontar para PostgreSQL.');
  }
  const secret = required('BETTER_AUTH_SECRET');
  if (Buffer.byteLength(secret) < 32) {
    throw new Error('BETTER_AUTH_SECRET deve ter pelo menos 32 bytes.');
  }
  const authUrl = httpUrl('BETTER_AUTH_URL');
  const frontendUrl = httpUrl('FRONTEND_URL');
  const corsOrigins = required('CORS_ORIGIN').split(',').map((value) => origin(value.trim()));
  if (nodeEnv === 'production' && [authUrl, frontendUrl, ...corsOrigins].some((url) => !url.startsWith('https://'))) {
    throw new Error('URLs públicas devem usar HTTPS em produção.');
  }
  return Object.freeze({
    nodeEnv,
    port,
    databaseUrl,
    secret,
    authUrl,
    frontendUrl,
    corsOrigins,
    resendApiKey: process.env.RESEND_API_KEY?.trim() || undefined,
    emailFrom: required('EMAIL_FROM'),
  });
}

export const env = readEnv();
