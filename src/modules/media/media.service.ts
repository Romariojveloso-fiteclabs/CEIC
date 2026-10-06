import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { and, desc, isNull, sql } from 'drizzle-orm';
import { config } from '../../config/config.js';
import { DatabaseService } from '../../database/database.service.js';
import { media } from '../../database/schema/media.schema.js';
import { AuditLogsService } from '../audit-logs/audit-logs.service.js';
import { MediaStorageService } from './media-storage.service.js';
import type { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';
import { eq } from 'drizzle-orm';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
]);

@Injectable()
export class MediaService {
  constructor(
    private readonly database: DatabaseService,
    private readonly storage: MediaStorageService,
    private readonly auditLogs: AuditLogsService,
  ) {}

  async upload(file: Express.Multer.File, alt?: string, userId?: string) {
    if (!file || !file.buffer) {
      throw new BadRequestException('Arquivo não enviado.');
    }
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      throw new BadRequestException('Tipo de arquivo não permitido.');
    }
    if (file.size > config.media.maxFileSize) {
      throw new BadRequestException('Arquivo excede o limite máximo permitido.');
    }

    const { storageKey, filename } = await this.storage.save(file.buffer, file.originalname);

    const [record] = await this.database.db.insert(media).values({
      filename,
      originalFilename: file.originalname,
      storageKey,
      mimeType: file.mimetype,
      size: file.size,
      alt: alt ?? null,
      createdBy: userId ?? null,
    }).returning();

    if (!record) {
      throw new BadRequestException('Falha ao registrar arquivo de mídia.');
    }

    await this.auditLogs.log({
      actorUserId: userId,
      action: 'create',
      entityType: 'media',
      entityId: record.id,
      after: record,
    });

    return record;
  }

  async findAll(query: PaginationQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const offset = (page - 1) * limit;

    const where = isNull(media.deletedAt);

    const [totalRow] = await this.database.db
      .select({ count: sql<number>`count(*)::int` })
      .from(media)
      .where(where);

    const total = totalRow?.count ?? 0;
    const data = await this.database.db
      .select()
      .from(media)
      .where(where)
      .orderBy(desc(media.createdAt))
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

  async findOne(id: string) {
    const [record] = await this.database.db
      .select()
      .from(media)
      .where(and(eq(media.id, id), isNull(media.deletedAt)))
      .limit(1);

    if (!record) {
      throw new NotFoundException('Arquivo de mídia não encontrado.');
    }

    const filePath = this.storage.resolvePath(record.storageKey);
    return { record, filePath };
  }

  async remove(id: string, userId?: string) {
    const [existing] = await this.database.db
      .select()
      .from(media)
      .where(and(eq(media.id, id), isNull(media.deletedAt)))
      .limit(1);

    if (!existing) {
      throw new NotFoundException('Arquivo de mídia não encontrado.');
    }

    const [updated] = await this.database.db
      .update(media)
      .set({ deletedAt: new Date() })
      .where(eq(media.id, id))
      .returning();

    await this.auditLogs.log({
      actorUserId: userId,
      action: 'delete',
      entityType: 'media',
      entityId: id,
      before: existing,
      after: updated,
    });
  }
}
