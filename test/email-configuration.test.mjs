import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { startApi } from './helpers.mjs';

describe('Configuração ausente do Resend', () => {
  let api;
  let user;

  before(async () => {
    api = await startApi({ email: false });
    user = await api.signUp('without-email');
  });
  after(async () => { if (api) await api.close(); });

  it('API e login funcionam sem chave de e-mail', async () => {
    assert.equal((await api.request('/api/courses')).status, 200);
    assert.equal((await api.signIn(user.email)).status, 200);
  });

  for (const operation of ['request-password-reset', 'send-verification-email']) {
    it(`${operation} retorna 503 com instrução clara`, async () => {
      const result = await api.request(`/api/auth/${operation}`, {
        method: 'POST', body: { email: user.email },
      });
      assert.equal(result.status, 503, JSON.stringify(result.data));
      assert.equal(result.data.code, 'EMAIL_NOT_CONFIGURED');
      assert.match(result.data.message, /RESEND_API_KEY/);
      assert.equal(api.messages.length, 0);
    });
  }
});
