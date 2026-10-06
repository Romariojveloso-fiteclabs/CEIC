import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { disciplines } from '../schema/disciplines.schema.js';

export const seedDisciplinesList = [
  {
    title: 'Arquitetura de Defesa e Monitoramento',
    slug: 'arquitetura-defesa-monitoramento',
    syllabus: 'Conceitos de defesa em profundidade, topologia de rede segura, SIEM, EDR e ingestao de telemetria.',
    bibliography: ['Network Security Monitoring by Richard Bejtlich', 'Applied Incident Response by Steve Anson'],
    defaultCredits: 4,
    defaultWorkloadHours: 60,
    status: 'published' as const,
  },
  {
    title: 'Analise e Mitigacao de Vulnerabilidades',
    slug: 'analise-mitigacao-vulnerabilidades',
    syllabus: 'Varredura de vulnerabilidades, interpretacao de relatorios CVSS, priorizacao de patches e hardening de sistemas.',
    bibliography: ['The Web Application Hacker Handbook by Dafydd Stuttard', 'Security Engineering by Ross Anderson'],
    defaultCredits: 4,
    defaultWorkloadHours: 60,
    status: 'published' as const,
  },
  {
    title: 'Pericia Forense Digital e Preservacao de Cadeia de Custodia',
    slug: 'pericia-forense-digital-cadeia-custodia',
    syllabus: 'Procedimentos legais e tecnicos de apreensao, hashing, analise de sistemas de arquivos e memoria volatil.',
    bibliography: ['The Art of Memory Forensics by Michael Hale Ligh', 'File System Forensic Analysis by Brian Carrier'],
    defaultCredits: 4,
    defaultWorkloadHours: 60,
    status: 'published' as const,
  },
  {
    title: 'Criptografia e Seguranca em Comunicacoes',
    slug: 'criptografia-seguranca-comunicacoes',
    syllabus: 'Criptografia simetrica e assimetrica, infraestrutura de chaves publicas (PKI), TLS e protocolos de rede.',
    bibliography: ['Serious Cryptography by Jean-Philippe Aumasson', 'Cryptography Engineering by Niels Ferguson'],
    defaultCredits: 3,
    defaultWorkloadHours: 45,
    status: 'published' as const,
  },
];

export async function seedDisciplines(
  db: NodePgDatabase<Record<string, unknown>>,
  adminUserId?: string,
): Promise<Map<string, string>> {
  const disciplineMap = new Map<string, string>();

  for (const item of seedDisciplinesList) {
    const [inserted] = await db
      .insert(disciplines)
      .values({
        title: item.title,
        slug: item.slug,
        syllabus: item.syllabus,
        bibliography: item.bibliography,
        defaultCredits: item.defaultCredits,
        defaultWorkloadHours: item.defaultWorkloadHours,
        status: item.status,
        createdBy: adminUserId ?? null,
        updatedBy: adminUserId ?? null,
      })
      .onConflictDoUpdate({
        target: disciplines.slug,
        set: {
          title: item.title,
          syllabus: item.syllabus,
          bibliography: item.bibliography,
          defaultCredits: item.defaultCredits,
          defaultWorkloadHours: item.defaultWorkloadHours,
          status: item.status,
          updatedAt: new Date(),
        },
      })
      .returning({ id: disciplines.id, slug: disciplines.slug });

    if (inserted) {
      disciplineMap.set(inserted.slug, inserted.id);
    }
  }

  return disciplineMap;
}
