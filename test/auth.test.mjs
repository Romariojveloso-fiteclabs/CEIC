import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { emailUrl, startApi } from './helpers.mjs';

describe('Autenticação, sessão e e-mails', () => {
  let api;
  let author;

  before(async () => { api = await startApi(); });
  after(async () => { if (api) await api.close(); });

  it('cadastro atribui author e impede role enviada pelo cliente', async () => {
    const forged = await api.request('/api/auth/sign-up/email', {
      method: 'POST', body: {
        name: 'Forged', email: `${api.prefix}-forged@example.invalid`,
        password: 'Ceic-forged-password', role: 'admin',
      },
    });
    assert.equal(forged.status, 400);
    author = await api.signUp('author');
    assert.equal(author.data.user.role, 'author');
    assert.ok(author.cookie.includes('session_token='));
  });

  it('login gera uma sessão reconhecida por cookie', async () => {
    const login = await api.signIn(author.email);
    assert.equal(login.status, 200);
    const session = await api.request('/api/auth/get-session', { cookie: login.cookie });
    assert.equal(session.status, 200);
    assert.equal(session.data.user.id, author.data.user.id);
    author.cookie = login.cookie;
  });

  it('senha incorreta é recusada', async () => {
    assert.equal((await api.signIn(author.email, 'incorrect-password')).status, 401);
  });

  it('CORS permite a origem configurada com credenciais', async () => {
    const result = await api.request('/api/courses');
    assert.equal(result.headers.get('access-control-allow-origin'), api.origin);
    assert.equal(result.headers.get('access-control-allow-credentials'), 'true');
    const blocked = await api.request('/api/auth/sign-out', {
      method: 'POST', requestOrigin: 'https://untrusted.example', cookie: author.cookie, body: {},
    });
    assert.equal(blocked.status, 403);
    assert.notEqual(blocked.headers.get('access-control-allow-origin'), 'https://untrusted.example');
  });

  it('verificação aciona o SDK Resend e o link confirma o e-mail', async () => {
    const result = await api.request('/api/auth/send-verification-email', {
      method: 'POST', body: { email: author.email, callbackURL: api.origin },
    });
    assert.equal(result.status, 200, JSON.stringify(result.data));
    const message = api.messages.at(-1);
    assert.equal(message.to, author.email);
    assert.match(message.subject, /Confirme/);
    const url = emailUrl(message);
    const verification = await api.request(`${url.pathname}${url.search}`);
    assert.equal(verification.status, 302);
    const session = await api.request('/api/auth/get-session', { cookie: author.cookie });
    assert.equal(session.data.user.emailVerified, true);
  });

  it('alteração de senha revoga outras sessões mesmo se o cliente pedir false', async () => {
    const other = await api.signIn(author.email);
    const newPassword = `${author.password}-changed`;
    const change = await api.request('/api/auth/change-password', {
      method: 'POST', cookie: author.cookie,
      body: { currentPassword: author.password, newPassword, revokeOtherSessions: false },
    });
    assert.equal(change.status, 200, JSON.stringify(change.data));
    const stale = await api.request('/api/auth/get-session', { cookie: other.cookie });
    assert.equal(stale.data, null);
    assert.equal((await api.signIn(author.email, author.password)).status, 401);
    const login = await api.signIn(author.email, newPassword);
    assert.equal(login.status, 200);
    author = { ...author, password: newPassword, cookie: login.cookie };
  });

  it('reset aciona Resend, muda a senha e revoga todas as sessões', async () => {
    const other = await api.signIn(author.email, author.password);
    const reset = await api.request('/api/auth/request-password-reset', {
      method: 'POST', body: { email: author.email, redirectTo: `${api.origin}/reset-password` },
    });
    assert.equal(reset.status, 200, JSON.stringify(reset.data));
    const message = api.messages.at(-1);
    assert.equal(message.to, author.email);
    assert.match(message.subject, /Redefina/);
    const token = emailUrl(message).pathname.split('/').at(-1);
    const newPassword = `${author.password}-reset`;
    const result = await api.request('/api/auth/reset-password', {
      method: 'POST', body: { token, newPassword },
    });
    assert.equal(result.status, 200, JSON.stringify(result.data));
    for (const cookie of [author.cookie, other.cookie]) {
      assert.equal((await api.request('/api/auth/get-session', { cookie })).data, null);
      assert.equal((await api.request('/api/courses', {
        method: 'POST', cookie, body: { title: 'Revogado', slug: `${api.prefix}-revoked` },
      })).status, 401);
    }
    assert.equal((await api.signIn(author.email, author.password)).status, 401);
    const login = await api.signIn(author.email, newPassword);
    assert.equal(login.status, 200);
    author = { ...author, password: newPassword, cookie: login.cookie };
    assert.notEqual((await api.request('/api/auth/reset-password', {
      method: 'POST', body: { token, newPassword: `${newPassword}-reuse` },
    })).status, 200);
  });

  it('logout invalida a sessão', async () => {
    assert.equal((await api.request('/api/auth/sign-out', {
      method: 'POST', cookie: author.cookie, body: {},
    })).status, 200);
    assert.equal((await api.request('/api/auth/get-session', { cookie: author.cookie })).data, null);
  });
});
