import { Injectable, type OnApplicationShutdown, type OnModuleInit } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { config } from '../config/config.js';
import * as schema from './schema/index.js';

@Injectable()
export class DatabaseService implements OnModuleInit, OnApplicationShutdown {
  private readonly pool = new pg.Pool({
    connectionString: config.database.url,
    connectionTimeoutMillis: 5000,
  });

  readonly db = drizzle(this.pool, { schema });

  async onModuleInit() {
    await this.pool.query('SELECT 1');
  }

  async onApplicationShutdown() {
    await this.pool.end();
  }
}
