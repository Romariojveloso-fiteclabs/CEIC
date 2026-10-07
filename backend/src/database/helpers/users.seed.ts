import { hashPassword } from 'better-auth/crypto';
import { and, eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { account, user } from '../schema/auth.schema.js';

export interface SeedUser {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'editor' | 'author';
  emailVerified: boolean;
  banned?: boolean;
  banReason?: string;
}

export const seedUsersList: SeedUser[] = [
  {
    name: 'Super Admin CEIC',
    email: 'admin@ceic.local',
    password: 'Admin@123456',
    role: 'admin',
    emailVerified: true,
  },
  {
    name: 'Editor Editorial',
    email: 'editor@ceic.local',
    password: 'Editor@123456',
    role: 'editor',
    emailVerified: true,
  },
  {
    name: 'Autor Conteudos',
    email: 'author@ceic.local',
    password: 'Author@123456',
    role: 'author',
    emailVerified: true,
  },
  {
    name: 'Usuario Suspenso',
    email: 'banido@ceic.local',
    password: 'Banido@123456',
    role: 'author',
    emailVerified: true,
    banned: true,
    banReason: 'Violacao dos termos de servico da plataforma',
  },
];

export async function seedUsers(db: NodePgDatabase<Record<string, unknown>>): Promise<Map<string, string>> {
  const userMap = new Map<string, string>();

  for (const item of seedUsersList) {
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
      .returning({ id: user.id, email: user.email });

    if (!insertedUser) continue;
    userMap.set(insertedUser.email, insertedUser.id);

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

  return userMap;
}
