import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { after, before, describe, it } from 'node:test';
import { startApi } from './helpers.mjs';

describe('Auditoria Completa de Alterações Editoriais', () => {
  let api;
  let admin;
  let course;

  before(async () => {
    api = await startApi();
    admin = await api.createAdmin();
  });

  after(async () => {
    if (api) await api.close();
  });

  it('registra audit logs para o ciclo completo: create, update, publish, archive, delete e restore', async () => {
    // 1. Create
    const createRes = await api.request('/api/v1/admin/courses', {
      method: 'POST',
      cookie: admin.cookie,
      body: {
        title: 'Curso de Auditoria',
        slug: `${api.prefix}-audit-course`,
        description: 'Curso para validação de audit logs',
      },
    });
    assert.equal(createRes.status, 201);
    course = createRes.data;

    // 2. Update
    const updateRes = await api.request(`/api/v1/admin/courses/${course.id}`, {
      method: 'PATCH',
      cookie: admin.cookie,
      body: { title: 'Curso de Auditoria Atualizado' },
    });
    assert.equal(updateRes.status, 200);

    // 3. Publish
    const publishRes = await api.request(`/api/v1/admin/courses/${course.id}/publish`, {
      method: 'PATCH',
      cookie: admin.cookie,
      body: {},
    });
    assert.equal(publishRes.status, 200);

    // 4. Archive
    const archiveRes = await api.request(`/api/v1/admin/courses/${course.id}/archive`, {
      method: 'PATCH',
      cookie: admin.cookie,
      body: {},
    });
    assert.equal(archiveRes.status, 200);

    // 5. Delete (soft delete)
    const deleteRes = await api.request(`/api/v1/admin/courses/${course.id}`, {
      method: 'DELETE',
      cookie: admin.cookie,
    });
    assert.equal(deleteRes.status, 204);

    // 6. Restore
    const restoreRes = await api.request(`/api/v1/admin/courses/${course.id}/restore`, {
      method: 'PATCH',
      cookie: admin.cookie,
      body: {},
    });
    assert.equal(restoreRes.status, 200);

    // Consulta de audit logs do curso
    const logsRes = await api.request(`/api/v1/admin/audit-logs?entityType=course&entityId=${course.id}`, {
      cookie: admin.cookie,
    });
    assert.equal(logsRes.status, 200);
    assert.ok(Array.isArray(logsRes.data.data));

    const actions = logsRes.data.data.map((l) => l.action);
    assert.ok(actions.includes('create'), 'Log de create ausente');
    assert.ok(actions.includes('update'), 'Log de update ausente');
    assert.ok(actions.includes('publish'), 'Log de publish ausente');
    assert.ok(actions.includes('archive'), 'Log de archive ausente');
    assert.ok(actions.includes('delete'), 'Log de delete ausente');
    assert.ok(actions.includes('restore'), 'Log de restore ausente');

    // Valida que o actorUserId está associado ao administrador executor
    const createLog = logsRes.data.data.find((l) => l.action === 'create');
    assert.equal(createLog.actorUserId, admin.data.user.id);
  });

  it('assegura que campos sensíveis nunca são gravados no log de auditoria', async () => {
    const { AuditLogsService } = await import('../src/modules/audit-logs/audit-logs.service.js');
    const { DatabaseService } = await import('../src/database/database.service.js');
    const { auditLogs } = await import('../src/database/schema/audit-logs.schema.js');
    const { eq } = await import('drizzle-orm');

    const testEntityId = randomUUID();
    const service = new AuditLogsService(api.database);

    await service.log({
      actorUserId: admin.data.user.id,
      action: 'create',
      entityType: 'sensitive_test',
      entityId: testEntityId,
      before: null,
      after: {
        safeField: 'valor normal',
        password: 'super-secret-password-123',
        token: 'jwt-access-token-abc',
        secret: 'api-secret-key-xyz',
        session_token: 'session-cookie-val',
      },
    });

    const [saved] = await api.database.db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.entityId, testEntityId))
      .limit(1);

    assert.ok(saved);
    assert.equal(saved.after.safeField, 'valor normal');
    assert.equal(saved.after.password, undefined);
    assert.equal(saved.after.token, undefined);
    assert.equal(saved.after.secret, undefined);
    assert.equal(saved.after.session_token, undefined);
  });
});
