import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { after, before, describe, it } from 'node:test';
import { startApi } from './helpers.mjs';

describe('Cohorts, Disciplines, People e Cronogramas', () => {
  let api;
  let admin;
  let course;
  let discipline;
  let person;
  let cohort;
  let cohortDisciplineId;

  before(async () => {
    api = await startApi();
    admin = await api.createAdmin();

    const courseRes = await api.request('/api/v1/admin/courses', {
      method: 'POST',
      cookie: admin.cookie,
      body: {
        title: 'Curso de Cibersegurança',
        slug: `${api.prefix}-cyber-course`,
        description: 'Descrição completa',
      },
    });
    assert.equal(courseRes.status, 201);
    course = courseRes.data;

    await api.request(`/api/v1/admin/courses/${course.id}/publish`, {
      method: 'PATCH',
      cookie: admin.cookie,
      body: {},
    });
  });

  after(async () => {
    if (api) await api.close();
  });

  it('cria e gerencia disciplinas no catálogo', async () => {
    const res = await api.request('/api/v1/admin/disciplines', {
      method: 'POST',
      cookie: admin.cookie,
      body: {
        title: 'Análise de Vulnerabilidades',
        slug: `${api.prefix}-vuln-analysis`,
        syllabus: 'Identificação e mitigação de vulnerabilidades.',
        bibliography: ['Livro 1', 'Artigo 2'],
        defaultCredits: 4,
        defaultWorkloadHours: 60,
      },
    });
    assert.equal(res.status, 201, JSON.stringify(res.data));
    discipline = res.data;
    assert.equal(discipline.title, 'Análise de Vulnerabilidades');
    assert.deepEqual(discipline.bibliography, ['Livro 1', 'Artigo 2']);

    const updateRes = await api.request(`/api/v1/admin/disciplines/${discipline.id}`, {
      method: 'PATCH',
      cookie: admin.cookie,
      body: { defaultWorkloadHours: 64 },
    });
    assert.equal(updateRes.status, 200);
    assert.equal(updateRes.data.defaultWorkloadHours, 64);
  });

  it('cria e gerencia docentes e membros no módulo people', async () => {
    const res = await api.request('/api/v1/admin/people', {
      method: 'POST',
      cookie: admin.cookie,
      body: {
        name: 'Dr. Roberto Silva',
        slug: `${api.prefix}-roberto-silva`,
        title: 'Especialista em Redes',
        organization: 'CEIC',
        bio: 'Doutor em Segurança da Informação.',
        email: 'roberto.silva@ceic.invalid',
      },
    });
    assert.equal(res.status, 201, JSON.stringify(res.data));
    person = res.data;
    assert.equal(person.name, 'Dr. Roberto Silva');

    const updateRes = await api.request(`/api/v1/admin/people/${person.id}`, {
      method: 'PATCH',
      cookie: admin.cookie,
      body: { linkedinUrl: 'https://linkedin.com/in/robertosilva' },
    });
    assert.equal(updateRes.status, 200);
    assert.equal(updateRes.data.linkedinUrl, 'https://linkedin.com/in/robertosilva');
  });

  it('cria uma turma (cohort) associada ao curso', async () => {
    const res = await api.request('/api/v1/admin/cohorts', {
      method: 'POST',
      cookie: admin.cookie,
      body: {
        courseId: course.id,
        name: 'Turma 2026.1',
        startDate: '2026-03-01T00:00:00.000Z',
        endDate: '2026-12-15T00:00:00.000Z',
        enrollmentStatus: 'open',
        price: 4500,
        availableSeats: 30,
      },
    });
    assert.equal(res.status, 201, JSON.stringify(res.data));
    cohort = res.data;
    assert.equal(cohort.name, 'Turma 2026.1');
    assert.equal(cohort.courseId, course.id);
    assert.equal(cohort.status, 'draft');
  });

  it('associa disciplina à turma com carga horária e posição', async () => {
    const res = await api.request(`/api/v1/admin/cohorts/${cohort.id}/disciplines`, {
      method: 'POST',
      cookie: admin.cookie,
      body: {
        disciplineId: discipline.id,
        position: 1,
        credits: 4,
        workloadHours: 64,
        notes: 'Aulas ministradas aos sábados',
      },
    });
    assert.equal(res.status, 201, JSON.stringify(res.data));
    cohortDisciplineId = res.data.id;
    assert.equal(res.data.disciplineId, discipline.id);
    assert.equal(res.data.cohortId, cohort.id);
  });

  it('associa docente à disciplina da turma (cohort_discipline_people)', async () => {
    const res = await api.request(`/api/v1/admin/cohorts/disciplines/${cohortDisciplineId}/people`, {
      method: 'POST',
      cookie: admin.cookie,
      body: {
        personId: person.id,
        role: 'professor',
      },
    });
    assert.equal(res.status, 201, JSON.stringify(res.data));
    assert.equal(res.data.personId, person.id);
    assert.equal(res.data.role, 'professor');
  });

  it('adiciona entrada de cronograma na disciplina da turma (schedule_entries)', async () => {
    const res = await api.request(`/api/v1/admin/cohorts/disciplines/${cohortDisciplineId}/schedules`, {
      method: 'POST',
      cookie: admin.cookie,
      body: {
        date: '2026-03-07T00:00:00.000Z',
        startTime: '08:00',
        endTime: '12:00',
        modality: 'hybrid',
        description: 'Aula inaugural sobre arquitetura de redes seguras.',
        position: 1,
      },
    });
    assert.equal(res.status, 201, JSON.stringify(res.data));
    assert.equal(res.data.modality, 'hybrid');
    assert.equal(res.data.cohortDisciplineId, cohortDisciplineId);
  });

  it('turma em draft não aparece nos endpoints públicos', async () => {
    const listRes = await api.request(`/api/v1/cohorts/course/${course.id}`);
    assert.equal(listRes.status, 200);
    assert.ok(!listRes.data.some((c) => c.id === cohort.id));

    const singleRes = await api.request(`/api/v1/cohorts/${cohort.id}`);
    assert.equal(singleRes.status, 404);
  });

  it('publica a turma e valida leitura pública aninhada com disciplinas e docentes', async () => {
    const publishRes = await api.request(`/api/v1/admin/cohorts/${cohort.id}/publish`, {
      method: 'PATCH',
      cookie: admin.cookie,
      body: {},
    });
    assert.equal(publishRes.status, 200);
    assert.equal(publishRes.data.status, 'published');

    const publicRes = await api.request(`/api/v1/cohorts/${cohort.id}`);
    assert.equal(publicRes.status, 200);
    assert.equal(publicRes.data.id, cohort.id);
    assert.ok(Array.isArray(publicRes.data.disciplines));
    assert.equal(publicRes.data.disciplines.length, 1);

    const firstDisc = publicRes.data.disciplines[0];
    assert.equal(firstDisc.disciplineId, discipline.id);
    assert.equal(firstDisc.title, 'Análise de Vulnerabilidades');
    assert.ok(Array.isArray(firstDisc.people));
    assert.equal(firstDisc.people.length, 1);
    assert.equal(firstDisc.people[0].name, 'Dr. Roberto Silva');
    assert.equal(firstDisc.people[0].role, 'professor');
    assert.ok(Array.isArray(firstDisc.schedules));
    assert.equal(firstDisc.schedules.length, 1);
    assert.equal(firstDisc.schedules[0].modality, 'hybrid');
  });

  it('exclusão lógica (soft delete) da turma oculta da consulta pública e permite restauração', async () => {
    const delRes = await api.request(`/api/v1/admin/cohorts/${cohort.id}`, {
      method: 'DELETE',
      cookie: admin.cookie,
    });
    assert.equal(delRes.status, 204);

    const notFoundRes = await api.request(`/api/v1/cohorts/${cohort.id}`);
    assert.equal(notFoundRes.status, 404);

    const restoreRes = await api.request(`/api/v1/admin/cohorts/${cohort.id}/restore`, {
      method: 'PATCH',
      cookie: admin.cookie,
      body: {},
    });
    assert.equal(restoreRes.status, 200);
    assert.equal(restoreRes.data.status, 'draft');
  });
});
