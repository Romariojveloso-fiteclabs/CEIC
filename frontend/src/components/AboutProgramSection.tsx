import React, { useRef } from 'react';
import { partnersData } from '../data/partnersData';
import { 
  ShieldCheck, 
  Target, 
  Cpu, 
  Award, 
  BookOpen, 
  ArrowRight,
  FileText,
  Building,
  Wifi,
  Users,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ScrollTypewriterHeader, ScrollTypewriterText } from './ScrollTypewriter';
import { useScrollInView } from '../hooks/useScrollInView';

interface AboutProgramSectionProps {
  onExploreCurriculum: () => void;
  onOpenBrochure: () => void;
}

export const AboutProgramSection: React.FC<AboutProgramSectionProps> = ({
  onExploreCurriculum,
  onOpenBrochure,
}) => {
  const { t } = useLanguage();
  const pillarsRef = useRef<HTMLDivElement>(null);
  const arePillarsInView = useScrollInView(pillarsRef as React.RefObject<HTMLElement | null>, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
  });

  const bannerRef = useRef<HTMLDivElement>(null);
  const isBannerInView = useScrollInView(bannerRef as React.RefObject<HTMLElement | null>, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
  });

  const pillars = [
    {
      icon: ShieldCheck,
      title: 'Residência Tecnológica',
      desc: 'Formação orientada a entregas concretas: 360h de embasamento aliadas a 120h práticas focadas em produtos tangíveis e depósitos de patentes.',
    },
    {
      icon: Target,
      title: 'Metodologia Invertida',
      desc: 'No último encontro de cada disciplina, o aluno assume a condução com provas de conceito reais, laudos periciais e relatórios de auditoria.',
    },
    {
      icon: Cpu,
      title: 'Laboratórios & Cyber Range',
      desc: 'Simulações táticas em redes operadas por ferramentas de mercado (Wazuh, Volatility, Splunk, YARA e Caatinga Malware DB).',
    },
    {
      icon: Award,
      title: 'Chancela Oficial UFPE',
      desc: 'Certificado de especialista emitido e registrado oficialmente pela melhor universidade da região Norte/Nordeste.',
    },
  ];

  return (
    <section id="sobre-o-programa" className="py-12 md:py-20 bg-[#F7F9FB] dark:bg-[#000B13] border-b border-[#D5D8DC] dark:border-[#0e304b] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header with typewriter streaming */}
        <ScrollTypewriterHeader
          kicker="CENTRO DE EXCELÊNCIA EM INTELIGÊNCIA CIBERNÉTICA"
          kickerIcon={BookOpen}
          title="Formação Avançada, Pesquisa e Inovação"
          subtitle="Somos referência nacional na capacitação de especialistas e no desenvolvimento de soluções contra ameaças digitais complexas, integrando o meio acadêmico da UFPE à iniciativa privada."
          className="max-w-3xl space-y-3"
          titleClassName="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#021C2F] dark:text-white min-h-[38px] sm:min-h-[48px]"
          subtitleClassName="text-sm sm:text-base text-[#26292D] dark:text-slate-300 leading-relaxed min-h-[48px]"
        />

        {/* 4 Pillars Grid */}
        <div ref={pillarsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#021C2F] border border-[#D5D8DC] dark:border-[#0e304b] shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5 group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#508EBC]/15 border border-[#508EBC]/30 text-[#508EBC] dark:text-[#80B7DF] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-display text-sm font-bold text-[#021C2F] dark:text-white mb-2 min-h-[22px]">
                  <ScrollTypewriterText 
                    text={pillar.title} 
                    speed={25}
                    delay={100 + i * 60}
                    enabled={arePillarsInView}
                    showCursor={true}
                    persistentCursor={false}
                  />
                </h3>
                <p className="text-xs text-[#26292D]/80 dark:text-slate-300 leading-relaxed min-h-[48px]">
                  <ScrollTypewriterText 
                    text={pillar.desc} 
                    speed={15}
                    delay={250 + i * 60}
                    enabled={arePillarsInView}
                    showCursor={false}
                  />
                </p>
              </div>
            );
          })}
        </div>

        {/* Official Partners Section */}
        <div className="space-y-6 pt-6 border-t border-[#D5D8DC] dark:border-[#0e304b]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#508EBC] dark:text-[#80B7DF] font-semibold block">
                Ecossistema Corporativo
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#021C2F] dark:text-white">
                Parceiros Tecnológicos e Institucionais
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Cooperação técnica com líderes globais em cibersegurança
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
            {partnersData.map((partner) => (
              <div
                key={partner.id}
                className="p-4 rounded-xl bg-[#FFFFFF] dark:bg-[#021C2F] border border-[#D5D8DC] dark:border-[#0e304b] flex flex-col items-center text-center justify-between shadow-xs hover:border-[#508EBC]/60 transition-all group"
              >
                <div className="h-14 w-full flex items-center justify-center p-2 mb-2">
                  <img
                    src={partner.logoUrl}
                    alt={partner.name}
                    className="max-h-12 max-w-[120px] object-contain filter dark:brightness-110 group-hover:scale-105 transition-transform"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <div className="space-y-1 w-full border-t border-[#D5D8DC]/60 dark:border-[#0e304b] pt-2">
                  <h4 className="text-xs font-bold text-[#021C2F] dark:text-white">
                    {partner.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {partner.categoryLabel}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Physical Facility Showcase */}
        <div className="rounded-2xl bg-[#FFFFFF] dark:bg-[#021C2F] border border-[#D5D8DC] dark:border-[#0e304b] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Description */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase bg-[#508EBC]/15 text-[#508EBC] dark:text-[#80B7DF] border border-[#508EBC]/30">
                <Building className="w-3.5 h-3.5" />
                <span>Polo Físico & Transmissão</span>
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#021C2F] dark:text-white">
                Espaço Físico para Aulas e Transmissões Online
              </h3>

              <p className="text-xs sm:text-sm text-[#26292D]/80 dark:text-slate-300 leading-relaxed">
                Pensando no máximo conforto e qualidade das transmissões, o CEIC disponibiliza instalações preparadas para até 30 alunos com estações de trabalho de alto desempenho, climatização, isolamento acústico e conectividade de fibra óptica redundante.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono text-slate-400 pt-2">
                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-[#508EBC]" />
                  <span>Fibra Óptica Dedicada</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#508EBC]" />
                  <span>Capacidade para 30 alunos</span>
                </div>
                <div className="flex items-center gap-2 col-span-2">
                  <MapPin className="w-4 h-4 text-[#508EBC] shrink-0" />
                  <span className="truncate">Av. República do Líbano, 251, Sala 1501, Pina, Recife/PE</span>
                </div>
              </div>
            </div>

            {/* Photos Preview Grid */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl overflow-hidden aspect-video bg-slate-900 border border-[#D5D8DC] dark:border-[#0e304b]">
                <img
                  src="https://ceic.tec.br/wp-content/uploads/2025/10/image-62.jpg"
                  alt="Auditório CEIC"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="rounded-xl overflow-hidden aspect-video bg-slate-900 border border-[#D5D8DC] dark:border-[#0e304b]">
                <img
                  src="https://ceic.tec.br/wp-content/uploads/2025/10/image-61.jpg"
                  alt="Estações de Trabalho"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="rounded-xl overflow-hidden aspect-video bg-slate-900 border border-[#D5D8DC] dark:border-[#0e304b]">
                <img
                  src="https://ceic.tec.br/wp-content/uploads/2025/10/image-60.jpg"
                  alt="Ambiente de Aprendizagem"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="rounded-xl overflow-hidden aspect-video bg-slate-900 border border-[#D5D8DC] dark:border-[#0e304b]">
                <img
                  src="https://ceic.tec.br/wp-content/uploads/2025/10/image-53.jpg"
                  alt="Área de Convivência"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Callout */}
        <div ref={bannerRef} className="p-6 sm:p-8 rounded-2xl bg-[#021C2F] text-white border border-[#508EBC]/40 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-display text-xl sm:text-2xl font-bold">
              Pronto para atuar na vanguarda da defesa cibernética?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Consulte a matriz curricular detalhada ou baixe o Projeto Pedagógico do Curso (PPC) com a chancela da UFPE.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenBrochure}
              className="px-4 py-2.5 rounded-lg border border-[#508EBC]/50 hover:bg-[#508EBC]/20 text-xs font-semibold text-white transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-[#80B7DF]" />
              <span>Ver PPC Oficial</span>
            </button>

            <button
              onClick={onExploreCurriculum}
              className="px-4 py-2.5 rounded-lg bg-[#508EBC] hover:bg-[#417fae] text-xs font-semibold text-white transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>Explorar Matriz</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
