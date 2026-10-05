import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import { hashPassword } from 'better-auth/crypto';
import { and, eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { account, user } from '../schema/auth.schema.js';
import { courses } from '../schema/courses.schema.js';
import { seedCourses, seedUsers } from './seed-data.js';

if (!process.env.DATABASE_URL && existsSync('.env')) {
  loadEnvFile('.env');
}

export async function seedDatabase(connectionUrl: string): Promise<void> {
  const pool = new pg.Pool({ connectionString: connectionUrl, connectionTimeoutMillis: 5000 });
  const db = drizzle(pool);

  try {
    for (const item of seedUsers) {
      const [insertedUser] = await db
        .insert(user)
        .values({
          name: item.name,
          email: item.email,
          emailVerified: item.emailVerified,
          role: item.role,
          banned: item.banned ?? false,
          banReason: item.banReason ?? null,
        })
        .onConflictDoUpdate({
          target: user.email,
          set: {
            name: item.name,
            role: item.role,
            emailVerified: item.emailVerified,
            banned: item.banned ?? false,
            banReason: item.banReason ?? null,
            updatedAt: new Date(),
          },
        })
        .returning({ id: user.id });

      if (!insertedUser) continue;

      const hashedPassword = await hashPassword(item.password);
      const [existingAccount] = await db
        .select({ id: account.id })
        .from(account)
        .where(and(eq(account.userId, insertedUser.id), eq(account.providerId, 'credential')))
        .limit(1);

      if (existingAccount) {
        await db
          .update(account)
          .set({ password: hashedPassword, updatedAt: new Date() })
          .where(eq(account.id, existingAccount.id));
      } else {
        await db.insert(account).values({
          accountId: insertedUser.id,
          providerId: 'credential',
          userId: insertedUser.id,
          password: hashedPassword,
        });
      }
    }

    for (const item of seedCourses) {
      await db
        .insert(courses)
        .values({
          title: item.title,
          slug: item.slug,
          description: item.description,
          published: item.published,
        })
        .onConflictDoUpdate({
          target: courses.slug,
          set: {
            title: item.title,
            description: item.description,
            published: item.published,
            updatedAt: new Date(),
          },
        });
    }

    console.log(`[Seed] Concluido com sucesso para: ${connectionUrl.replace(/:[^:@]+@/, ':***@')}`);
  } finally {
    await pool.end();
  }
}

export async function runSeeds(): Promise<void> {
  const primaryUrl = process.env.DATABASE_URL || 'postgresql://admin:admin@localhost:5433/ceic';
  const urlsToSeed = new Set<string>([primaryUrl]);

  if (process.env.POSTGRES_PORT) {
    const standardUrl = `postgresql://${process.env.POSTGRES_USER || 'ceic'}:${process.env.POSTGRES_PASSWORD || 'ceic'}@localhost:${process.env.POSTGRES_PORT}/ceic`;
    urlsToSeed.add(standardUrl);
  }

  for (const url of urlsToSeed) {
    try {
      await seedDatabase(url);
    } catch (error) {
      console.warn(`[Seed] Instancia indisponivel para conexao: ${url.replace(/:[^:@]+@/, ':***@')}`);
    }
  }
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
