import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { after, before, describe, it } from 'node:test';
import { startApi } from './helpers.mjs';

describe('Módulo de Mídia e Armazenamento Seguro', () => {
  let api;
  let admin;
  let mediaItem;

  before(async () => {
    api = await startApi();
    admin = await api.createAdmin();
  });

  after(async () => {
    if (api) await api.close();
  });

  it('anônimo recebe 401 ao tentar fazer upload de arquivo', async () => {
    const form = new FormData();
    form.append('file', new Blob([Buffer.from('fake-png-content')], { type: 'image/png' }), 'test.png');
    const res = await api.request('/api/v1/admin/media', {
      method: 'POST',
      body: form,
    });
    assert.equal(res.status, 401);
  });

  it('faz upload de imagem válida com multipart/form-data', async () => {
    const pngBytes = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
      0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
    ]);
    const form = new FormData();
    form.append('file', new Blob([pngBytes], { type: 'image/png' }), 'logo-ceic.png');
    form.append('alt', 'Logotipo oficial do CEIC');

    const res = await api.request('/api/v1/admin/media', {
      method: 'POST',
      cookie: admin.cookie,
      body: form,
    });
    assert.equal(res.status, 201, JSON.stringify(res.data));
    mediaItem = res.data;
    assert.equal(mediaItem.originalFilename, 'logo-ceic.png');
    assert.equal(mediaItem.mimeType, 'image/png');
    assert.equal(mediaItem.alt, 'Logotipo oficial do CEIC');
    assert.match(mediaItem.id, /^[0-9a-f-]{36}$/);
    assert.ok(mediaItem.size > 0);
  });

  it('permite acesso público ao arquivo via GET /api/v1/media/:id', async () => {
    const res = await api.request(`/api/v1/media/${mediaItem.id}`);
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('content-type'), 'image/png');
    assert.ok(res.text.length > 0);
  });

  it('rejeita arquivo com MIME type não permitido', async () => {
    const form = new FormData();
    form.append('file', new Blob([Buffer.from('<script>alert(1)</script>')], { type: 'text/html' }), 'malicious.html');

    const res = await api.request('/api/v1/admin/media', {
      method: 'POST',
      cookie: admin.cookie,
      body: form,
    });
    assert.equal(res.status, 400);
  });

  it('rejeita arquivo com tamanho superior ao limite configurado', async () => {
    const hugeBuffer = Buffer.alloc(11 * 1024 * 1024);
    const form = new FormData();
    form.append('file', new Blob([hugeBuffer], { type: 'image/jpeg' }), 'huge.jpg');

    const res = await api.request('/api/v1/admin/media', {
      method: 'POST',
      cookie: admin.cookie,
      body: form,
    });
    assert.equal(res.status, 400);
  });

  it('lista mídias cadastradas no endpoint administrativo', async () => {
    const res = await api.request('/api/v1/admin/media', {
      cookie: admin.cookie,
    });
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.data.data));
    assert.ok(res.data.data.some((m) => m.id === mediaItem.id));
  });

  it('executa soft delete da mídia e a consulta pública passa a retornar 404', async () => {
    const delRes = await api.request(`/api/v1/admin/media/${mediaItem.id}`, {
      method: 'DELETE',
      cookie: admin.cookie,
    });
    assert.equal(delRes.status, 204);

    const checkRes = await api.request(`/api/v1/media/${mediaItem.id}`);
    assert.equal(checkRes.status, 404);
  });
});
