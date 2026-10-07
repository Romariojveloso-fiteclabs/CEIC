import { Injectable } from '@nestjs/common';
import { and, desc, eq, sql } from 'drizzle-orm';
import { DatabaseService } from '../../database/database.service.js';
import { auditLogs } from '../../database/schema/audit-logs.schema.js';
import type { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';

const SENSITIVE_KEYS = new Set([
  'password', 'token', 'secret', 'cookie', 'session_token', 'access_token',
  'refresh_token', 'id_token', 'credentials', 'authorization',
]);

function sanitize(value: unknown): unknown {
  if (value === null || value === undefined || typeof value !== 'object') {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(sanitize);
  }
  const result: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      continue;
    }
    result[key] = sanitize(val);
  }
  return result;
}

export interface CreateAuditLogParams {
  actorUserId?: string | null;
  action: 'create' | 'update' | 'delete' | 'restore' | 'publish' | 'archive';
  entityType: string;
  entityId: string;
  before?: unknown;
  after?: unknown;
}

@Injectable()
export class AuditLogsService {
  constructor(private readonly database: DatabaseService) {}

  async log(params: CreateAuditLogParams) {
    try {
      await this.database.db.insert(auditLogs).values({
        actorUserId: params.actorUserId ?? null,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        before: params.before ? sanitize(params.before) : null,
        after: params.after ? sanitize(params.after) : null,
      });
    } catch {
      // Falha de auditoria nao bloqueia fluxo principal
    }
  }

  async findAll(query: PaginationQueryDto & { entityType?: string; entityId?: string }) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const offset = (page - 1) * limit;

    const conditions = [];
    if (query.entityType) conditions.push(eq(auditLogs.entityType, query.entityType));
    if (query.entityId) conditions.push(eq(auditLogs.entityId, query.entityId));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [totalRow] = await this.database.db
      .select({ count: sql<number>`count(*)::int` })
      .from(auditLogs)
      .where(where);

    const total = totalRow?.count ?? 0;
    const data = await this.database.db
      .select()
      .from(auditLogs)
      .where(where)
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }
}
