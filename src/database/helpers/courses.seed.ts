import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { courses } from '../schema/courses.schema.js';

export const seedCoursesList = [
  {
    title: 'Especializacao em Defesa Cibernetica',
    slug: 'defesa-cibernetica',
    shortDescription: 'Formacao avancada em deteccao, resposta a incidentes e seguranca defensiva.',
    description: 'Curso completo cobrindo arquitetura de seguranca de redes, operacoes de SOC, analise de malware e protecao de infraestruturas criticas.',
    status: 'published' as const,
    publishedAt: new Date('2026-01-10T12:00:00Z'),
  },
  {
    title: 'Engenharia de Seguranca Ofensiva',
    slug: 'seguranca-ofensiva',
    shortDescription: 'Testes de intrusao avancados, simulacao de adversarios e exploracao de vulnerabilidades.',
    description: 'Capacitacao pratica em testes de invasao em ambientes corporativos, active directory, aplicacoes web e tecnicas de bypass de contramedidas.',
    status: 'published' as const,
    publishedAt: new Date('2026-02-01T12:00:00Z'),
  },
  {
    title: 'Forense Computacional e Resposta a Incidentes',
    slug: 'forense-computacional',
    shortDescription: 'Coleta, preservacao de evidencias digitais e investigacao pericial de ataques.',
    description: 'Investigacao detalhada de intrusoes, cadeia de custodia, pericia em memoria e analise forense em sistemas Windows e Linux.',
    status: 'published' as const,
    publishedAt: new Date('2026-02-15T12:00:00Z'),
  },
  {
    title: 'Seguranca em Nuvem e DevSecOps',
    slug: 'seguranca-em-nuvem-devsecops',
    shortDescription: 'Implementacao de seguranca continua em pipelines CI/CD e infraestrutura como codigo.',
    description: 'Praticas de automacao de testes de seguranca (SAST/DAST), governanca cloud em AWS e Kubernetes seguro.',
    status: 'draft' as const,
    publishedAt: null,
  },
];

export async function seedCourses(
  db: NodePgDatabase<Record<string, unknown>>,
  adminUserId?: string,
): Promise<Map<string, string>> {
  const courseMap = new Map<string, string>();

  for (const item of seedCoursesList) {
    const [inserted] = await db
      .insert(courses)
      .values({
        title: item.title,
        slug: item.slug,
        shortDescription: item.shortDescription,
        description: item.description,
        status: item.status,
        publishedAt: item.publishedAt,
        createdBy: adminUserId ?? null,
        updatedBy: adminUserId ?? null,
      })
      .onConflictDoUpdate({
        target: courses.slug,
        set: {
          title: item.title,
          shortDescription: item.shortDescription,
          description: item.description,
          status: item.status,
          publishedAt: item.publishedAt,
          updatedAt: new Date(),
        },
      })
      .returning({ id: courses.id, slug: courses.slug });

    if (inserted) {
      courseMap.set(inserted.slug, inserted.id);
    }
  }

  return courseMap;
}
