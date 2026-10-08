import React, { useState } from 'react';
import { selectionStepsData } from '../data/selectionData';
import { 
  Calendar, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight, 
  HelpCircle, 
  Shield, 
  Percent, 
  Calculator,
  QrCode,
  ExternalLink,
  Phone,
  FileCheck,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AdmissionSectionProps {
  onOpenEnrollment: () => void;
}

export const AdmissionSection: React.FC<AdmissionSectionProps> = ({ onOpenEnrollment }) => {
  const { t } = useLanguage();
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const [installments, setInstallments] = useState<number>(12);
  const [selectedDiscount, setSelectedDiscount] = useState<'none' | 'pontual' | 'seguranca' | 'ufpe'>('pontual');
  const [paymentType, setPaymentType] = useState<'parcelado' | 'avista'>('parcelado');

  const baseTotal = 11800;
  
  const discountPercentages = {
    none: 0,
    pontual: 0.10,
    seguranca: 0.15,
    ufpe: 0.20,
  };

  const discountRate = paymentType === 'avista' ? 0.18 : discountPercentages[selectedDiscount];
  const finalTotal = baseTotal * (1 - discountRate);
  const monthlyValue = finalTotal / installments;

  const currentStep = selectionStepsData[activeStepIdx];

  return (
    <section id="admissao" className="py-12 md:py-20 bg-[#F7F9FB] dark:bg-[#000B13] border-b border-[#D5D8DC] dark:border-[#0e304b] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase bg-[#508EBC]/15 text-[#508EBC] dark:text-[#80B7DF] border border-[#508EBC]/30">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Processo Seletivo Oficial · UFPE / CEIC</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#021C2F] dark:text-white">
            Processo de Inscrição, Seleção e Matrícula
          </h2>

          <p className="text-sm sm:text-base text-[#26292D] dark:text-slate-300 leading-relaxed">
            Consulte o tutorial completo e as 8 etapas obrigatórias para ingresso nas turmas de especialização do CEIC. Siga as orientações para submissão documental, recolhimento da taxa via Pix e cadastro no portal acadêmico SIGAA.
          </p>
        </div>

        {/* 8-Step Interactive Admission Guide */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Step Selector Pills (4 cols) */}
          <div className="lg:col-span-4 space-y-2">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 px-2 pb-1">
              Etapas da Seleção:
            </div>
            {selectionStepsData.map((step, idx) => {
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
                      {step.summary}
                    </p>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-[#508EBC] translate-x-0.5' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </div>

          {/* Active Step Panel (8 cols) */}
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-2xl bg-[#FFFFFF] dark:bg-[#021C2F] border border-[#D5D8DC] dark:border-[#0e304b] shadow-sm space-y-6">
            <div className="space-y-2 border-b border-[#D5D8DC] dark:border-[#0e304b] pb-4">
              <div className="text-xs font-mono font-bold text-[#508EBC] dark:text-[#80B7DF]">
                ETAPA {currentStep.stepNumber} DE {selectionStepsData.length}
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#021C2F] dark:text-white">
                {currentStep.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#26292D]/80 dark:text-slate-300 leading-relaxed">
                {currentStep.summary}
              </p>
            </div>

            {/* Checklist */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Instruções e Documentos:
              </h4>
              <ul className="space-y-2 text-xs text-[#26292D] dark:text-slate-300">
                {currentStep.details.map((detail, dIdx) => (
                  <li key={dIdx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#508EBC] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Specific Warning if present */}
            {currentStep.warning && (
              <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-700 dark:text-amber-300 font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{currentStep.warning}</span>
              </div>
            )}

            {/* Tips and WhatsApp info */}
            {currentStep.tips && currentStep.tips.length > 0 && (
              <div className="p-4 rounded-xl bg-[#F7F9FB] dark:bg-[#000B13] border border-[#D5D8DC] dark:border-[#0e304b] space-y-2">
                <h5 className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  Dicas e Atendimento Direto:
                </h5>
                <ul className="space-y-1 text-xs text-[#26292D]/80 dark:text-slate-300">
                  {currentStep.tips.map((t, tIdx) => (
                    <li key={tIdx} className="flex items-start gap-2">
                      <span className="text-[#508EBC] font-mono">·</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action buttons & Image display */}
            <div className="pt-2 flex flex-wrap gap-3">
              {currentStep.actionUrl && (
                <a
                  href={currentStep.actionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#508EBC] hover:bg-[#417fae] text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{currentStep.actionLabel || 'Acessar Link Oficial'}</span>
                </a>
              )}

              <a
                href="https://wa.me/5581983217076?text=Olá,%20gostaria%20de%20informações%20sobre%20a%20Pós-Graduação%20do%20CEIC."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp Empresarial (81) 98321-7076</span>
              </a>
            </div>

            {/* Step Image (e.g. Pix QR code or SIGAA screenshot) */}
            {currentStep.imageUrl && (
              <div className="pt-4 border-t border-[#D5D8DC] dark:border-[#0e304b] space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Material Visual de Apoio:
                </h4>
                <div className="p-4 rounded-xl bg-slate-900 border border-[#D5D8DC] dark:border-[#0e304b] flex justify-center">
                  <img
                    src={currentStep.imageUrl}
                    alt={currentStep.title}
                    className="max-h-[380px] w-auto object-contain rounded-lg"
                    loading="lazy"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Investment & Tuition Calculator */}
        <div className="pt-8 border-t border-[#D5D8DC] dark:border-[#0e304b]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left description */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#508EBC] dark:text-[#80B7DF] font-semibold">
                <Calculator className="w-4 h-4" />
                <span>Planejamento Financeiro</span>
              </div>
              
              <h3 className="font-display text-2xl font-bold text-[#021C2F] dark:text-white">
                Simulador de Investimento
              </h3>

              <p className="text-xs sm:text-sm text-[#26292D] dark:text-slate-300 leading-relaxed">
                Opções transparentes com planos de parcelamento via cartão de crédito ou boleto bancário FADE/UFPE, com descontos especiais para pontualidade, servidores públicos e egressos.
              </p>

              <div className="p-4 rounded-xl bg-[#FFFFFF] dark:bg-[#021C2F] border border-[#D5D8DC] dark:border-[#0e304b] space-y-2 text-xs">
                <div className="font-semibold text-[#021C2F] dark:text-white">
                  Estrutura de Pagamento da Turma:
                </div>
                <ul className="space-y-1 text-slate-400 font-mono text-[11px]">
                  <li>· Taxa de Inscrição no Processo Seletivo: R$ 100,00 (Pix)</li>
                  <li>· Matrícula e Mensalidades viabilizadas via FADE/UFPE</li>
                  <li>· Opção de parcelamento em até 18x sem juros</li>
                </ul>
              </div>
            </div>

            {/* Right Calculator Card */}
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-[#FFFFFF] dark:bg-[#021C2F] border border-[#D5D8DC] dark:border-[#0e304b] shadow-sm space-y-6">
              {/* Payment Mode Toggle */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                  Modalidade de Pagamento:
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-[#F7F9FB] dark:bg-[#000B13] rounded-lg border border-[#D5D8DC] dark:border-[#0e304b]">
                  <button
                    type="button"
                    onClick={() => setPaymentType('parcelado')}
                    className={`py-2 text-xs font-semibold rounded-md transition-all ${
                      paymentType === 'parcelado'
                        ? 'bg-[#508EBC] text-white shadow-xs'
                        : 'text-[#26292D] dark:text-slate-400 hover:text-white'
                    }`}
                  >
                    Parcelado
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentType('avista')}
                    className={`py-2 text-xs font-semibold rounded-md transition-all ${
                      paymentType === 'avista'
                        ? 'bg-[#508EBC] text-white shadow-xs'
                        : 'text-[#26292D] dark:text-slate-400 hover:text-white'
                    }`}
                  >
                    À Vista (18% Desconto)
                  </button>
                </div>
              </div>

              {/* Installment count */}
              {paymentType === 'parcelado' && (
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-slate-400 uppercase">Número de Parcelas:</span>
                    <span className="text-[#021C2F] dark:text-white font-bold">{installments}x</span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="18"
                    step="1"
                    value={installments}
                    onChange={(e) => setInstallments(Number(e.target.value))}
                    className="w-full h-2 bg-[#F3F3F3] dark:bg-[#000B13] rounded-lg appearance-none cursor-pointer accent-[#508EBC]"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                    <span>6x</span>
                    <span>12x (Padrão)</span>
                    <span>18x</span>
                  </div>
                </div>
              )}

              {/* Discounts */}
              {paymentType === 'parcelado' && (
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                    Convênios & Condições Especiais:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'pontual', label: 'Pontualidade (10%)' },
                      { id: 'seguranca', label: 'Forças de Seg./Público (15%)' },
                      { id: 'ufpe', label: 'Egresso UFPE (20%)' },
                      { id: 'none', label: 'Integral Padrão' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedDiscount(opt.id as any)}
                        className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                          selectedDiscount === opt.id
                            ? 'bg-[#508EBC]/20 border-[#508EBC] text-[#021C2F] dark:text-white font-semibold'
                            : 'bg-[#F7F9FB] dark:bg-[#000B13] border-[#D5D8DC] dark:border-[#0e304b] text-[#26292D]/80 dark:text-slate-400'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Calculated Results Box */}
              <div className="p-5 rounded-xl bg-[#508EBC]/15 border border-[#508EBC]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">
                    {paymentType === 'parcelado' ? `Mensalidade Estimada (${installments}x):` : 'Valor com Desconto à Vista:'}
                  </span>
                  <div className="text-2xl sm:text-3xl font-bold font-display text-[#021C2F] dark:text-white">
                    {paymentType === 'parcelado'
                      ? `R$ ${monthlyValue.toFixed(2).replace('.', ',')}`
                      : `R$ ${finalTotal.toFixed(2).replace('.', ',')}`}
                    <span className="text-xs font-normal text-slate-400 ml-1">
                      {paymentType === 'parcelado' ? '/mês' : ' total'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={onOpenEnrollment}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#508EBC] hover:bg-[#417fae] text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Iniciar Candidatura</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
