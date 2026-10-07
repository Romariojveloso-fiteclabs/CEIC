import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { config } from '../../config/config.js';

@Injectable()
export class MediaStorageService {
  private readonly storageDir = path.resolve(config.media.storagePath);

  constructor() {
    if (!existsSync(this.storageDir)) {
      mkdirSync(this.storageDir, { recursive: true });
    }
  }

  async save(buffer: Buffer, originalname: string): Promise<{ storageKey: string; filename: string }> {
    const rawExt = path.extname(originalname).toLowerCase();
    const safeExt = /^\.[a-z0-9]+$/i.test(rawExt) ? rawExt : '';
    const storageKey = `${randomUUID()}${safeExt}`;
    const destination = this.resolvePath(storageKey);
    writeFileSync(destination, buffer);
    return { storageKey, filename: storageKey };
  }

  async delete(storageKey: string): Promise<void> {
    const filePath = this.resolvePath(storageKey);
    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }
  }

  resolvePath(storageKey: string): string {
    const safeName = path.basename(storageKey);
    const resolved = path.resolve(this.storageDir, safeName);
    if (!resolved.startsWith(this.storageDir)) {
      throw new BadRequestException('Tentativa de path traversal detectada.');
    }
    return resolved;
  }
}
