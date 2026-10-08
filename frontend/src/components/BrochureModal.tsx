import React, { useState } from 'react';
import { X, FileText, Download, CheckCircle, Layers } from 'lucide-react';
import { modulesData } from '../data/modulesData';
import { useLanguage } from '../context/LanguageContext';

interface BrochureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrochureModal: React.FC<BrochureModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPPC = () => {
    const content = `========================================================================
CENTRO DE EXCELÊNCIA EM INTELIGÊNCIA CIBERNÉTICA (CEIC)
PÓS-GRADUAÇÃO LATO SENSU EM DEFESA CIBERNÉTICA E RESPOSTA A INCIDENTES
CHANCELA ACADÊMICA: UNIVERSIDADE FEDERAL DE PERNAMBUCO (UFPE)
PROJETO PEDAGÓGICO DE CURSO (PPC) & EMENTÁRIO GERAL
========================================================================

1. CARACTERIZAÇÃO DO PROGRAMA
- Carga Horária Total: 480 Horas
  * 360 Horas de Aulas Teóricas e Metodologia Científica
  * 120 Horas de Laboratórios Práticos e Simulação em Cyber Range
- Titulação: Especialista em Defesa Cibernética e Resposta a Incidentes (Lato Sensu)
- Conformidade Legal: Resolução CNE/CES nº 1/2018 (MEC)
- Formato: Aulas síncronas remotas quinzenais + Cyber Range 24/7

2. ESTRUTURA DOS MÓDULOS CURRICULARES:
${modulesData.map(m => `
[${m.code}] MÓDULO ${m.id}: ${m.title}
Carga Horária: ${m.workload}h (${m.practicalHours}h Práticas) - Categoria: ${m.categoryLabel}
Ementa: ${m.summary}
Tópicos:
${m.topics.map(t => `  - ${t}`).join('\n')}
Ferramentas: ${m.tools.join(', ')}
Avaliação: ${m.evaluationMethod}
`).join('\n------------------------------------------------------------------------\n')}

3. CORPO DOCENTE:
- Mestres e Doutores da UFPE, IME e especialistas com certificações CISSP, GCIA e OSCP.

4. CERTIFICAÇÃO E VALIDADE:
- Certificado com registro acadêmico e chave criptográfica SHA-256 pública.
- Validade nacional para concursos públicos, progressão funcional e titulação de especialista.

Portal Oficial: https://ceic.tec.br
Emissão: Recife-PE / Brasil
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'CEIC_PPC_Ementa_Defesa_Cibernetica.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="max-w-2xl w-full rounded-xl bg-[#FFFFFF] dark:bg-[#021C2F] border border-[#D5D8DC] dark:border-[#0e304b] shadow-2xl p-6 sm:p-8 relative text-[#26292D] dark:text-slate-200 max-h-[90vh] overflow-y-auto transition-colors">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-[#021C2F] dark:hover:text-white p-1 rounded-md hover:bg-[#F3F3F3] dark:hover:bg-[#000B13] transition-colors"
          aria-label={t.common.close}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#508EBC]/15 border border-[#508EBC]/30 flex items-center justify-center text-[#508EBC] dark:text-[#80B7DF]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono text-[#508EBC] dark:text-[#80B7DF] uppercase tracking-wider block font-semibold">
                {t.brand.programType}
              </span>
              <h3 className="font-display text-xl font-bold text-[#021C2F] dark:text-white">
                {t.modalBrochure.title}
              </h3>
            </div>
          </div>

          <p className="text-xs text-[#26292D]/80 dark:text-slate-300 leading-relaxed">
            {t.modalBrochure.subtitle}
          </p>

          <div className="p-4 rounded-lg bg-[#F3F3F3] dark:bg-[#001726] border border-[#D5D8DC] dark:border-[#0e304b] space-y-3 font-mono text-xs">
            <div className="flex justify-between text-[#26292D]/70 dark:text-slate-300 border-b border-[#D5D8DC] dark:border-[#0e304b] pb-2">
              <span>DOCUMENT:</span>
              <span className="text-[#021C2F] dark:text-white font-semibold">PPC-CEIC-DEF-2026.1</span>
            </div>
            <div className="flex justify-between text-[#26292D]/70 dark:text-slate-300 border-b border-[#D5D8DC] dark:border-[#0e304b] pb-2">
              <span>WORKLOAD:</span>
              <span className="text-[#508EBC] dark:text-[#80B7DF] font-semibold">{t.hero.workload}</span>
            </div>
            <div className="flex justify-between text-[#26292D]/70 dark:text-slate-300 border-b border-[#D5D8DC] dark:border-[#0e304b] pb-2">
              <span>DEGREE:</span>
              <span className="text-[#021C2F] dark:text-white">{t.hero.degree}</span>
            </div>
            <div className="flex justify-between text-[#26292D]/70 dark:text-slate-300">
              <span>INSTITUTION:</span>
              <span className="text-[#508EBC] dark:text-[#80B7DF] font-semibold">UFPE / MEC</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#26292D]/80 dark:text-slate-300 flex items-center gap-1.5 font-semibold">
              <Layers className="w-3.5 h-3.5 text-[#508EBC] dark:text-[#80B7DF]" />
              <span>{t.curriculum.title}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {modulesData.map((m) => (
                <div key={m.id} className="p-2 rounded bg-[#FFFFFF] dark:bg-[#000B13] border border-[#D5D8DC] dark:border-[#0e304b] flex items-center gap-2">
                  <span className="text-[#508EBC] dark:text-[#80B7DF] font-mono text-[11px] font-semibold">{m.code}:</span>
                  <span className="text-[#26292D] dark:text-slate-200 truncate">{m.title}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#D5D8DC] dark:border-[#0e304b] flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-medium text-[#26292D] dark:text-slate-300 hover:text-[#021C2F] dark:hover:text-white bg-[#F3F3F3] dark:bg-[#001726] hover:bg-[#FFFFFF] dark:hover:bg-[#021C2F] border border-[#D5D8DC] dark:border-[#0e304b] rounded-md transition-colors"
            >
              {t.common.close}
            </button>

            <button
              onClick={handleDownloadPPC}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#508EBC] hover:bg-[#417fae] rounded-md transition-colors shadow-sm"
            >
              {downloaded ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>{t.modalBrochure.successDesc}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>{t.modalBrochure.downloadBtn}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
