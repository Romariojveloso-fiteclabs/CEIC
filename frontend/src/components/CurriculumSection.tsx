import React, { useState } from 'react';
import { programsData } from '../data/modulesData';
import { CourseProgram, CourseModule } from '../types/course';
import { 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Wrench, 
  Check, 
  BookOpen, 
  Layers, 
  Download, 
  Terminal,
  Shield,
  Award,
  UserCheck
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ScrollTypewriterHeader } from './ScrollTypewriter';

interface CurriculumSectionProps {
  onOpenBrochure: () => void;
}

export const CurriculumSection: React.FC<CurriculumSectionProps> = ({ onOpenBrochure }) => {
  const { t } = useLanguage();
  const [selectedProgramId, setSelectedProgramId] = useState<string>(programsData[0].id);
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [expandedModuleId, setExpandedModuleId] = useState<number | null>(1);

  const currentProgram = programsData.find((p) => p.id === selectedProgramId) || programsData[0];

  const categories = [
    { id: 'todos', label: 'Todos os Módulos' },
    { id: 'ofensiva', label: 'Segurança Ofensiva' },
    { id: 'deteccao', label: 'Detecção & SOC' },
    { id: 'forense', label: 'Forense & Resposta' },
    { id: 'inteligencia', label: 'IA & Inteligência' },
    { id: 'governanca', label: 'Governança & LGPD' },
    { id: 'nuvem', label: 'Cloud & IAM' },
  ];

  const filteredModules = selectedCategory === 'todos'
    ? currentProgram.modules
    : currentProgram.modules.filter((m) => m.category === selectedCategory);

  const toggleModule = (id: number) => {
    setExpandedModuleId(expandedModuleId === id ? null : id);
  };

  const totalHours = currentProgram.workloadTotal;
  const totalPractical = currentProgram.practicalHours;

  return (
    <section id="curriculo" className="py-12 md:py-20 bg-[#F7F9FB] dark:bg-[#000B13] border-b border-[#D5D8DC] dark:border-[#0e304b] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Overview */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <ScrollTypewriterHeader
            kicker="PROGRAMAS ACADÊMICOS & MATRIZ CURRICULAR"
            title="Estrutura Curricular e Especializações"
            subtitle="Conheça a grade analítica completa das pós-graduações e programas de mentoria com certificação oficial da Universidade Federal de Pernambuco (UFPE)."
            className="max-w-2xl space-y-3 mb-0"
            titleClassName="font-display text-2xl sm:text-3xl font-bold text-[#021C2F] dark:text-white tracking-tight min-h-[36px]"
            subtitleClassName="text-sm text-[#26292D] dark:text-slate-300 leading-relaxed min-h-[24px]"
          />

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenBrochure}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#021C2F] dark:text-white hover:text-[#000B13] dark:hover:text-[#80B7DF] bg-[#FFFFFF] dark:bg-[#021C2F] hover:bg-[#F3F3F3] dark:hover:bg-[#052136] border border-[#D5D8DC] dark:border-[#0e304b] rounded-md transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#508EBC]"
            >
              <Download className="w-3.5 h-3.5 text-[#508EBC]" />
              <span>{t.modalBrochure.downloadBtn}</span>
            </button>
          </div>
        </div>

        {/* Program Switcher Tabs */}
        <div className="mb-8 flex flex-wrap gap-2 p-1.5 rounded-xl bg-[#F3F3F3] dark:bg-[#001726] border border-[#D5D8DC] dark:border-[#0e304b]">
          {programsData.map((prog) => {
            const isSelected = prog.id === selectedProgramId;
            return (
              <button
                key={prog.id}
                onClick={() => {
                  setSelectedProgramId(prog.id);
                  setSelectedCategory('todos');
                  setExpandedModuleId(1);
                }}
                className={`flex-1 min-w-[240px] px-4 py-2.5 rounded-lg text-xs font-semibold transition-all text-left ${
                  isSelected
                    ? 'bg-[#508EBC] text-white shadow-xs'
                    : 'text-[#26292D] dark:text-slate-300 hover:bg-[#FFFFFF] dark:hover:bg-[#021C2F]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate">{prog.title}</span>
                  <span className="text-[10px] font-mono opacity-80 shrink-0 ml-2">
                    {prog.workloadTotal}h
                  </span>
                </div>
                <div className="text-[10px] font-mono opacity-75 mt-0.5 truncate font-normal">
                  {prog.degree}
                </div>
              </button>
            );
          })}
        </div>

        {/* Operational summary strip */}
        <div className="mb-8 p-4 rounded-lg bg-[#FFFFFF] dark:bg-[#021C2F] border border-[#D5D8DC] dark:border-[#0e304b] flex flex-wrap items-center justify-between gap-4 text-xs text-[#26292D] dark:text-slate-300 font-mono shadow-xs transition-colors">
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <span className="text-[#26292D]/70 dark:text-slate-400 block text-[10px] uppercase">Carga Horária Total</span>
              <strong className="text-[#021C2F] dark:text-white text-sm tabular-nums">{totalHours} horas</strong>
            </div>
            <div className="h-6 w-px bg-[#D5D8DC] dark:border-[#0e304b]"></div>
            <div>
              <span className="text-[#26292D]/70 dark:text-slate-400 block text-[10px] uppercase">Práticas & Residência</span>
              <strong className="text-[#508EBC] dark:text-[#80B7DF] text-sm tabular-nums">{totalPractical} horas</strong>
            </div>
            <div className="h-6 w-px bg-[#D5D8DC] dark:border-[#0e304b]"></div>
            <div>
              <span className="text-[#26292D]/70 dark:text-slate-400 block text-[10px] uppercase">Formato</span>
              <strong className="text-[#021C2F] dark:text-white text-sm">Híbrido / Presencial Opcional</strong>
            </div>
            <div className="h-6 w-px bg-[#D5D8DC] dark:border-[#0e304b]"></div>
            <div>
              <span className="text-[#26292D]/70 dark:text-slate-400 block text-[10px] uppercase">Emissão Oficial</span>
              <strong className="text-[#021C2F] dark:text-white text-sm">Universidade Federal de Pernambuco (UFPE)</strong>
            </div>
          </div>
          <div className="text-[11px] text-[#26292D]/70 dark:text-slate-400">
            * Resolução CNE/CES nº 1/2018 (MEC)
          </div>
        </div>

        {/* Selected Program Description */}
        <div className="mb-6 p-4 rounded-xl bg-[#508EBC]/10 border border-[#508EBC]/30">
          <h3 className="font-display font-bold text-sm text-[#021C2F] dark:text-white">
            {currentProgram.title}
          </h3>
          <p className="text-xs text-[#26292D]/80 dark:text-slate-300 mt-1 leading-relaxed">
            {currentProgram.description}
          </p>
        </div>

        {/* Interactive Segmented Filter Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F3F3F3] dark:bg-[#001726] rounded-lg border border-[#D5D8DC] dark:border-[#0e304b] overflow-x-auto mb-8 transition-colors">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#508EBC] ${
                selectedCategory === cat.id
                  ? 'bg-[#FFFFFF] dark:bg-[#021C2F] text-[#021C2F] dark:text-white font-semibold shadow-xs'
                  : 'text-[#26292D]/70 dark:text-slate-400 hover:text-[#021C2F] dark:hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Modules Accordion List */}
        <div className="space-y-4">
          {filteredModules.map((module) => {
            const isExpanded = expandedModuleId === module.id;
            return (
              <div
                key={module.id}
                className={`rounded-xl border transition-all ${
                  isExpanded
                    ? 'bg-[#FFFFFF] dark:bg-[#021C2F] border-[#508EBC] dark:border-[#508EBC] shadow-sm'
                    : 'bg-[#FFFFFF] dark:bg-[#021C2F] border-[#D5D8DC] dark:border-[#0e304b] hover:border-[#508EBC]/50'
                }`}
              >
                {/* Module Bar */}
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                    <span className="font-mono text-xs font-bold text-[#508EBC] dark:text-[#80B7DF] bg-[#508EBC]/15 px-2 py-1 rounded shrink-0">
                      {module.code}
                    </span>
                    <div className="min-w-0">
                      <h4 className="font-display text-sm sm:text-base font-bold text-[#021C2F] dark:text-white truncate">
                        {module.title}
                      </h4>
                      <p className="text-xs text-slate-400 font-mono mt-0.5 truncate">
                        {module.categoryLabel} · {module.workload}h ({module.practicalHours}h práticas)
                        {module.instructor && ` · Docente: ${module.instructor}`}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-slate-400">
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-[#508EBC]" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-5 pb-6 pt-2 border-t border-[#D5D8DC] dark:border-[#0e304b] space-y-4 text-xs animate-in fade-in duration-150">
                    <div>
                      <h5 className="font-mono uppercase text-[10px] tracking-wider text-slate-400 mb-1">
                        Ementa da Disciplina:
                      </h5>
                      <p className="text-[#26292D] dark:text-slate-300 leading-relaxed">
                        {module.summary}
                      </p>
                    </div>

                    {/* Topics and Tools Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-2">
                        <h5 className="font-mono uppercase text-[10px] tracking-wider text-slate-400 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-[#508EBC]" />
                          <span>Conteúdo Programático & Tópicos:</span>
                        </h5>
                        <ul className="space-y-1.5 text-[#26292D]/80 dark:text-slate-300">
                          {module.topics.map((t, tIdx) => (
                            <li key={tIdx} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#508EBC] shrink-0 mt-1.5"></span>
                              <span>{t}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h5 className="font-mono uppercase text-[10px] tracking-wider text-slate-400 flex items-center gap-1.5 mb-1.5">
                            <Wrench className="w-3.5 h-3.5 text-[#508EBC]" />
                            <span>Ferramentas & Laboratórios:</span>
                          </h5>
                          <div className="flex flex-wrap gap-1.5">
                            {module.tools.map((tool, toolIdx) => (
                              <span
                                key={toolIdx}
                                className="px-2 py-0.5 rounded bg-[#F3F3F3] dark:bg-[#001726] border border-[#D5D8DC] dark:border-[#0e304b] text-[11px] font-mono text-[#021C2F] dark:text-slate-200"
                              >
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h5 className="font-mono uppercase text-[10px] tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                            <Award className="w-3.5 h-3.5 text-[#508EBC]" />
                            <span>Método Avaliativo:</span>
                          </h5>
                          <p className="text-[#26292D]/80 dark:text-slate-300 italic">
                            {module.evaluationMethod}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
