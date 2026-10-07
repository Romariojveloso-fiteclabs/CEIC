import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { loadEnvFile } from 'node:process';
import { mock } from 'node:test';
import { and, eq, inArray, like, or } from 'drizzle-orm';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

loadEnvFile('.env');
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;

export async function startApi({ email = true } = {}) {
  process.env.RESEND_API_KEY = email ? 're_ceic_acceptance_test_only' : '';
  const messages = [];
  const actualFetch = globalThis.fetch;
  mock.method(globalThis, 'fetch', async (input, options) => {
    const url = new URL(typeof input === 'string' ? input : input.url);
    if (url.hostname === 'api.resend.com') {
      assert.equal(url.pathname, '/emails');
      assert.equal(options.headers.get('Authorization'), 'Bearer re_ceic_acceptance_test_only');
      messages.push(JSON.parse(options.body));
      return Response.json({ id: randomUUID() });
    }
    assert.ok(['127.0.0.1', 'localhost'].includes(url.hostname));
    return actualFetch(input, options);
  });
  const { createApp } = await import('../src/app.js');
  const { AuthService } = await import('@thallesp/nestjs-better-auth');
  const { DatabaseService } = await import('../src/database/database.service.js');
  const schema = await import('../src/database/schema/auth.schema.js');
  const { courses } = await import('../src/database/schema/courses.schema.js');
  const { config } = await import('../src/config/config.js');
  const app = await createApp();
  app.useLogger(false);
  const database = app.get(DatabaseService);
  await migrate(database.db, { migrationsFolder: './drizzle' });
  await app.listen(0, '127.0.0.1');
  const baseUrl = await app.getUrl();
  const auth = app.get(AuthService).instance;
  const prefix = `e2e-${randomUUID()}`;
  const users = [];
  const password = `Ceic-${randomUUID()}`;
  const origin = config.cors.origin[0];

  async function request(path, { method = 'GET', body, cookie, requestOrigin = origin } = {}) {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    const response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        Origin: requestOrigin,
        ...(isFormData ? {} : (body === undefined ? {} : { 'Content-Type': 'application/json' })),
        ...(cookie ? { Cookie: cookie } : {}),
      },
      body: isFormData ? body : (body === undefined ? undefined : JSON.stringify(body)),
      redirect: 'manual',
    });
    const text = await response.text();
    let data;
    try {
      data = text ? JSON.parse(text) : undefined;
    } catch {
      data = text;
    }
    const cookies = response.headers.getSetCookie().map((value) => value.split(';')[0]).join('; ');
    return { status: response.status, data, text, cookie: cookies, headers: response.headers };
  }

  async function signUp(name, extra = {}) {
    const email = `${prefix}-${name}@example.invalid`;
    const result = await request('/api/auth/sign-up/email', {
      method: 'POST', body: { name, email, password, ...extra },
    });
    assert.equal(result.status, 200, JSON.stringify(result.data));
    users.push(result.data.user);
    return { ...result, email, password };
  }

  async function signIn(email, currentPassword = password) {
    return request('/api/auth/sign-in/email', {
      method: 'POST', body: { email, password: currentPassword },
    });
  }

  async function createAdmin() {
    const { adminRole } = await import('../src/auth/permissions.js');
    const email = `${prefix}-admin@example.invalid`;
    const { user } = await auth.api.createUser({ body: { name: 'Admin', email, password, role: adminRole } });
    users.push(user);
    const session = await signIn(email);
    assert.equal(session.status, 200, JSON.stringify(session.data));
    return { ...session, email, password, user };
  }

  async function close() {
    try {
      await database.db.delete(courses).where(like(courses.slug, `${prefix}-%`));
      if (users.length) {
        const ids = users.map((user) => user.id);
        await database.db.delete(schema.verification).where(or(
          inArray(schema.verification.value, ids),
          inArray(schema.verification.identifier, users.map((user) => user.email)),
        ));
        await database.db.delete(schema.user).where(and(
          inArray(schema.user.id, ids), like(schema.user.email, `${prefix}-%`),
        ));
      }
    } finally {
      await app.close();
      mock.restoreAll();
    }
  }

  return { request, signUp, signIn, createAdmin, close, messages, prefix, origin, database, schema };
}

export function emailUrl(message) {
  return new URL(message.text.match(/https?:\/\/\S+/)[0]);
}
