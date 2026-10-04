import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { after, before, describe, it } from 'node:test';
import { startApi } from './helpers.mjs';

describe('Cursos e RBAC com PostgreSQL real', () => {
  let api;
  let author;
  let editor;
  let admin;
  let course;

  before(async () => {
    api = await startApi();
    author = await api.signUp('author');
    editor = await api.signUp('editor');
    admin = await api.createAdmin();
    const role = await api.request('/api/auth/admin/set-role', {
      method: 'POST', cookie: admin.cookie, body: { userId: editor.data.user.id, role: 'editor' },
    });
    assert.equal(role.status, 200, JSON.stringify(role.data));
    editor = { ...editor, ...await api.signIn(editor.email) };
  });

  after(async () => { if (api) await api.close(); });

  it('retorna 401 em todas as operações protegidas sem sessão', async () => {
    for (const [method, path] of [
      ['POST', '/api/courses'], ['PATCH', `/api/courses/${randomUUID()}`],
      ['DELETE', `/api/courses/${randomUUID()}`], ['PATCH', `/api/courses/${randomUUID()}/publish`],
    ]) {
      assert.equal((await api.request(path, { method, body: {} })).status, 401);
    }
  });

  it('author consegue criar curso como rascunho', async () => {
    const result = await api.request('/api/courses', {
      method: 'POST', cookie: author.cookie,
      body: { title: 'Curso CEIC', slug: `${api.prefix}-course`, description: 'Descrição' },
    });
    assert.equal(result.status, 201, JSON.stringify(result.data));
    course = result.data;
    assert.equal(course.published, false);
    assert.match(course.id, /^[0-9a-f-]{36}$/);
  });

  it('rascunhos não aparecem nos endpoints públicos', async () => {
    const list = await api.request('/api/courses');
    assert.equal(list.status, 200);
    assert.ok(list.data.every((item) => item.published));
    assert.ok(!list.data.some((item) => item.id === course.id));
    assert.equal((await api.request(`/api/courses/${course.slug}`)).status, 404);
  });

  it('author recebe 403 ao publicar ou excluir', async () => {
    assert.equal((await api.request(`/api/courses/${course.id}/publish`, {
      method: 'PATCH', cookie: author.cookie, body: { published: true },
    })).status, 403);
    assert.equal((await api.request(`/api/courses/${course.id}`, {
      method: 'DELETE', cookie: author.cookie,
    })).status, 403);
  });

  it('POST e PATCH rejeitam publicação fora do endpoint específico', async () => {
    assert.equal((await api.request('/api/courses', {
      method: 'POST', cookie: author.cookie,
      body: { title: 'Tentativa', slug: `${api.prefix}-bypass`, published: true },
    })).status, 400);
    assert.equal((await api.request(`/api/courses/${course.id}`, {
      method: 'PATCH', cookie: author.cookie, body: { published: true },
    })).status, 400);
  });

  it('author consegue atualizar campos permitidos parcialmente', async () => {
    const result = await api.request(`/api/courses/${course.id}`, {
      method: 'PATCH', cookie: author.cookie, body: { title: 'Curso atualizado' },
    });
    assert.equal(result.status, 200, JSON.stringify(result.data));
    assert.equal(result.data.title, 'Curso atualizado');
    assert.equal(result.data.slug, course.slug);
    assert.ok(new Date(result.data.updatedAt) >= new Date(course.updatedAt));
  });

  it('slug duplicado retorna 409', async () => {
    assert.equal((await api.request('/api/courses', {
      method: 'POST', cookie: author.cookie, body: { title: 'Duplicado', slug: course.slug },
    })).status, 409);
  });

  it('valida entrada, UUIDs e recursos inexistentes', async () => {
    for (const body of [
      { title: ' ', slug: 'valid' }, { title: 'Curso', slug: 'invalid slug' },
      { title: 'Curso', slug: 'valid', description: null }, { title: 123, slug: 'valid' },
    ]) assert.equal((await api.request('/api/courses', { method: 'POST', cookie: author.cookie, body })).status, 400);
    assert.equal((await api.request(`/api/courses/${course.id}`, {
      method: 'PATCH', cookie: author.cookie, body: { title: null },
    })).status, 400);
    assert.equal((await api.request('/api/courses/not-a-uuid', {
      method: 'PATCH', cookie: author.cookie, body: { title: 'Curso' },
    })).status, 400);
    assert.equal((await api.request(`/api/courses/${randomUUID()}`, {
      method: 'PATCH', cookie: author.cookie, body: { title: 'Curso' },
    })).status, 404);
  });

  it('editor consegue publicar e a leitura funciona sem autenticação', async () => {
    assert.equal((await api.request(`/api/courses/${course.id}/publish`, {
      method: 'PATCH', cookie: editor.cookie, body: { published: true },
    })).status, 200);
    const list = await api.request('/api/courses');
    assert.ok(list.data.some((item) => item.id === course.id));
    const result = await api.request(`/api/courses/${course.slug}`);
    assert.equal(result.status, 200);
    assert.equal(result.data.published, true);
  });

  it('editor consegue despublicar e excluir', async () => {
    assert.equal((await api.request(`/api/courses/${course.id}/publish`, {
      method: 'PATCH', cookie: editor.cookie, body: { published: false },
    })).status, 200);
    assert.equal((await api.request(`/api/courses/${course.slug}`)).status, 404);
    assert.equal((await api.request(`/api/courses/${course.id}`, {
      method: 'DELETE', cookie: editor.cookie,
    })).status, 204);
    assert.equal((await api.request(`/api/courses/${course.id}`, {
      method: 'DELETE', cookie: editor.cookie,
    })).status, 404);
  });

  it('admin tem todas as permissões de conteúdo, mídia e administração', async () => {
    const permissions = {
      content: ['read', 'create', 'update', 'publish', 'delete'], media: ['read', 'upload', 'delete'],
      user: ['create', 'list', 'set-role', 'ban', 'delete', 'set-password'], session: ['list', 'revoke', 'delete'],
    };
    const result = await api.request('/api/auth/admin/has-permission', {
      method: 'POST', cookie: admin.cookie, body: { permissions },
    });
    assert.equal(result.status, 200);
    assert.equal(result.data.success, true);
  });

  it('author não consegue promover a si próprio a admin', async () => {
    assert.equal((await api.request('/api/auth/admin/set-role', {
      method: 'POST', cookie: author.cookie, body: { userId: author.data.user.id, role: 'admin' },
    })).status, 403);
  });
});
