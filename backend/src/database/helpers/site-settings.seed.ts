import { eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { siteSettings } from '../schema/site-settings.schema.js';

export const defaultSiteSettings = {
  id: '00000000-0000-0000-0000-000000000001',
  siteName: 'CEIC - Centro Especializado em Inovação e Cibersegurança',
  siteDescription: 'Plataforma institucional de capacitação de excelência em segurança cibernética e defesa digital.',
  heroTitle: 'Capacitação Estratégica em Cibersegurança',
  heroSubtitle: 'Cursos avançados ministrados por pesquisadores e especialistas de mercado.',
  contactEmail: 'contato@ceic.tec.br',
  contactPhone: '+55 81 3000-0000',
  address: 'Recife, PE - Brasil',
  socialLinks: {
    linkedin: 'https://linkedin.com/company/ceic-ciberseguranca',
    youtube: 'https://youtube.com/@ceic-ciberseguranca',
    github: 'https://github.com/ceic-ciberseguranca',
  },
};

export async function seedSiteSettings(
  db: NodePgDatabase<Record<string, unknown>>,
  adminUserId?: string,
): Promise<void> {
  const [existing] = await db
    .select({ id: siteSettings.id })
    .from(siteSettings)
    .limit(1);

  if (existing) {
    await db
      .update(siteSettings)
      .set({
        siteName: defaultSiteSettings.siteName,
        siteDescription: defaultSiteSettings.siteDescription,
        heroTitle: defaultSiteSettings.heroTitle,
        heroSubtitle: defaultSiteSettings.heroSubtitle,
        contactEmail: defaultSiteSettings.contactEmail,
        contactPhone: defaultSiteSettings.contactPhone,
        address: defaultSiteSettings.address,
        socialLinks: defaultSiteSettings.socialLinks,
        updatedAt: new Date(),
        updatedBy: adminUserId ?? null,
      })
      .where(eq(siteSettings.id, existing.id));
  } else {
    await db.insert(siteSettings).values({
      ...defaultSiteSettings,
      updatedBy: adminUserId ?? null,
    });
  }
}
