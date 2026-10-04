import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';
import { config } from '../dist/config/config.js';

const pool = new pg.Pool({ connectionString: config.database.url });
try {
  await migrate(drizzle(pool), { migrationsFolder: new URL('../drizzle', import.meta.url).pathname });
} finally {
  await pool.end();
}
