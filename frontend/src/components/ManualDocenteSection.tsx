import React, { useState } from 'react';
import { docenteManualStepsData } from '../data/docenteManualData';
import { 
  GraduationCap, 
  CheckCircle2, 
  ExternalLink, 
  Download, 
  AlertTriangle, 
  FileSpreadsheet, 
  FileText, 
  Mail, 
  HelpCircle,
  ChevronRight
} from 'lucide-react';

export const ManualDocenteSection: React.FC = () => {
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const activeStep = docenteManualStepsData[activeStepIdx];

  return (
    <section id="manual-docente" className="py-12 md:py-20 bg-[#F7F9FB] dark:bg-[#000B13] border-b border-[#D5D8DC] dark:border-[#0e304b] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase bg-[#508EBC]/15 text-[#508EBC] dark:text-[#80B7DF] border border-[#508EBC]/30">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Portal do Docente · Orientações Oficiais</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#021C2F] dark:text-white">
            Manual Operacional do Docente
          </h2>

          <p className="text-sm sm:text-base text-[#26292D] dark:text-slate-300 leading-relaxed">
            Instruções normativas para docentes internos e especialistas convidados da iniciativa privada. Passo a passo para credenciamento no SIGAA UFPE, ativação de e-mail institucional, registro de frequência e submissão formal de proventos.
          </p>
        </div>

        {/* Global Warning Banner */}
        <div className="mb-10 p-4 sm:p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-4">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm text-[#021C2F] dark:text-amber-200">
            <h4 className="font-bold text-amber-600 dark:text-amber-300 uppercase tracking-wide text-xs">
              Aviso Importante sobre Fechamento de Diário no SIGAA
            </h4>
            <p className="leading-relaxed">
              O sistema acadêmico SIGAA não permite o registro de faltas após o lançamento das notas finais. Registre impreterivelmente toda a frequência antes de consolidar as médias dos alunos. A consolidação é irreversível no sistema universitário.
            </p>
          </div>
        </div>

        {/* Interactive Steps Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Steps Navigation Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-2">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 px-2 pb-1">
              Etapas Operacionais:
            </div>
            {docenteManualStepsData.map((step, idx) => {
              const isActive = idx === activeStepIdx;
              return (
                <button
                  key={step.stepNumber}
                  onClick={() => setActiveStepIdx(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                    isActive
                      ? 'bg-[#508EBC]/20 border-[#508EBC] text-[#021C2F] dark:text-white shadow-xs'
                      : 'bg-[#FFFFFF] dark:bg-[#021C2F] border-[#D5D8DC] dark:border-[#0e304b] text-[#26292D] dark:text-slate-300 hover:border-[#508EBC]/50'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-md font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                    isActive
                      ? 'bg-[#508EBC] text-white'
                      : 'bg-[#F3F3F3] dark:bg-[#000B13] text-slate-400'
                  }`}>
                    {step.stepNumber}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold truncate">
                      {step.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {step.instruction}
                    </p>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-[#508EBC] translate-x-0.5' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </div>

          {/* Active Step Details & Screenshots (8 cols) */}
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-2xl bg-[#FFFFFF] dark:bg-[#021C2F] border border-[#D5D8DC] dark:border-[#0e304b] shadow-sm space-y-6">
            {/* Step Header */}
            <div className="space-y-2 border-b border-[#D5D8DC] dark:border-[#0e304b] pb-4">
              <div className="text-xs font-mono font-bold text-[#508EBC] dark:text-[#80B7DF]">
                ETAPA {activeStep.stepNumber} DE {docenteManualStepsData.length}
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#021C2F] dark:text-white">
                {activeStep.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#26292D]/80 dark:text-slate-300 leading-relaxed">
                {activeStep.instruction}
              </p>
            </div>

            {/* Instruction Checklist */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Procedimento Recomendado:
              </h4>
              <ul className="space-y-2 text-xs text-[#26292D] dark:text-slate-300">
                {activeStep.details.map((detail, dIdx) => (
                  <li key={dIdx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#508EBC] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Specific Warning if present */}
            {activeStep.importantNotice && (
              <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-700 dark:text-amber-300 font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{activeStep.importantNotice}</span>
              </div>
            )}

            {/* Action Links & Downloads */}
            {activeStep.actionLinks && activeStep.actionLinks.length > 0 && (
              <div className="pt-2 flex flex-wrap gap-3">
                {activeStep.actionLinks.map((link, lIdx) => (
                  <a
                    key={lIdx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#508EBC] hover:bg-[#417fae] text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    {link.isDownload ? <Download className="w-3.5 h-3.5" /> : <ExternalLink className="w-3.5 h-3.5" />}
                    <span>{link.label}</span>
                  </a>
                ))}
              </div>
            )}

            {/* Screenshots Gallery */}
            {activeStep.screenshots && activeStep.screenshots.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-[#D5D8DC] dark:border-[#0e304b]">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Telas do Sistema SIGAA / UFPE:
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  {activeStep.screenshots.map((screen, sIdx) => (
                    <div
                      key={sIdx}
                      className="rounded-xl border border-[#D5D8DC] dark:border-[#0e304b] overflow-hidden bg-slate-900 shadow-xs"
                    >
                      <img
                        src={screen.url}
                        alt={screen.caption || activeStep.title}
                        className="w-full h-auto object-contain max-h-[460px] mx-auto"
                        loading="lazy"
                      />
                      {screen.caption && (
                        <div className="p-2.5 bg-[#000B13]/70 text-[11px] font-mono text-slate-300 border-t border-[#0e304b]">
                          {screen.caption}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
