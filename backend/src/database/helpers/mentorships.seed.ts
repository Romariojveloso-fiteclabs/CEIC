import { eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { mentorshipScheduleEntries, mentorships } from '../schema/mentorships.schema.js';

export const seedMentorshipsList = [
  {
    title: 'Mentoria Executiva em Lideranca de Seguranca (CISO Track)',
    slug: 'mentoria-ciso-track',
    shortDescription: 'Orientacao individual para gestores e lideres de seguranca da informacao.',
    description: 'Programa focado em governanca corporativa, gestao de riscos ciberneticos, orcamento e comunicacao com diretoria.',
    durationMonths: 6,
    workloadHours: 60,
    applicationUrl: 'https://ceic.tec.br/mentorias/ciso-track/aplicar',
    noticeUrl: 'https://ceic.tec.br/editais/mentoria-ciso-2026.pdf',
    status: 'published' as const,
    publishedAt: new Date('2026-01-20T00:00:00Z'),
    mentorSlug: 'eduardo-ramos',
  },
];

export async function seedMentorships(
  db: NodePgDatabase<Record<string, unknown>>,
  peopleMap: Map<string, string>,
  adminUserId?: string,
): Promise<void> {
  for (const item of seedMentorshipsList) {
    const mentorId = peopleMap.get(item.mentorSlug);

    const [inserted] = await db
      .insert(mentorships)
      .values({
        title: item.title,
        slug: item.slug,
        shortDescription: item.shortDescription,
        description: item.description,
        mentorPersonId: mentorId ?? null,
        durationMonths: item.durationMonths,
        workloadHours: item.workloadHours,
        applicationUrl: item.applicationUrl,
        noticeUrl: item.noticeUrl,
        status: item.status,
        publishedAt: item.publishedAt,
        createdBy: adminUserId ?? null,
        updatedBy: adminUserId ?? null,
      })
      .onConflictDoUpdate({
        target: mentorships.slug,
        set: {
          title: item.title,
          shortDescription: item.shortDescription,
          description: item.description,
          mentorPersonId: mentorId ?? null,
          durationMonths: item.durationMonths,
          workloadHours: item.workloadHours,
          applicationUrl: item.applicationUrl,
          noticeUrl: item.noticeUrl,
          status: item.status,
          publishedAt: item.publishedAt,
          updatedAt: new Date(),
        },
      })
      .returning({ id: mentorships.id });

    if (!inserted) continue;

    const [existingSchedule] = await db
      .select({ id: mentorshipScheduleEntries.id })
      .from(mentorshipScheduleEntries)
      .where(eq(mentorshipScheduleEntries.mentorshipId, inserted.id))
      .limit(1);

    if (!existingSchedule) {
      await db.insert(mentorshipScheduleEntries).values({
        mentorshipId: inserted.id,
        date: new Date('2026-03-12T00:00:00Z'),
        startTime: '19:00',
        endTime: '21:00',
        title: 'Sessao de Alinhamento e Diagnostico de Maturidade',
        description: 'Definicao de metas e avaliacao do cenario atual da organizacao.',
        position: 1,
      });
    }
  }
}
