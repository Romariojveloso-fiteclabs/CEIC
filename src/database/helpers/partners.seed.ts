import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { partners } from '../schema/partners.schema.js';

export const seedPartnersList = [
  {
    name: 'Fitec Labs',
    slug: 'fitec-labs',
    description: 'Fundacao de inovacao e tecnologia apoiadora do centro de capacitacao.',
    websiteUrl: 'https://fiteclabs.org.br',
    testimonial: 'Parceria estrategica para desenvolvimento de talentos e pesquisa aplicada em ciberseguranca.',
    position: 1,
    status: 'published' as const,
  },
  {
    name: 'Rede Nacional de Seguranca Cibernetica',
    slug: 'rede-nacional-seguranca',
    description: 'Consorcio de instituicoes de pesquisa e defesa digital.',
    websiteUrl: 'https://rnsc.org.br',
    testimonial: 'Integracao constante para simulacao de cenarios de ataque e defesa.',
    position: 2,
    status: 'published' as const,
  },
];

export async function seedPartners(
  db: NodePgDatabase<Record<string, unknown>>,
  adminUserId?: string,
): Promise<void> {
  for (const item of seedPartnersList) {
    await db
      .insert(partners)
      .values({
        name: item.name,
        slug: item.slug,
        description: item.description,
        websiteUrl: item.websiteUrl,
        testimonial: item.testimonial,
        position: item.position,
        status: item.status,
        createdBy: adminUserId ?? null,
        updatedBy: adminUserId ?? null,
      })
      .onConflictDoUpdate({
        target: partners.slug,
        set: {
          name: item.name,
          description: item.description,
          websiteUrl: item.websiteUrl,
          testimonial: item.testimonial,
          position: item.position,
          status: item.status,
          updatedAt: new Date(),
        },
      });
  }
}
