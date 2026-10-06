import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { pages } from '../schema/pages.schema.js';

export const seedPagesList = [
  {
    title: 'Sobre o CEIC',
    slug: 'sobre',
    summary: 'Conheça o Centro Especializado em Inovação e Cibersegurança.',
    content: `# Sobre o CEIC

O **Centro Especializado em Inovação e Cibersegurança (CEIC)** é uma iniciativa voltada para a capacitação de alto nível em segurança da informação, defesa cibernética e pesquisa aplicada.

## Nossa Missão
Formar especialistas capacitados para proteger infraestruturas críticas e enfrentar desafios contemporâneos de cibersegurança.`,
    status: 'published' as const,
    publishedAt: new Date('2026-01-01T00:00:00Z'),
  },
  {
    title: 'Perguntas Frequentes (FAQ)',
    slug: 'faq',
    summary: 'Dúvidas comuns sobre turmas, pré-requisitos e certificações.',
    content: `# Perguntas Frequentes

### Quem pode participar das capacitações?
Profissionais e estudantes com formação básica em tecnologia, redes ou desenvolvimento.

### Os cursos oferecem certificado?
Sim, todos os cursos de especialização conferem certificado aos participantes concluintes.`,
    status: 'published' as const,
    publishedAt: new Date('2026-01-01T00:00:00Z'),
  },
  {
    title: 'Processo Seletivo e Inscrições',
    slug: 'processo-de-inscricao',
    summary: 'Informações detalhadas sobre como se inscrever nos cursos do CEIC.',
    content: `# Processo Seletivo

1. Preenchimento do formulário de inscrição.
2. Análise curricular e comprovação de pré-requisitos.
3. Matrícula confirmada mediante disponibilidade de vagas.`,
    status: 'published' as const,
    publishedAt: new Date('2026-01-05T00:00:00Z'),
  },
];

export async function seedPages(
  db: NodePgDatabase<Record<string, unknown>>,
  adminUserId?: string,
): Promise<Map<string, string>> {
  const pageMap = new Map<string, string>();

  for (const item of seedPagesList) {
    const [inserted] = await db
      .insert(pages)
      .values({
        title: item.title,
        slug: item.slug,
        summary: item.summary,
        content: item.content,
        status: item.status,
        publishedAt: item.publishedAt,
        createdBy: adminUserId ?? null,
        updatedBy: adminUserId ?? null,
      })
      .onConflictDoUpdate({
        target: pages.slug,
        set: {
          title: item.title,
          summary: item.summary,
          content: item.content,
          status: item.status,
          publishedAt: item.publishedAt,
          updatedAt: new Date(),
        },
      })
      .returning({ id: pages.id, slug: pages.slug });

    if (inserted) {
      pageMap.set(inserted.slug, inserted.id);
    }
  }

  return pageMap;
}
