import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { startApi } from './helpers.mjs';

describe('Healthcheck e Readiness da API', () => {
  let api;

  before(async () => {
    api = await startApi();
  });

  after(async () => {
    if (api) await api.close();
  });

  it('GET /api/health retorna 200 com status ok sem exigir autenticação', async () => {
    const res = await api.request('/api/health');
    assert.equal(res.status, 200);
    assert.deepEqual(res.data, { status: 'ok' });
  });

  it('GET /api/health/ready valida conectividade ativa com PostgreSQL', async () => {
    const res = await api.request('/api/health/ready');
    assert.equal(res.status, 200);
    assert.deepEqual(res.data, { status: 'ok', database: 'connected' });
  });
});
