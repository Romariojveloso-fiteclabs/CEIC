import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { startApi } from './helpers.mjs';

describe('Domínios Editoriais: Pages, News, Partners, Mentorships e Site Settings', () => {
  let api;
  let admin;
  let person;

  before(async () => {
    api = await startApi();
    admin = await api.createAdmin();

    const personRes = await api.request('/api/v1/admin/people', {
      method: 'POST',
      cookie: admin.cookie,
      body: {
        name: 'Dra. Ana Paula',
        slug: `${api.prefix}-ana-paula`,
        title: 'Pesquisadora Chefe',
        organization: 'CEIC',
      },
    });
    assert.equal(personRes.status, 201);
    person = personRes.data;
  });

  after(async () => {
    if (api) await api.close();
  });

  it('gerencia páginas institucionais com markdown (pages)', async () => {
    const pageRes = await api.request('/api/v1/admin/pages', {
      method: 'POST',
      cookie: admin.cookie,
      body: {
        title: 'FAQ Geral',
        slug: `${api.prefix}-faq`,
        summary: 'Perguntas frequentes sobre o CEIC.',
        content: '# FAQ\n\n## Como se inscrever?\nAcesse a página do curso.',
      },
    });
    assert.equal(pageRes.status, 201, JSON.stringify(pageRes.data));
    const page = pageRes.data;

    await api.request(`/api/v1/admin/pages/${page.id}/publish`, {
      method: 'PATCH',
      cookie: admin.cookie,
      body: {},
    });

    const publicRes = await api.request(`/api/v1/pages/${page.slug}`);
    assert.equal(publicRes.status, 200);
    assert.equal(publicRes.data.title, 'FAQ Geral');
    assert.match(publicRes.data.content, /# FAQ/);
  });

  it('gerencia notícias com autores vinculados e markdown (news)', async () => {
    const newsRes = await api.request('/api/v1/admin/news', {
      method: 'POST',
      cookie: admin.cookie,
      body: {
        title: 'Novo Laboratório Inaugurado no CEIC',
        slug: `${api.prefix}-novo-lab`,
        summary: 'CEIC inaugura moderno laboratório de testes cibernéticos.',
        content: 'O laboratório conta com equipamentos de última geração.',
      },
    });
    assert.equal(newsRes.status, 201, JSON.stringify(newsRes.data));
    const news = newsRes.data;

    const authorLink = await api.request(`/api/v1/admin/news/${news.id}/people`, {
      method: 'POST',
      cookie: admin.cookie,
      body: { personId: person.id },
    });
    assert.equal(authorLink.status, 201);

    await api.request(`/api/v1/admin/news/${news.id}/publish`, {
      method: 'PATCH',
      cookie: admin.cookie,
      body: {},
    });

    const publicRes = await api.request(`/api/v1/news/${news.slug}`);
    assert.equal(publicRes.status, 200);
    assert.equal(publicRes.data.title, 'Novo Laboratório Inaugurado no CEIC');
    assert.ok(Array.isArray(publicRes.data.people));
    assert.equal(publicRes.data.people[0].name, 'Dra. Ana Paula');
  });

  it('gerencia parceiros e listagem ordenada por position (partners)', async () => {
    const p1 = await api.request('/api/v1/admin/partners', {
      method: 'POST',
      cookie: admin.cookie,
      body: {
        name: 'Parceiro Secundário',
        slug: `${api.prefix}-parceiro-b`,
        description: 'Parceiro Tecnológico',
        position: 2,
      },
    });
    assert.equal(p1.status, 201);

    const p2 = await api.request('/api/v1/admin/partners', {
      method: 'POST',
      cookie: admin.cookie,
      body: {
        name: 'Parceiro Principal',
        slug: `${api.prefix}-parceiro-a`,
        description: 'Parceiro Estratégico',
        position: 1,
      },
    });
    assert.equal(p2.status, 201);

    await api.request(`/api/v1/admin/partners/${p1.data.id}/publish`, {
      method: 'PATCH',
      cookie: admin.cookie,
      body: {},
    });
    await api.request(`/api/v1/admin/partners/${p2.data.id}/publish`, {
      method: 'PATCH',
      cookie: admin.cookie,
      body: {},
    });

    const listRes = await api.request('/api/v1/partners');
    assert.equal(listRes.status, 200);
    assert.ok(Array.isArray(listRes.data));

    const posA = listRes.data.findIndex((p) => p.slug === `${api.prefix}-parceiro-a`);
    const posB = listRes.data.findIndex((p) => p.slug === `${api.prefix}-parceiro-b`);
    assert.ok(posA !== -1 && posB !== -1);
    assert.ok(posA < posB);
  });

  it('gerencia mentorias com cronogramas estruturados (mentorships)', async () => {
    const mentRes = await api.request('/api/v1/admin/mentorships', {
      method: 'POST',
      cookie: admin.cookie,
      body: {
        title: 'Programa de Mentoria em Forense',
        slug: `${api.prefix}-mentoria-forense`,
        shortDescription: 'Mentoria personalizada.',
        description: 'Descrição completa do programa.',
        durationMonths: 6,
        workloadHours: 120,
      },
    });
    assert.equal(mentRes.status, 201, JSON.stringify(mentRes.data));
    const mentorship = mentRes.data;

    const schedRes = await api.request(`/api/v1/admin/mentorships/${mentorship.id}/schedules`, {
      method: 'POST',
      cookie: admin.cookie,
      body: {
        title: 'Sessão 1: Coleta de Evidências',
        description: 'Técnicas de preservação de evidências digitais.',
        startTime: '19:00',
        endTime: '21:00',
        position: 1,
      },
    });
    assert.equal(schedRes.status, 201);

    await api.request(`/api/v1/admin/mentorships/${mentorship.id}/publish`, {
      method: 'PATCH',
      cookie: admin.cookie,
      body: {},
    });

    const publicRes = await api.request(`/api/v1/mentorships/${mentorship.slug}`);
    assert.equal(publicRes.status, 200);
    assert.equal(publicRes.data.title, 'Programa de Mentoria em Forense');
    assert.ok(Array.isArray(publicRes.data.schedules));
    assert.equal(publicRes.data.schedules.length, 1);
    assert.equal(publicRes.data.schedules[0].title, 'Sessão 1: Coleta de Evidências');
  });

  it('gerencia configurações globais do site (site_settings)', async () => {
    const initial = await api.request('/api/v1/site-settings');
    assert.equal(initial.status, 200);

    const updateRes = await api.request('/api/v1/admin/site-settings', {
      method: 'PATCH',
      cookie: admin.cookie,
      body: {
        siteName: 'CEIC - Centro Especializado em Inovação e Cibersegurança',
        heroTitle: 'Formando Especialistas em Segurança',
        socialLinks: { linkedin: 'https://linkedin.com/company/ceic', youtube: 'https://youtube.com/@ceic' },
      },
    });
    assert.equal(updateRes.status, 200, JSON.stringify(updateRes.data));

    const checkRes = await api.request('/api/v1/site-settings');
    assert.equal(checkRes.status, 200);
    assert.equal(checkRes.data.heroTitle, 'Formando Especialistas em Segurança');
    assert.deepEqual(checkRes.data.socialLinks, {
      linkedin: 'https://linkedin.com/company/ceic',
      youtube: 'https://youtube.com/@ceic',
    });
  });
});
