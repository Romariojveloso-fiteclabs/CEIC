import React, { useRef } from 'react';
import { 
  Layers, 
  ShieldAlert, 
  Image as ImageIcon, 
  FileText, 
  Users, 
  Award, 
  Calculator, 
  MapPin, 
  ArrowRight,
  Tv,
  GraduationCap,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ScrollTypewriterText } from './ScrollTypewriter';
import { useScrollInView } from '../hooks/useScrollInView';

interface PageNavigationCardsProps {
  onNavigatePage: (pageId: string) => void;
}

export const PageNavigationCards: React.FC<PageNavigationCardsProps> = ({ onNavigatePage }) => {
  const { t } = useLanguage();
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useScrollInView(headerRef as React.RefObject<HTMLElement | null>, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
  });

  const pages = [
    {
      id: 'curriculo',
      title: 'Cursos & Matriz',
      tag: 'Especializações · 360h + 120h',
      desc: 'Conheça as pós-graduações em Hacker Ético, Blue Team e Arquitetura com ementas analíticas.',
      icon: Layers,
    },
    {
      id: 'noticias',
      title: 'Corpo Docente na Mídia',
      tag: 'Globo, CBN e Podcasts',
      desc: 'Entrevistas, coberturas ao vivo e participações técnicas dos professores na imprensa.',
      icon: Tv,
    },
    {
      id: 'docentes',
      title: 'Corpo Docente',
      tag: 'Doutores, Mestres e Especialistas',
      desc: 'Professores da UFPE, delegados de polícia e executivos sócios de empresas líderes.',
      icon: Users,
    },
    {
      id: 'admissao',
      title: 'Inscrição & Seleção',
      tag: '8 Etapas com SIGAA e Pix',
      desc: 'Tutorial passo a passo para envio de documentação, taxa via Pix e matrícula no sistema.',
      icon: FileCheck,
    },
    {
      id: 'manual-docente',
      title: 'Manual do Docente',
      tag: 'Rotinas SIGAA & STI',
      desc: 'Guia para professores: lançamento de faltas, notas, datas de avaliação e proventos.',
      icon: GraduationCap,
    },
    {
      id: 'faq',
      title: 'Dúvidas Frequentes',
      tag: '10 Questões Oficiais',
      desc: 'Esclarecimentos sobre certificação UFPE, modalidade híbrida, SIGAA e e-MEC.',
      icon: HelpCircle,
    },
    {
      id: 'cyber-range',
      title: 'Cyber Range & Laboratórios',
      tag: '120h de Residência Prática',
      desc: 'Simulador tático de incidentes e integração com a base Caatinga Malware DB.',
      icon: ShieldAlert,
    },
    {
      id: 'galeria',
      title: 'Galeria & Instalações',
      tag: 'Foto da Turma e Espaço Físico',
      desc: 'Acervo fotográfico das salas de transmissão em alta definição e encontros presenciais.',
      icon: ImageIcon,
    },
    {
      id: 'artigos',
      title: 'Cadernos Técnicos',
      tag: 'Pesquisa Aplicada & Markdown',
      desc: 'Artigos técnicos elaborados por pesquisadores do CEIC com visualizador interativo.',
      icon: FileText,
    },
    {
      id: 'certificacao',
      title: 'Certificação Oficial',
      tag: 'Chancela UFPE & Validador',
      desc: 'Padrão federal de autenticidade emitido pela principal universidade do Norte/Nordeste.',
      icon: Award,
    },
    {
      id: 'contato',
      title: 'Localização & Contato',
      tag: 'UFPE / DES & Polo Pina',
      desc: 'Canais oficiais de atendimento, WhatsApp institucional, telefones e mapa.',
      icon: MapPin,
    },
  ];

  return (
    <section className="py-12 md:py-20 bg-[#F7F9FB] dark:bg-[#000B13] border-b border-[#D5D8DC] dark:border-[#0e304b] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#508EBC] dark:text-[#80B7DF] font-semibold">
              Arquitetura de Navegação
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#021C2F] dark:text-white tracking-tight">
              Acesse as Seções e Conteúdos do Portal
            </h2>
            <p className="text-xs sm:text-sm text-[#26292D]/80 dark:text-slate-300 max-w-xl">
              Navegue rapidamente pelos módulos da residência, regulamentos, editais de seleção e canais de suporte acadêmico.
            </p>
          </div>
        </div>

        {/* Grid of Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {pages.map((page, idx) => {
            const Icon = page.icon;
            return (
              <button
                key={page.id}
                onClick={() => onNavigatePage(page.id)}
                className="group p-5 rounded-2xl bg-[#FFFFFF] dark:bg-[#021C2F] border border-[#D5D8DC] dark:border-[#0e304b] text-left hover:border-[#508EBC] dark:hover:border-[#508EBC] shadow-xs hover:shadow-md transition-all hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#508EBC]/15 border border-[#508EBC]/30 text-[#508EBC] dark:text-[#80B7DF] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-[#508EBC] dark:text-[#80B7DF] bg-[#508EBC]/10 px-2 py-0.5 rounded border border-[#508EBC]/20 truncate max-w-[150px]">
                      {page.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-sm font-bold text-[#021C2F] dark:text-white group-hover:text-[#508EBC] dark:group-hover:text-[#80B7DF] transition-colors">
                      {page.title}
                    </h3>
                    <p className="text-xs text-[#26292D]/70 dark:text-slate-300 mt-1 leading-relaxed line-clamp-2">
                      {page.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-[#D5D8DC]/60 dark:border-[#0e304b] flex items-center justify-between text-xs font-semibold text-[#508EBC] dark:text-[#80B7DF]">
                  <span>Acessar Seção</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
