import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { seedCohorts } from './cohorts.seed.js';
import { seedCourses } from './courses.seed.js';
import { seedDisciplines } from './disciplines.seed.js';
import { seedMentorships } from './mentorships.seed.js';
import { seedNews } from './news.seed.js';
import { seedPages } from './pages.seed.js';
import { seedPartners } from './partners.seed.js';
import { seedPeople } from './people.seed.js';
import { seedSiteSettings } from './site-settings.seed.js';
import { seedUsers } from './users.seed.js';

if (!process.env.DATABASE_URL && existsSync('.env')) {
  loadEnvFile('.env');
}

export async function seedDatabase(connectionUrl: string): Promise<void> {
  const pool = new pg.Pool({ connectionString: connectionUrl, connectionTimeoutMillis: 5000 });
  const db = drizzle(pool);

  try {
    const userMap = await seedUsers(db);
    const adminUserId = userMap.get('admin@ceic.local');

    const courseMap = await seedCourses(db, adminUserId);
    const disciplineMap = await seedDisciplines(db, adminUserId);
    const peopleMap = await seedPeople(db, adminUserId);

    await seedCohorts(db, courseMap, disciplineMap, peopleMap, adminUserId);
    await seedPages(db, adminUserId);
    await seedNews(db, peopleMap, adminUserId);
    await seedPartners(db, adminUserId);
    await seedMentorships(db, peopleMap, adminUserId);
    await seedSiteSettings(db, adminUserId);

    console.log(`[Seed] Concluido com sucesso para: ${connectionUrl.replace(/:[^:@]+@/, ':***@')}`);
  } finally {
    await pool.end();
  }
}

export async function runSeeds(): Promise<void> {
  const primaryUrl = process.env.DATABASE_URL || 'postgresql://ceic:ceic@localhost:5433/ceic';
  await seedDatabase(primaryUrl);
}

if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  runSeeds()
    .then(() => {
      console.log('[Seed] Processamento de seeds finalizado.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('[Seed] Erro na execucao do seed:', error);
      process.exit(1);
    });
}
