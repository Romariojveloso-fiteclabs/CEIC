import React, { useState, useEffect, useRef } from 'react';
import { initialProgramImages } from '../data/galleryData';
import { ProgramImage } from '../types/course';

interface TerminalCodeCarouselProps {
  onOpenEnrollment?: () => void;
  onExploreCurriculum?: () => void;
  className?: string;
}

type StepType = 'text' | 'image';
type PhaseType = 'typing' | 'output' | 'cleaning';

interface ScriptItem {
  type: StepType;
  cmd: string;
  lines: string[];
  image?: ProgramImage;
  stepLabel: string;
}

interface CompletedItem {
  type: StepType;
  cmd: string;
  lines: string[];
  image?: ProgramImage;
  time: string;
}

export const TerminalCodeCarousel: React.FC<TerminalCodeCarouselProps> = ({
  className = '',
}) => {
  // Alternating sequence: TEXT command -> IMAGE command -> TEXT command -> IMAGE command...
  // Enxuto, direto e fácil de ler
  const script: ScriptItem[] = [
    // 1. TEXT COMMAND
    {
      type: 'text',
      cmd: 'git clone https://github.com/cin-ufpe/pos-defesa-cibernetica.git',
      stepLabel: 'CLONE REPOSITÓRIO',
      lines: [
        '+ 480h acadêmicas · 10 módulos com encontros síncronos',
        '+ 120h práticas em Cyber Range dedicado',
        '[OK] Repositório oficial clonado · MEC Nota 5',
      ],
    },
    // 2. IMAGE COMMAND (Cyber Range & SOC)
    {
      type: 'image',
      cmd: 'python -m ceic.viewer --render=cyber-range-soc.raw',
      stepLabel: 'RENDER: CYBER RANGE',
      lines: [
        '+ Estações de SOC e SIEM (Splunk & Wazuh) ativas',
        '[OK] Buffer visual da infraestrutura carregado',
      ],
      image: initialProgramImages[0],
    },

    // 3. TEXT COMMAND
    {
      type: 'text',
      cmd: 'python -m ceic.audit --inspect=laboratorio-ia-malware',
      stepLabel: 'AUDITORIA DE IA & MALWARE',
      lines: [
        '+ Desmontagem de binários (Ghidra 11.2) e IA defensiva',
        '[STATUS: AMBIENTE 100% PREPARADO PARA A RESIDÊNCIA]',
      ],
    },
    // 4. IMAGE COMMAND (IA & Malware Lab)
    {
      type: 'image',
      cmd: 'view-media --station=ai-reverse-engineering.png',
      stepLabel: 'RENDER: LAB IA & MALWARE',
      lines: [
        '[OK] Estação de engenharia reversa renderizada no terminal',
      ],
      image: initialProgramImages[1],
    },

    // 5. TEXT COMMAND
    {
      type: 'text',
      cmd: 'ceic-cli wargame --status --simulation=red-vs-blue',
      stepLabel: 'STATUS WARGAMES',
      lines: [
        '+ Simulação tática Red Team vs. Blue Team em tempo real',
        '+ Exercícios live-fire baseados em incidentes do mundo corporativo',
        '[WARGAME ATIVO: PRÓXIMA SESSÃO PRÁTICA AGENDADA]',
      ],
    },
    // 6. IMAGE COMMAND (WarGame Blue vs Red)
    {
      type: 'image',
      cmd: 'view-media --stream=tactical-arena.raw',
      stepLabel: 'RENDER: ARENA TÁTICA',
      lines: [
        '[OK] Painel da arena tática montado no terminal',
      ],
      image: initialProgramImages[3],
    },

    // 7. TEXT COMMAND
    {
      type: 'text',
      cmd: 'cat ementa_aulas_sincronas.info',
      stepLabel: 'AULAS SÍNCRONAS',
      lines: [
        '+ Aulas online ao vivo quinzenais com especialistas CIn/UFPE',
        '+ Titulação oficial: Especialista em Defesa Cibernética',
        '[INFORMAÇÃO: PROCESSO SELETIVO ABERTO NO PORTAL]',
      ],
    },
    // 8. IMAGE COMMAND (Aulas Síncronas)
    {
      type: 'image',
      cmd: 'view-media --session=incident-war-room.jpg',
      stepLabel: 'RENDER: AULAS AO VIVO',
      lines: [
        '[OK] Transmissão da sessão síncrona exibida com sucesso',
      ],
      image: initialProgramImages[2],
    },

    // 9. TEXT COMMAND
    {
      type: 'text',
      cmd: 'python -m ceic.crypto.pqc --test-ml-kem --benchmark',
      stepLabel: 'TESTES PQC',
      lines: [
        '+ Algoritmos pós-quânticos (ML-KEM / ML-DSA) operando em TLS 1.3',
        '[CONCLUÍDO: SEGURANÇA PÓS-QUÂNTICA VALIDADA]',
      ],
    },
    // 10. IMAGE COMMAND (Criptografia Pós-Quântica)
    {
      type: 'image',
      cmd: 'view-media --asset=quantum-crypto-lab.png',
      stepLabel: 'RENDER: LAB CRIPTOGRAFIA',
      lines: [
        '[OK] Bancada de pesquisa criptográfica renderizada',
      ],
      image: initialProgramImages[5],
    },

    // 11. TEXT COMMAND
    {
      type: 'text',
      cmd: 'ceic-cli tcc --comite-avaliador --publicacoes',
      stepLabel: 'BANCAS E TCC',
      lines: [
        '+ Artigos técnicos aplicados a desafios contemporâneos da indústria',
        '[APROVAÇÃO: FORMAÇÃO DE ESPECIALISTAS DE ELITE]',
      ],
    },
    // 12. IMAGE COMMAND (Bancas de Pesquisa e TCC)
    {
      type: 'image',
      cmd: 'view-media --archive=bancas-defesa.jpg',
      stepLabel: 'RENDER: BANCAS DE DEFESA',
      lines: [
        '[OK] Registro documental das bancas de conclusão exibido',
      ],
      image: initialProgramImages[4],
    },
  ];

  const [stepIdx, setStepIdx] = useState(0);
  const [typedChars, setTypedChars] = useState(0);
  const [cleanTypedChars, setCleanTypedChars] = useState(0);
  const [phase, setPhase] = useState<PhaseType>('typing');
  const [history, setHistory] = useState<CompletedItem[]>([]);
  const [imageProgress, setImageProgress] = useState(0);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const terminalBodyRef = useRef<HTMLDivElement>(null);

  const currentItem = script[stepIdx] || script[0];

  // Auto-scroll inside terminal window whenever content changes
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [history, typedChars, cleanTypedChars, phase, imageProgress]);

  // Phase 1: Typing command
  useEffect(() => {
    if (phase !== 'typing') return;

    if (typedChars < currentItem.cmd.length) {
      const timeout = setTimeout(() => {
        setTypedChars((prev) => prev + 1);
      }, 20 + Math.random() * 16);
      return () => clearTimeout(timeout);
    } else {
      // Command typed, pause then show output
      const pauseTimeout = setTimeout(() => {
        setPhase('output');
        setImageProgress(0);
      }, 200);
      return () => clearTimeout(pauseTimeout);
    }
  }, [phase, typedChars, currentItem]);

  // Phase 2: Output display with extended reading time (4.5s for text, 5.2s for image)
  useEffect(() => {
    if (phase !== 'output') return;

    // Tempo calibrado para leitura confortável do usuário
    const duration = currentItem.type === 'text' ? 4500 : 5200;
    const intervalMs = 60;
    const increment = (intervalMs / duration) * 100;

    let progressTimer: ReturnType<typeof setInterval> | null = null;
    if (currentItem.type === 'image') {
      progressTimer = setInterval(() => {
        setImageProgress((prev) => {
          if (prev >= 100) {
            if (progressTimer) clearInterval(progressTimer);
            return 100;
          }
          return prev + increment;
        });
      }, intervalMs);
    }

    const nextStepTimer = setTimeout(() => {
      // Commit current item to history
      setHistory((prev) => [
        ...prev,
        {
          type: currentItem.type,
          cmd: currentItem.cmd,
          lines: currentItem.lines,
          image: currentItem.image,
          time: new Date().toLocaleTimeString('pt-BR', { hour12: false }),
        },
      ]);

      // If at end of script, transition to "clean" command before restarting!
      if (stepIdx === script.length - 1) {
        setCleanTypedChars(0);
        setPhase('cleaning');
      } else {
        setStepIdx((prev) => prev + 1);
        setTypedChars(0);
        setPhase('typing');
      }
    }, duration);

    return () => {
      if (progressTimer) clearInterval(progressTimer);
      clearTimeout(nextStepTimer);
    };
  }, [phase, currentItem, stepIdx, script.length]);

  // Phase 3: "clean" command typing and terminal reset
  useEffect(() => {
    if (phase !== 'cleaning') return;

    const cleanCommand = 'clean';
    if (cleanTypedChars < cleanCommand.length) {
      const timeout = setTimeout(() => {
        setCleanTypedChars((prev) => prev + 1);
      }, 65);
      return () => clearTimeout(timeout);
    } else {
      // "clean" is fully typed; pause so user reads it, then clear buffer
      const resetTimeout = setTimeout(() => {
        setHistory([]);
        setStepIdx(0);
        setTypedChars(0);
        setCleanTypedChars(0);
        setPhase('typing');
      }, 850);
      return () => clearTimeout(resetTimeout);
    }
  }, [phase, cleanTypedChars]);

  return (
    <div className={`w-full h-full rounded-xl bg-[#000d18] border border-[#508EBC]/30 shadow-2xl flex flex-col font-mono text-xs overflow-hidden transition-all ${className}`}>
      {/* 1. Authentic Clean Terminal Window Bar */}
      <div className="h-8 px-4 bg-[#011424] border-b border-[#000d18] flex items-center justify-between select-none shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block shadow-xs"></span>
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block shadow-xs"></span>
          <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block shadow-xs"></span>
        </div>

        {/* Clean step indicator tag */}
        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
          {phase === 'cleaning' ? (
            <>
              <span className="text-emerald-400 font-semibold">[LIMPEZA]</span>
              <span>[REINICIANDO]</span>
            </>
          ) : (
            <>
              <span className="text-[#80B7DF]">
                {currentItem.type === 'image' ? '[IMAGEM]' : '[TEXTO]'}
              </span>
              <span>[{stepIdx + 1}/{script.length}]</span>
            </>
          )}
        </div>
      </div>

      {/* 2. Main Terminal Content Area with real internal terminal scrolling */}
      <div 
        ref={terminalBodyRef}
        className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#000d18] text-slate-300 font-mono text-xs leading-relaxed select-text scrollbar-thin scrollbar-thumb-[#508EBC]/30 hover:scrollbar-thumb-[#508EBC]/50 scrollbar-track-transparent"
      >
        {/* Terminal Shell Header */}
        <div className="text-[11px] text-slate-500 pb-2 border-b border-[#011424] flex items-center justify-between">
          <span>UFPE CIn / CEIC — Shell Interativo v2.6.4</span>
          <span>TTY: /dev/pts/0</span>
        </div>

        {/* History of Completed Items (Both text and images) */}
        {history.map((item, idx) => (
          <div key={idx} className="space-y-2 border-b border-[#011424] pb-3.5">
            {/* Command Line */}
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-[#508EBC] font-bold">ceic@ufpe:~$</span>
              <span className="text-white font-medium break-all">{item.cmd}</span>
              <span className="text-[10px] text-slate-600 ml-auto shrink-0">{item.time}</span>
            </div>

            {/* Output Lines */}
            <div className="pl-3 border-l-2 border-[#508EBC]/30 space-y-0.5 text-slate-400 text-[11px]">
              {item.lines.map((line, lIdx) => (
                <p 
                  key={lIdx}
                  className={
                    line.startsWith('[OK]') || line.startsWith('[STATUS') || line.startsWith('[CONCLUÍDO') || line.startsWith('[APROVAÇÃO')
                      ? 'text-emerald-400 font-medium'
                      : line.startsWith('[WARGAME') || line.startsWith('[INFORMAÇÃO')
                      ? 'text-[#80B7DF] font-semibold'
                      : line.startsWith('remote') || line.startsWith('Cloning')
                      ? 'text-slate-400'
                      : 'text-slate-300'
                  }
                >
                  {line}
                </p>
              ))}
            </div>

            {/* Rendered Image in History (if item was an image command) */}
            {item.type === 'image' && item.image && (
              <div className="mt-2 rounded-lg border border-[#508EBC]/30 bg-[#011424] overflow-hidden">
                <div className="px-3 py-1 bg-[#021C2F] border-b border-[#011424] flex items-center justify-between text-[10px] text-slate-400">
                  <span className="text-[#80B7DF] font-semibold">
                    [{item.image.categoryLabel.toUpperCase()}]
                  </span>
                  <span className="text-slate-500">{item.image.date}</span>
                </div>
                <div className="relative aspect-video max-h-[180px] w-full overflow-hidden bg-black/50">
                  <img
                    src={item.image.imageUrl}
                    alt={item.image.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-2 bg-[#011424] text-[11px]">
                  <p className="text-white font-medium">{item.image.title}</p>
                  <p className="text-slate-400 text-[10px] mt-0.5 leading-snug">{item.image.caption}</p>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Currently Active Step (Typing or Outputting) */}
        {phase !== 'cleaning' && (
          <div className="space-y-2">
            {/* Active Command Line with Blinking Caret */}
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-[#508EBC] font-bold">ceic@ufpe:~$</span>
              <span className="text-white font-medium break-all">
                {currentItem.cmd.slice(0, typedChars)}
                {phase === 'typing' && (
                  <span className="inline-block w-2 h-3.5 ml-0.5 bg-[#80B7DF] animate-cursor-blink align-middle" />
                )}
              </span>
            </div>

            {/* Active Output (Text lines or Image card) */}
            {phase === 'output' && (
              <div className="space-y-2 animate-in fade-in duration-200">
                {/* Output Lines */}
                <div className="pl-3 border-l-2 border-[#508EBC]/40 space-y-0.5 text-slate-400 text-[11px]">
                  {currentItem.lines.map((line, lIdx) => (
                    <p 
                      key={lIdx}
                      className={
                        line.startsWith('[OK]') || line.startsWith('[STATUS') || line.startsWith('[CONCLUÍDO') || line.startsWith('[APROVAÇÃO')
                          ? 'text-emerald-400 font-medium'
                          : line.startsWith('[WARGAME') || line.startsWith('[INFORMAÇÃO')
                          ? 'text-[#80B7DF] font-semibold'
                          : line.startsWith('remote') || line.startsWith('Cloning')
                          ? 'text-slate-400'
                          : 'text-slate-300'
                      }
                    >
                      {line}
                    </p>
                  ))}
                </div>

                {/* Active Image Card (If current step is an image command) */}
                {currentItem.type === 'image' && currentItem.image && (
                  <div className="mt-2 rounded-lg border border-[#508EBC]/50 bg-[#011424] overflow-hidden shadow-lg animate-in fade-in zoom-in-95 duration-300">
                    {/* Image Top Bar */}
                    <div className="px-3 py-1.5 bg-[#021C2F] border-b border-[#011424] flex items-center justify-between text-[10px] select-none">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                        <span className="text-[#80B7DF] font-semibold">
                          [{currentItem.image.categoryLabel.toUpperCase()}]
                        </span>
                      </div>
                      <span className="text-slate-400 font-mono text-[10px]">
                        {currentItem.image.date}
                      </span>
                    </div>

                    {/* Image Display */}
                    <div className="relative aspect-video max-h-[195px] w-full overflow-hidden bg-black/60">
                      <img
                        src={currentItem.image.imageUrl}
                        alt={currentItem.image.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#011424] via-transparent to-transparent opacity-80" />
                    </div>

                    {/* Caption */}
                    <div className="p-2.5 bg-[#011424]">
                      <p className="text-white font-medium text-xs flex items-center gap-1.5">
                        <span className="text-[#80B7DF]">&gt;</span>
                        <span>{currentItem.image.title}</span>
                      </p>
                      <p className="text-slate-400 text-[10px] mt-1 leading-relaxed pl-3 border-l border-[#508EBC]/30">
                        {currentItem.image.caption}
                      </p>
                    </div>

                    {/* Visual Progress Bar */}
                    <div className="h-0.5 bg-[#000d18] w-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#508EBC] to-[#80B7DF] transition-all duration-75"
                        style={{ width: `${imageProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Phase 3: "clean" command typing before resetting terminal */}
        {phase === 'cleaning' && (
          <div className="space-y-1.5 animate-in fade-in duration-150">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-[#508EBC] font-bold">ceic@ufpe:~$</span>
              <span className="text-white font-medium">
                {'clean'.slice(0, cleanTypedChars)}
                <span className="inline-block w-2 h-3.5 ml-0.5 bg-[#80B7DF] animate-cursor-blink align-middle" />
              </span>
            </div>
            {cleanTypedChars >= 5 && (
              <div className="pl-3 border-l-2 border-[#508EBC]/40 text-emerald-400 text-[11px] animate-in fade-in duration-150">
                [Limpando buffer do terminal...]
              </div>
            )}
          </div>
        )}

        <div ref={terminalEndRef} />
      </div>
    </div>
  );
};
