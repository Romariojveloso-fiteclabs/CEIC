import { and, eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { news, newsPeople } from '../schema/news.schema.js';

export const seedNewsList = [
  {
    title: 'Inauguração das Novas Instalações do CEIC',
    slug: 'inauguracao-novas-instalacoes-ceic',
    summary: 'Novo espaço dedicado à pesquisa e treinamento prático em segurança cibernética.',
    content: `O CEIC inaugurou oficialmente suas novas instalações com laboratórios equipados para exercícios práticos de defesa e resposta a incidentes.

O ambiente simula infraestruturas reais e permite testes avançados de segurança.`,
    status: 'published' as const,
    publishedAt: new Date('2026-02-10T10:00:00Z'),
    authorSlug: 'eduardo-ramos',
  },
  {
    title: 'Abertura das Inscrições para Turmas de 2026',
    slug: 'abertura-inscricoes-turmas-2026',
    summary: 'Cursos de especialização em Defesa Cibernética e Forense estão com vagas abertas.',
    content: `Estão abertas as inscrições para as primeiras turmas de 2026. Os interessados devem submeter sua documentação pelo portal do candidato.`,
    status: 'published' as const,
    publishedAt: new Date('2026-02-15T14:00:00Z'),
    authorSlug: 'marina-albuquerque',
  },
];

export async function seedNews(
  db: NodePgDatabase<Record<string, unknown>>,
  peopleMap: Map<string, string>,
  adminUserId?: string,
): Promise<void> {
  for (const item of seedNewsList) {
    const [inserted] = await db
      .insert(news)
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
        target: news.slug,
        set: {
          title: item.title,
          summary: item.summary,
          content: item.content,
          status: item.status,
          publishedAt: item.publishedAt,
          updatedAt: new Date(),
        },
      })
      .returning({ id: news.id });

    if (!inserted) continue;

    const personId = peopleMap.get(item.authorSlug);
    if (personId) {
      const [existingLink] = await db
        .select()
        .from(newsPeople)
        .where(and(eq(newsPeople.newsId, inserted.id), eq(newsPeople.personId, personId)))
        .limit(1);

      if (!existingLink) {
        await db.insert(newsPeople).values({
          newsId: inserted.id,
          personId,
        });
      }
    }
  }
}
