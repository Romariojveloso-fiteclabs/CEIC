import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { seedDatabase } from '../src/database/helpers/seed.js';
import { startApi } from './helpers.mjs';

describe('Validação de Seeds e Endpoints do CMS CEIC', () => {
  let api;
  let adminSession;
  let editorSession;

  before(async () => {
    api = await startApi();
    await seedDatabase(process.env.DATABASE_URL);

    adminSession = await api.signIn('admin@ceic.local', 'Admin@123456');
    assert.equal(adminSession.status, 200, 'Login do admin semeado deve ser 200');

    editorSession = await api.signIn('editor@ceic.local', 'Editor@123456');
    assert.equal(editorSession.status, 200, 'Login do editor semeado deve ser 200');
  });

  after(async () => {
    if (api) await api.close();
  });

  it('valida consulta pública de cursos semeados e slug específico', async () => {
    const listRes = await api.request('/api/v1/courses');
    assert.equal(listRes.status, 200);
    assert.ok(Array.isArray(listRes.data));
    assert.ok(listRes.data.length >= 3);

    const slugs = listRes.data.map((c) => c.slug);
    assert.ok(slugs.includes('defesa-cibernetica'));
    assert.ok(slugs.includes('seguranca-ofensiva'));
    assert.ok(!slugs.includes('seguranca-em-nuvem-devsecops'), 'Curso em draft não pode constar na lista pública');

    const singleRes = await api.request('/api/v1/courses/defesa-cibernetica');
    assert.equal(singleRes.status, 200);
    assert.equal(singleRes.data.title, 'Especializacao em Defesa Cibernetica');
    assert.equal(singleRes.data.status, 'published');
  });

  it('valida consulta de turmas semeadas com disciplinas, docentes e cronogramas', async () => {
    const courseRes = await api.request('/api/v1/courses/defesa-cibernetica');
    assert.equal(courseRes.status, 200);

    const cohortsRes = await api.request(`/api/v1/cohorts/course/${courseRes.data.id}`);
    assert.equal(cohortsRes.status, 200);
    assert.ok(Array.isArray(cohortsRes.data));
    assert.ok(cohortsRes.data.some((c) => c.name === 'Turma Alfa - 2026.1'));

    const cohort = cohortsRes.data.find((c) => c.name === 'Turma Alfa - 2026.1');
    const singleCohortRes = await api.request(`/api/v1/cohorts/${cohort.id}`);
    assert.equal(singleCohortRes.status, 200);
    assert.ok(Array.isArray(singleCohortRes.data.disciplines));
    assert.ok(singleCohortRes.data.disciplines.length > 0);

    const firstDisc = singleCohortRes.data.disciplines[0];
    assert.equal(firstDisc.slug, 'arquitetura-defesa-monitoramento');
    assert.ok(Array.isArray(firstDisc.people));
    assert.ok(firstDisc.people.some((p) => p.slug === 'eduardo-ramos'));
    assert.ok(Array.isArray(firstDisc.schedules));
    assert.ok(firstDisc.schedules.length > 0);
  });

  it('valida páginas institucionais em markdown', async () => {
    const pageRes = await api.request('/api/v1/pages/sobre');
    assert.equal(pageRes.status, 200);
    assert.equal(pageRes.data.title, 'Sobre o CEIC');
    assert.match(pageRes.data.content, /Centro Especializado em Inovação e Cibersegurança/);

    const faqRes = await api.request('/api/v1/pages/faq');
    assert.equal(faqRes.status, 200);
    assert.match(faqRes.data.content, /Perguntas Frequentes/);
  });

  it('valida notícias semeadas e seus respectivos autores', async () => {
    const newsRes = await api.request('/api/v1/news');
    assert.equal(newsRes.status, 200);
    assert.ok(Array.isArray(newsRes.data));
    assert.ok(newsRes.data.length >= 2);

    const singleRes = await api.request('/api/v1/news/inauguracao-novas-instalacoes-ceic');
    assert.equal(singleRes.status, 200);
    assert.equal(singleRes.data.title, 'Inauguração das Novas Instalações do CEIC');
    assert.ok(Array.isArray(singleRes.data.people));
    assert.ok(singleRes.data.people.some((p) => p.slug === 'eduardo-ramos'));
  });

  it('valida ordenação correta dos parceiros por position', async () => {
    const res = await api.request('/api/v1/partners');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.data));
    assert.ok(res.data.length >= 2);

    const fitecIdx = res.data.findIndex((p) => p.slug === 'fitec-labs');
    const rnscIdx = res.data.findIndex((p) => p.slug === 'rede-nacional-seguranca');
    assert.ok(fitecIdx !== -1 && rnscIdx !== -1);
    assert.ok(fitecIdx < rnscIdx, 'Fitec Labs (position 1) deve preceder Rede Nacional (position 2)');
  });

  it('valida programas de mentoria com cronograma de sessões', async () => {
    const res = await api.request('/api/v1/mentorships/mentoria-ciso-track');
    assert.equal(res.status, 200);
    assert.equal(res.data.title, 'Mentoria Executiva em Lideranca de Seguranca (CISO Track)');
    assert.ok(Array.isArray(res.data.schedules));
    assert.ok(res.data.schedules.length > 0);
  });

  it('valida configurações singleton do site_settings', async () => {
    const res = await api.request('/api/v1/site-settings');
    assert.equal(res.status, 200);
    assert.equal(res.data.siteName, 'CEIC - Centro Especializado em Inovação e Cibersegurança');
    assert.equal(res.data.contactEmail, 'contato@ceic.tec.br');
    assert.ok(res.data.socialLinks);
    assert.equal(res.data.socialLinks.linkedin, 'https://linkedin.com/company/ceic-ciberseguranca');
  });

  it('valida rotas administrativas com a sessão do admin semeado', async () => {
    const adminCourses = await api.request('/api/v1/admin/courses', {
      cookie: adminSession.cookie,
    });
    assert.equal(adminCourses.status, 200);
    assert.ok(adminCourses.data.data.some((c) => c.slug === 'seguranca-em-nuvem-devsecops'), 'Admin deve enxergar rascunhos');

    const adminDisc = await api.request('/api/v1/admin/disciplines', {
      cookie: adminSession.cookie,
    });
    assert.equal(adminDisc.status, 200);
    assert.ok(adminDisc.data.data.length >= 4);

    const adminPeople = await api.request('/api/v1/admin/people', {
      cookie: adminSession.cookie,
    });
    assert.equal(adminPeople.status, 200);
    assert.ok(adminPeople.data.data.length >= 3);
  });
});
