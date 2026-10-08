import React, { useState } from 'react';
import { Award, ShieldCheck, CheckCircle, Search, QrCode, Lock, FileCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const CertificationSection: React.FC = () => {
  const { t } = useLanguage();
  const [testHash, setTestHash] = useState('CEIC-UFPE-2025-BR-9942F');
  const [verificationResult, setVerificationResult] = useState<{
    status: 'idle' | 'valid' | 'invalid';
    data?: {
      studentName: string;
      degree: string;
      institution: string;
      workload: string;
      issueDate: string;
      mecRegistry: string;
      sha256: string;
    };
  }>({ status: 'idle' });

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testHash.trim()) return;

    if (testHash.toUpperCase().includes('CEIC') || testHash.length > 8) {
      setVerificationResult({
        status: 'valid',
        data: {
          studentName: 'Registro Acadêmico Verificado (Demonstração)',
          degree: 'Especialista em Defesa Cibernética e Resposta a Incidentes (Lato Sensu)',
          institution: 'Centro de Excelência em Inteligência Cibernética / Parceria UFPE',
          workload: '480 Horas (360h Teóricas + 120h Cyber Range)',
          issueDate: '27 de Fevereiro de 2026',
          mecRegistry: 'e-MEC nº 2024-CIGW-UFPE-0089',
          sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        },
      });
    } else {
      setVerificationResult({ status: 'invalid' });
    }
  };

  return (
    <section id="certificacao" className="py-16 md:py-24 bg-[#F7F9FB] dark:bg-[#000B13] border-b border-[#D5D8DC] dark:border-[#0e304b] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Academic Credentials & Authority (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs font-mono uppercase tracking-wider text-[#508EBC] dark:text-[#80B7DF] font-semibold">
              {t.certification.kicker}
            </div>
            
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#021C2F] dark:text-white tracking-tight leading-tight">
              {t.certification.title}
            </h2>

            <p className="text-sm text-[#26292D] dark:text-slate-300 leading-relaxed">
              {t.certification.subtitle}
            </p>

            {/* Checklist of security standards */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-xs text-[#26292D] dark:text-slate-300">
                <ShieldCheck className="w-4 h-4 text-[#508EBC] shrink-0 mt-0.5" />
                <span><strong>{t.certification.sealTitle}:</strong> {t.certification.sealDesc}</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-[#26292D] dark:text-slate-300">
                <Lock className="w-4 h-4 text-[#80B7DF] shrink-0 mt-0.5" />
                <span><strong>{t.certification.digitalTitle}:</strong> {t.certification.digitalDesc}</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-[#26292D] dark:text-slate-300">
                <QrCode className="w-4 h-4 text-[#508EBC] shrink-0 mt-0.5" />
                <span><strong>{t.certification.careerTitle}:</strong> {t.certification.careerDesc}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Digital Certificate Authenticator (6 cols) */}
          <div className="lg:col-span-6">
            <div className="rounded-lg bg-[#FFFFFF] dark:bg-[#021C2F] border border-[#D5D8DC] dark:border-[#0e304b] p-6 sm:p-7 shadow-sm space-y-5 transition-colors">
              <div className="flex items-center justify-between pb-4 border-b border-[#D5D8DC] dark:border-[#0e304b]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded bg-[#508EBC]/15 border border-[#508EBC]/30 flex items-center justify-center text-[#508EBC] dark:text-[#80B7DF]">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#021C2F] dark:text-white font-display">
                      Validador de Autenticidade de Certificados
                    </h3>
                    <span className="text-[11px] text-[#26292D]/70 dark:text-slate-400 font-mono">
                      Sistema Oficial de Verificação de Registros CEIC
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#508EBC] dark:text-[#80B7DF] bg-[#508EBC]/10 px-2 py-0.5 rounded font-semibold border border-[#508EBC]/20">
                  ONLINE
                </span>
              </div>

              {/* Form to verify hash */}
              <form onSubmit={handleVerify} className="space-y-3">
                <label className="block text-xs font-mono text-[#021C2F] dark:text-slate-200">
                  Código de Autenticação / Hash de Registro:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testHash}
                    onChange={(e) => setTestHash(e.target.value)}
                    placeholder="Ex: CEIC-UFPE-2025-BR-9942F"
                    className="flex-1 px-3 py-2 text-xs font-mono bg-[#F7F9FB] dark:bg-[#000B13] border border-[#D5D8DC] dark:border-[#0e304b] rounded-md text-[#26292D] dark:text-white placeholder-[#26292D]/40 dark:placeholder-slate-500 focus:outline-none focus:border-[#508EBC]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#508EBC] hover:bg-[#417fae] rounded-md transition-colors flex items-center gap-1.5 shrink-0 shadow-sm"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Verificar</span>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTestHash('CEIC-UFPE-2025-BR-9942F');
                    setTimeout(() => {
                      setVerificationResult({
                        status: 'valid',
                        data: {
                          studentName: 'Registro Acadêmico Verificado (Demonstração)',
                          degree: 'Especialista em Defesa Cibernética e Resposta a Incidentes (Lato Sensu)',
                          institution: 'Centro de Excelência em Inteligência Cibernética / Parceria UFPE',
                          workload: '480 Horas (360h Teóricas + 120h Cyber Range)',
                          issueDate: '27 de Fevereiro de 2026',
                          mecRegistry: 'e-MEC nº 2024-CIGW-UFPE-0089',
                          sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
                        },
                      });
                    }, 100);
                  }}
                  className="text-[11px] text-[#508EBC] dark:text-[#80B7DF] hover:underline font-mono"
                >
                  Carregar registro de exemplo (CEIC-UFPE-2025-BR-9942F)
                </button>
              </form>

              {/* Verification Output */}
              {verificationResult.status === 'valid' && verificationResult.data && (
                <div className="p-4 rounded bg-[#F7F9FB] dark:bg-[#001726] border border-[#508EBC]/40 text-xs space-y-2 animate-fadeIn shadow-sm">
                  <div className="flex items-center gap-2 text-[#508EBC] dark:text-[#80B7DF] font-mono text-[11px] font-semibold pb-1 border-b border-[#D5D8DC] dark:border-[#0e304b]">
                    <CheckCircle className="w-4 h-4 text-[#508EBC] dark:text-[#80B7DF]" />
                    <span>REGISTRO VÁLIDO E AUTÊNTICO NO SISTEMA</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#26292D] dark:text-slate-300 pt-1">
                    <div>
                      <span className="text-[#26292D]/70 dark:text-slate-400 block text-[10px] font-mono">TITULAÇÃO:</span>
                      <strong className="text-[#021C2F] dark:text-white text-[11px]">{verificationResult.data.degree}</strong>
                    </div>
                    <div>
                      <span className="text-[#26292D]/70 dark:text-slate-400 block text-[10px] font-mono">CARGA HORÁRIA:</span>
                      <span className="text-[#508EBC] dark:text-[#80B7DF] font-mono text-[11px] font-semibold">{verificationResult.data.workload}</span>
                    </div>
                    <div>
                      <span className="text-[#26292D]/70 dark:text-slate-400 block text-[10px] font-mono">INSTITUIÇÃO RESPONSÁVEL:</span>
                      <span className="text-[#26292D] dark:text-slate-300 text-[11px]">{verificationResult.data.institution}</span>
                    </div>
                    <div>
                      <span className="text-[#26292D]/70 dark:text-slate-400 block text-[10px] font-mono">CADASTRO E-MEC:</span>
                      <span className="text-[#26292D] dark:text-slate-300 font-mono text-[11px]">{verificationResult.data.mecRegistry}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[#D5D8DC] dark:border-[#0e304b] font-mono text-[10px] text-[#26292D]/70 dark:text-slate-400 truncate">
                    HASH SHA-256: {verificationResult.data.sha256}
                  </div>
                </div>
              )}

              {verificationResult.status === 'invalid' && (
                <div className="p-4 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-300 font-mono">
                  Código de autenticação não localizado. Certifique-se de digitar o hash completo impresso no verso do certificado.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
