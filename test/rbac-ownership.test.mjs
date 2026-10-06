import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { after, before, describe, it } from 'node:test';
import { startApi } from './helpers.mjs';

describe('RBAC e Ownership Granular no CMS', () => {
  let api;
  let author1;
  let author2;
  let editor;
  let admin;
  let page;

  before(async () => {
    api = await startApi();
    author1 = await api.signUp('author-one');
    author2 = await api.signUp('author-two');
    editor = await api.signUp('editor-user');
    admin = await api.createAdmin();

    const setEditorRole = await api.request('/api/auth/admin/set-role', {
      method: 'POST',
      cookie: admin.cookie,
      body: { userId: editor.data.user.id, role: 'editor' },
    });
    assert.equal(setEditorRole.status, 200, JSON.stringify(setEditorRole.data));
    editor = { ...editor, ...await api.signIn(editor.email) };
  });

  after(async () => {
    if (api) await api.close();
  });

  it('anônimo recebe 401 em rotas administrativas protegidas', async () => {
    const res = await api.request('/api/v1/admin/pages', {
      method: 'POST',
      body: { title: 'Página Teste', slug: `${api.prefix}-anon-page` },
    });
    assert.equal(res.status, 401);
  });

  it('author cria conteúdo em draft com sucesso', async () => {
    const res = await api.request('/api/v1/admin/pages', {
      method: 'POST',
      cookie: author1.cookie,
      body: {
        title: 'Sobre o CEIC',
        slug: `${api.prefix}-sobre`,
        content: '# Sobre o CEIC\nConteúdo institucional.',
      },
    });
    assert.equal(res.status, 201, JSON.stringify(res.data));
    page = res.data;
    assert.equal(page.status, 'draft');
    assert.equal(page.createdBy, author1.data.user.id);
  });

  it('author consegue atualizar seu próprio draft', async () => {
    const res = await api.request(`/api/v1/admin/pages/${page.id}`, {
      method: 'PATCH',
      cookie: author1.cookie,
      body: { title: 'Sobre o CEIC - Atualizado' },
    });
    assert.equal(res.status, 200, JSON.stringify(res.data));
    assert.equal(res.data.title, 'Sobre o CEIC - Atualizado');
  });

  it('outro author recebe 403 ao tentar modificar o conteúdo criado pelo primeiro author (ownership)', async () => {
    const res = await api.request(`/api/v1/admin/pages/${page.id}`, {
      method: 'PATCH',
      cookie: author2.cookie,
      body: { title: 'Tentativa Invasiva' },
    });
    assert.equal(res.status, 403);
  });

  it('author recebe 403 ao tentar publicar o conteúdo', async () => {
    const res = await api.request(`/api/v1/admin/pages/${page.id}/publish`, {
      method: 'PATCH',
      cookie: author1.cookie,
      body: {},
    });
    assert.equal(res.status, 403);
  });

  it('editor ignora ownership e consegue editar conteúdo de qualquer autor', async () => {
    const res = await api.request(`/api/v1/admin/pages/${page.id}`, {
      method: 'PATCH',
      cookie: editor.cookie,
      body: { title: 'Revisão Editorial pelo Editor' },
    });
    assert.equal(res.status, 200, JSON.stringify(res.data));
    assert.equal(res.data.title, 'Revisão Editorial pelo Editor');
  });

  it('editor consegue publicar o conteúdo', async () => {
    const res = await api.request(`/api/v1/admin/pages/${page.id}/publish`, {
      method: 'PATCH',
      cookie: editor.cookie,
      body: {},
    });
    assert.equal(res.status, 200, JSON.stringify(res.data));
    assert.equal(res.data.status, 'published');
    assert.ok(res.data.publishedAt);
  });

  it('conteúdo publicado fica visível publicamente para usuários anônimos', async () => {
    const res = await api.request(`/api/v1/pages/${page.slug}`);
    assert.equal(res.status, 200);
    assert.equal(res.data.status, 'published');
    assert.equal(res.data.title, 'Revisão Editorial pelo Editor');
  });

  it('editor não tem permissão para gerenciar usuários ou atribuição de roles', async () => {
    const res = await api.request('/api/auth/admin/set-role', {
      method: 'POST',
      cookie: editor.cookie,
      body: { userId: author1.data.user.id, role: 'admin' },
    });
    assert.equal(res.status, 403);
  });

  it('editor não tem permissão para alterar site settings', async () => {
    const res = await api.request('/api/v1/admin/site-settings', {
      method: 'PATCH',
      cookie: editor.cookie,
      body: { siteName: 'Novo Nome do Site' },
    });
    assert.equal(res.status, 403);
  });

  it('admin consegue gerenciar configurações do site e usuários com controle total', async () => {
    const resSettings = await api.request('/api/v1/admin/site-settings', {
      method: 'PATCH',
      cookie: admin.cookie,
      body: { siteName: 'CEIC - Centro Integrado', contactEmail: 'contato@ceic.invalid' },
    });
    assert.equal(resSettings.status, 200, JSON.stringify(resSettings.data));
    assert.equal(resSettings.data.siteName, 'CEIC - Centro Integrado');

    const resUser = await api.request('/api/auth/admin/list-users', {
      method: 'GET',
      cookie: admin.cookie,
    });
    assert.equal(resUser.status, 200);
  });
});
