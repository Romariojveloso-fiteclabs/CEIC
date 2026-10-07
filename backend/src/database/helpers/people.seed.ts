import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { people } from '../schema/people.schema.js';

export const seedPeopleList = [
  {
    name: 'Prof. Dr. Eduardo Ramos',
    slug: 'eduardo-ramos',
    title: 'Coordenador Academico e Pesquisador Chefe',
    organization: 'CEIC - Fitec Labs',
    bio: 'Doutor em Ciencia da Computacao com enfase em seguranca cibernetica ofensiva e arquitetura resiliente.',
    email: 'eduardo.ramos@ceic.local',
    linkedinUrl: 'https://linkedin.com/in/eduardo-ramos-ceic',
    status: 'published' as const,
  },
  {
    name: 'Profa. Dra. Marina Albuquerque',
    slug: 'marina-albuquerque',
    title: 'Especialista em Pericia Forense Digital',
    organization: 'Instituto de Criminalistica & CEIC',
    bio: 'Perita criminal e instrutora com vasta experiencia em investigacao pericial e resposta a incidentes complexos.',
    email: 'marina.albuquerque@ceic.local',
    linkedinUrl: 'https://linkedin.com/in/marina-albuquerque-ceic',
    status: 'published' as const,
  },
  {
    name: 'Eng. Lucas Menezes',
    slug: 'lucas-menezes',
    title: 'Instrutor Principal de Seguranca Ofensiva',
    organization: 'Red Team Labs',
    bio: 'Pesquisador de ameacas e lider de equipes de emulacao de adversarios em ambientes corporativos.',
    email: 'lucas.menezes@ceic.local',
    linkedinUrl: 'https://linkedin.com/in/lucas-menezes-ceic',
    status: 'published' as const,
  },
];

export async function seedPeople(
  db: NodePgDatabase<Record<string, unknown>>,
  adminUserId?: string,
): Promise<Map<string, string>> {
  const peopleMap = new Map<string, string>();

  for (const item of seedPeopleList) {
    const [inserted] = await db
      .insert(people)
      .values({
        name: item.name,
        slug: item.slug,
        title: item.title,
        organization: item.organization,
        bio: item.bio,
        email: item.email,
        linkedinUrl: item.linkedinUrl,
        status: item.status,
        createdBy: adminUserId ?? null,
        updatedBy: adminUserId ?? null,
      })
      .onConflictDoUpdate({
        target: people.slug,
        set: {
          name: item.name,
          title: item.title,
          organization: item.organization,
          bio: item.bio,
          email: item.email,
          linkedinUrl: item.linkedinUrl,
          status: item.status,
          updatedAt: new Date(),
        },
      })
      .returning({ id: people.id, slug: people.slug });

    if (inserted) {
      peopleMap.set(inserted.slug, inserted.id);
    }
  }

  return peopleMap;
}
