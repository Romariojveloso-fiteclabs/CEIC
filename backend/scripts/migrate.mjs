import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';

try {
  process.loadEnvFile?.('.env');
} catch {}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL não configurada.');
}

const pool = new pg.Pool({ connectionString });
try {
  await migrate(drizzle(pool), { migrationsFolder: new URL('../drizzle', import.meta.url).pathname });
  console.log('[Migrate] Migrações aplicadas com sucesso.');
} finally {
  await pool.end();
}

