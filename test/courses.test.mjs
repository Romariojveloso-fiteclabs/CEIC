import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { after, before, describe, it } from 'node:test';
import { startApi } from './helpers.mjs';

describe('Cursos, Workflow Editorial e RBAC com PostgreSQL real', () => {
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
      ['POST', '/api/v1/admin/courses'],
      ['PATCH', `/api/v1/admin/courses/${randomUUID()}`],
      ['DELETE', `/api/v1/admin/courses/${randomUUID()}`],
      ['PATCH', `/api/v1/admin/courses/${randomUUID()}/publish`],
      ['PATCH', `/api/v1/admin/courses/${randomUUID()}/archive`],
      ['PATCH', `/api/v1/admin/courses/${randomUUID()}/restore`],
    ]) {
      assert.equal((await api.request(path, { method, body: {} })).status, 401);
    }
  });

  it('author consegue criar curso como rascunho', async () => {
    const result = await api.request('/api/v1/admin/courses', {
      method: 'POST', cookie: author.cookie,
      body: { title: 'Curso CEIC', slug: `${api.prefix}-course`, description: 'Descrição' },
    });
    assert.equal(result.status, 201, JSON.stringify(result.data));
    course = result.data;
    assert.equal(course.status, 'draft');
    assert.equal(course.publishedAt, null);
    assert.match(course.id, /^[0-9a-f-]{36}$/);
  });

  it('rascunhos não aparecem nos endpoints públicos', async () => {
    const list = await api.request('/api/v1/courses');
    assert.equal(list.status, 200);
    assert.ok(list.data.every((item) => item.status === 'published'));
    assert.ok(!list.data.some((item) => item.id === course.id));
    assert.equal((await api.request(`/api/v1/courses/${course.slug}`)).status, 404);
  });

  it('author recebe 403 ao publicar ou excluir', async () => {
    assert.equal((await api.request(`/api/v1/admin/courses/${course.id}/publish`, {
      method: 'PATCH', cookie: author.cookie, body: {},
    })).status, 403);
    assert.equal((await api.request(`/api/v1/admin/courses/${course.id}`, {
      method: 'DELETE', cookie: author.cookie,
    })).status, 403);
  });

  it('POST e PATCH rejeitam publicação e alteração de status fora do endpoint específico', async () => {
    assert.equal((await api.request('/api/v1/admin/courses', {
      method: 'POST', cookie: author.cookie,
      body: { title: 'Tentativa', slug: `${api.prefix}-bypass`, status: 'published' },
    })).status, 400);
    assert.equal((await api.request(`/api/v1/admin/courses/${course.id}`, {
      method: 'PATCH', cookie: author.cookie, body: { status: 'published' },
    })).status, 400);
  });

  it('author consegue atualizar campos permitidos parcialmente', async () => {
    const result = await api.request(`/api/v1/admin/courses/${course.id}`, {
      method: 'PATCH', cookie: author.cookie, body: { title: 'Curso atualizado' },
    });
    assert.equal(result.status, 200, JSON.stringify(result.data));
    assert.equal(result.data.title, 'Curso atualizado');
    assert.equal(result.data.slug, course.slug);
    assert.ok(new Date(result.data.updatedAt) >= new Date(course.updatedAt));
  });

  it('slug duplicado retorna 409', async () => {
    assert.equal((await api.request('/api/v1/admin/courses', {
      method: 'POST', cookie: author.cookie, body: { title: 'Duplicado', slug: course.slug },
    })).status, 409);
  });

  it('valida entrada, UUIDs e recursos inexistentes', async () => {
    for (const body of [
      { title: ' ', slug: 'valid' }, { title: 'Curso', slug: 'invalid slug' },
      { title: 'Curso', slug: 'valid', description: null }, { title: 123, slug: 'valid' },
    ]) {
      assert.equal((await api.request('/api/v1/admin/courses', { method: 'POST', cookie: author.cookie, body })).status, 400);
    }
    assert.equal((await api.request(`/api/v1/admin/courses/${course.id}`, {
      method: 'PATCH', cookie: author.cookie, body: { title: null },
    })).status, 400);
    assert.equal((await api.request('/api/v1/admin/courses/not-a-uuid', {
      method: 'PATCH', cookie: author.cookie, body: { title: 'Curso' },
    })).status, 400);
    assert.equal((await api.request(`/api/v1/admin/courses/${randomUUID()}`, {
      method: 'PATCH', cookie: author.cookie, body: { title: 'Curso' },
    })).status, 404);
  });

  it('editor consegue publicar e a leitura funciona sem autenticação', async () => {
    const publishRes = await api.request(`/api/v1/admin/courses/${course.id}/publish`, {
      method: 'PATCH', cookie: editor.cookie, body: {},
    });
    assert.equal(publishRes.status, 200, JSON.stringify(publishRes.data));
    assert.equal(publishRes.data.status, 'published');
    assert.ok(publishRes.data.publishedAt);

    const list = await api.request('/api/v1/courses');
    assert.equal(list.status, 200);
    assert.ok(list.data.some((item) => item.id === course.id));

    const result = await api.request(`/api/v1/courses/${course.slug}`);
    assert.equal(result.status, 200);
    assert.equal(result.data.status, 'published');
  });

  it('editor consegue arquivar e o curso deixa de aparecer publicamente', async () => {
    const archiveRes = await api.request(`/api/v1/admin/courses/${course.id}/archive`, {
      method: 'PATCH', cookie: editor.cookie, body: {},
    });
    assert.equal(archiveRes.status, 200);
    assert.equal(archiveRes.data.status, 'archived');

    assert.equal((await api.request(`/api/v1/courses/${course.slug}`)).status, 404);
  });

  it('editor consegue restaurar de arquivado para draft', async () => {
    const restoreRes = await api.request(`/api/v1/admin/courses/${course.id}/restore`, {
      method: 'PATCH', cookie: editor.cookie, body: {},
    });
    assert.equal(restoreRes.status, 200);
    assert.equal(restoreRes.data.status, 'draft');
  });

  it('editor consegue realizar soft delete e restaurar curso', async () => {
    assert.equal((await api.request(`/api/v1/admin/courses/${course.id}`, {
      method: 'DELETE', cookie: editor.cookie,
    })).status, 204);

    assert.equal((await api.request(`/api/v1/admin/courses/${course.id}`, {
      method: 'DELETE', cookie: editor.cookie,
    })).status, 404);

    assert.equal((await api.request(`/api/v1/courses/${course.slug}`)).status, 404);

    const restored = await api.request(`/api/v1/admin/courses/${course.id}/restore`, {
      method: 'PATCH', cookie: editor.cookie, body: {},
    });
    assert.equal(restored.status, 200);
    assert.equal(restored.data.status, 'draft');
  });

  it('admin tem todas as permissões de conteúdo, cursos, turmas e administração', async () => {
    const permissions = {
      course: ['read', 'create', 'update', 'publish', 'delete', 'archive', 'restore'],
      media: ['read', 'upload', 'delete'],
      user: ['create', 'list', 'set-role', 'ban', 'delete', 'set-password'],
      session: ['list', 'revoke', 'delete'],
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
