import React, { useState } from 'react';
import { 
  Shield, 
  Terminal, 
  Activity, 
  Crosshair, 
  Cpu, 
  FileCode, 
  AlertTriangle, 
  CheckCircle,
  Network
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const CyberRangeSection: React.FC = () => {
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);

  const simulationSteps = [
    {
      step: 'Fase 01',
      title: 'Emulação de Ameaça Adversária (Red Team)',
      actor: 'Red Team Automatizado (Caldera / Atomic Red Team)',
      description: 'Injeção de técnicas avançadas de evasão em rede corporativa virtualizada. O ataque executa técnicas de spear phishing, bypass de AMSI e despejo de credenciais LSASS.',
      consoleLog: '[EMULATOR] Injetando T1003.001 (OS Credential Dumping: LSASS Memory)\n[EMULATOR] Gerando tráfego de C2 beaconing através de HTTPS em porta 443...',
      status: 'Ataque em Andamento',
      statusColor: 'text-amber-400',
    },
    {
      step: 'Fase 02',
      title: 'Ingestão e Detecção em Tempo Real no SIEM',
      actor: 'Operação Blue Team / SOC N2',
      description: 'Sensores Wazuh e Zeek capturam anomalias de execução de processo e tráfego criptografado anômalo. Regra Sigma customizada dispara alerta crítico com score 90.',
      consoleLog: '[ALERT] SIGMA RULE MATCH: "Suspicious LSASS Process Access via OpenProcess"\n[SIEM] Host afetado: SRV-DC-01.corp (10.10.40.15). Disparando playbook de quarentena.',
      status: 'Alerta Correlacionado',
      statusColor: 'text-sky-400',
    },
    {
      step: 'Fase 03',
      title: 'Caça Proativa e Varredura de Movimentação Lateral',
      actor: 'Threat Hunter Blue Team',
      description: 'O pós-graduando formula hipóteses sobre persistência e varre conexões RPC/SMB para identificar se o adversário alcançou outras estações de trabalho.',
      consoleLog: '[HUNT] Querying Sysmon Event ID 3 (Network Connection) para destinos 10.10.0.0/16\n[HUNT] Identificada tentativa de execução remota via WMI no servidor de banco de dados.',
      status: 'Vetor Contido',
      statusColor: 'text-purple-400',
    },
    {
      step: 'Fase 04',
      title: 'Forense de Memória Volátil e Engenharia Reversa',
      actor: 'Analista Forense Digital',
      description: 'Aquisição de dump de memória RAM do servidor comprometido. Análise com Volatility 3 revela DLL injetada em memória por processo legítimo svchost.',
      consoleLog: '[VOLATILITY 3] windows.malfind executado: detectada secao PAGE_EXECUTE_READWRITE\n[YARA] Assinatura customizada gerada para identificação de strings criptografadas do payload.',
      status: 'Artefato Descompilado',
      statusColor: 'text-emerald-400',
    },
    {
      step: 'Fase 05',
      title: 'Erradicação, Restauração e Relatório de Lições Aprendidas',
      actor: 'Liderança de Resposta a Incidentes (IR Lead)',
      description: 'Revogação de credenciais comprometidas, aplicação de patches virtuais nos firewalls e confecção do laudo técnico pericial em conformidade com a ISO 27037.',
      consoleLog: '[INCIDENT REPORT] Cadeia de custódia certificada com SHA-256: 8f4e2b...d91a\n[STATUS] Sistema restaurado. Tempo de contenção: 18 minutos. Zero exfiltração de dados.',
      status: 'Incidente Neutralizado',
      statusColor: 'text-emerald-400',
    },
  ];

  return (
    <section id="cyber-range" className="py-16 md:py-24 bg-[#F7F9FB] dark:bg-[#000B13] border-b border-[#D5D8DC] dark:border-[#0e304b] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section lead */}
        <div className="max-w-3xl space-y-3 mb-12">
          <div className="text-xs font-mono uppercase tracking-wider text-[#508EBC] dark:text-[#80B7DF] font-semibold">
            {t.cyberRange.kicker}
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#021C2F] dark:text-white tracking-tight">
            {t.cyberRange.title}
          </h2>
          <p className="text-sm sm:text-base text-[#26292D] dark:text-slate-300 leading-relaxed">
            {t.cyberRange.subtitle}
          </p>
        </div>

        {/* Interactive Simulation Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Phase Selector (5 cols) */}
          <div className="lg:col-span-5 space-y-2">
            <span className="text-xs font-mono text-[#508EBC] dark:text-[#80B7DF] uppercase tracking-wider block mb-3 font-semibold">
              Fases da Simulação Tática (Clique para alternar)
            </span>
            {simulationSteps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`w-full text-left p-3.5 rounded-lg border transition-all flex items-start gap-3.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#508EBC] ${
                  activeStep === idx
                    ? 'bg-[#FFFFFF] dark:bg-[#021C2F] border-[#508EBC] shadow-md shadow-[#508EBC]/15'
                    : 'bg-[#FFFFFF]/80 dark:bg-[#021C2F]/60 border-[#D5D8DC] dark:border-[#0e304b] hover:border-[#508EBC]/40 text-[#26292D] dark:text-slate-200'
                }`}
              >
                <div className={`w-6 h-6 rounded flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 ${
                  activeStep === idx 
                    ? 'bg-[#508EBC] text-white' 
                    : 'bg-[#F3F3F3] dark:bg-[#001726] text-[#26292D] dark:text-slate-300 border border-[#D5D8DC] dark:border-[#0e304b]'
                }`}>
                  {idx + 1}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-mono text-[#508EBC] dark:text-[#80B7DF] mb-0.5">{step.step}</div>
                  <div className={`text-sm font-semibold truncate ${activeStep === idx ? 'text-[#021C2F] dark:text-white' : 'text-[#26292D] dark:text-slate-300'}`}>
                    {step.title}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Active Simulation Telemetry Viewport (7 cols) - Área de alto contraste #000B13 */}
          <div className="lg:col-span-7">
            <div className="rounded-lg bg-[#000B13] border border-[#021C2F] shadow-xl overflow-hidden">
              {/* Header */}
              <div className="px-4 py-3 bg-[#021C2F] border-b border-[#000B13] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#80B7DF]" />
                  <span className="font-mono text-white font-medium">
                    CYBER-RANGE // AMBIENTE TÁTICO ATIVO
                  </span>
                </div>
                <span className="font-mono text-xs font-semibold text-[#80B7DF] bg-[#508EBC]/20 px-2 py-0.5 rounded border border-[#508EBC]/40 inline-flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#80B7DF] mr-1.5 animate-pulse" />
                  {simulationSteps[activeStep].status}
                </span>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                <div>
                  <span className="text-[11px] font-mono text-[#80B7DF]/80 uppercase tracking-wider block">
                    Papel Operacional do Aluno:
                  </span>
                  <div className="text-sm font-semibold text-white mt-0.5">
                    {simulationSteps[activeStep].actor}
                  </div>
                </div>

                <div className="text-xs text-slate-200 leading-relaxed bg-[#021C2F]/50 p-3.5 rounded border border-[#508EBC]/25">
                  {simulationSteps[activeStep].description}
                </div>

                {/* Simulated Telemetry Log Terminal */}
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#80B7DF]/80 mb-1.5">
                    <span>Telemetria em Tempo Real (Console):</span>
                    <span className="text-slate-500">VT-100 / UTF-8</span>
                  </div>
                  <pre className="p-3.5 rounded bg-[#000B13] border border-[#021C2F] font-mono text-[11px] text-[#80B7DF] overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {simulationSteps[activeStep].consoleLog}
                  </pre>
                </div>

                {/* Range Architecture Specs */}
                <div className="pt-2 border-t border-[#021C2F] grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-300">
                  <div className="p-2 rounded bg-[#021C2F]/60 border border-[#508EBC]/20">
                    <span className="text-[#80B7DF] block text-[9px]">SEGMENTAÇÃO</span>
                    <span>4 VPCs Isoladas</span>
                  </div>
                  <div className="p-2 rounded bg-[#021C2F]/60 border border-[#508EBC]/20">
                    <span className="text-[#80B7DF] block text-[9px]">ENDPOINTS</span>
                    <span>Windows & Linux AD</span>
                  </div>
                  <div className="p-2 rounded bg-[#021C2F]/60 border border-[#508EBC]/20">
                    <span className="text-[#80B7DF] block text-[9px]">CONECTIVIDADE</span>
                    <span>VPN WireGuard 24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
