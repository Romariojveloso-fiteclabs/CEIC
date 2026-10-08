import React from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  BookOpen, 
  Cpu,
  Server
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTypewriter } from '../hooks/useTypewriter';
import { TerminalCodeCarousel } from './TerminalCodeCarousel';

interface HeroProps {
  onOpenEnrollment: () => void;
  onExploreCurriculum: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenEnrollment, onExploreCurriculum }) => {
  const { t } = useLanguage();

  // Animated typewriter for the main headline - calibrated to natural keystroke speed
  const headlineText = t.hero.title;
  const { 
    displayText: typedHeadline, 
    isTyping: isHeadlineTyping, 
    isCompleted: isHeadlineCompleted 
  } = useTypewriter(headlineText, { speed: 32, startDelay: 100, natural: true });

  // Animated typewriter for the subtitle: begins naturally once headline finishes
  const subtitleText = t.hero.subtitle;
  const {
    displayText: typedSubtitle,
    isTyping: isSubtitleTyping,
    isCompleted: isSubtitleCompleted
  } = useTypewriter(subtitleText, { 
    speed: 18, 
    startDelay: 150, 
    natural: true,
    enabled: isHeadlineCompleted
  });

  return (
    <section className="relative pt-12 pb-16 md:pt-16 md:pb-24 overflow-hidden bg-[#F7F9FB] dark:bg-[#000B13] border-b border-[#D5D8DC] dark:border-[#0e304b] transition-colors">
      {/* Subtle architectural grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#021C2F 1px, transparent 1px), linear-gradient(90deg, #021C2F 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Main Hero Row: items-stretch guarantees terminal bottom aligns flush with action buttons */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-stretch">
          
          {/* Main Hero Editorial Prose (7 cols) - Ends at the action buttons to align bottom edge */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Clean unboxed institutional metadata kicker */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#508EBC] dark:text-[#80B7DF]">
                <span className="font-semibold">{t.brand.fullName}</span>
                <span className="text-[#D5D8DC] dark:text-[#0e304b]" aria-hidden="true">·</span>
                <span className="text-[#26292D] dark:text-slate-300">{t.brand.programType}</span>
                <span className="text-[#D5D8DC] dark:text-[#0e304b]" aria-hidden="true">·</span>
                <span className="text-[#508EBC] dark:text-[#80B7DF] font-medium">{t.brand.endorsement}</span>
              </div>

              {/* Display Headline with Ghost Sizer to lock shape and prevent layout shifts */}
              <div className="grid grid-cols-1 grid-rows-1">
                {/* Ghost Sizer: reserves exact final dimensions */}
                <h1 
                  className="col-start-1 row-start-1 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-transparent leading-[1.12] [text-wrap:balance] select-none pointer-events-none invisible"
                  aria-hidden="true"
                >
                  {headlineText}
                </h1>
                {/* Visible Animated Headline */}
                <h1 className="col-start-1 row-start-1 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#021C2F] dark:text-white leading-[1.12] [text-wrap:balance]">
                  {typedHeadline}
                  {!isHeadlineCompleted && (
                    <span 
                      className="inline-block w-2.5 sm:w-3 h-[0.85em] bg-[#508EBC] dark:bg-[#80B7DF] ml-1.5 animate-cursor-blink align-middle rounded-[1px]" 
                      aria-hidden="true" 
                    />
                  )}
                </h1>
              </div>

              {/* Editorial Lead Paragraph with Ghost Sizer to lock shape and allow smooth text flow */}
              <div className="grid grid-cols-1 grid-rows-1 max-w-2xl">
                {/* Ghost Sizer: reserves exact final dimensions */}
                <p 
                  className="col-start-1 row-start-1 text-base sm:text-lg text-transparent leading-relaxed font-normal select-none pointer-events-none invisible"
                  aria-hidden="true"
                >
                  {subtitleText}
                </p>
                {/* Visible Animated Subtitle */}
                <p className="col-start-1 row-start-1 text-base sm:text-lg text-[#26292D] dark:text-slate-300 leading-relaxed font-normal">
                  {typedSubtitle}
                  {(isHeadlineCompleted || isSubtitleTyping || isSubtitleCompleted) && (
                    <span 
                      className="inline-block w-[2.5px] sm:w-[3px] h-[1.15em] bg-[#508EBC] dark:bg-[#80B7DF] ml-1 animate-cursor-blink align-text-bottom rounded-[1px]" 
                      aria-hidden="true" 
                    />
                  )}
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              {/* Operational metadata strip (Unboxed) */}
              <div className="pt-2 border-t border-[#D5D8DC] dark:border-[#0e304b] flex flex-wrap items-center gap-y-3 gap-x-6 text-xs text-[#26292D]/80 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#508EBC]"></span>
                  <span className="font-medium">{t.hero.workload}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#80B7DF]"></span>
                  <span>{t.hero.modality}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#021C2F]/60 dark:bg-white/60"></span>
                  <span>{t.hero.degree}</span>
                </div>
              </div>

              {/* Action buttons (Exact bottom element of the left column) */}
              <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={onOpenEnrollment}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#508EBC] hover:bg-[#417fae] active:bg-[#346c96] rounded-md transition-all shadow-md shadow-[#508EBC]/20 hover:translate-y-[-1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#508EBC]"
                >
                  <span>{t.common.enrollNow}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onExploreCurriculum}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-medium text-[#021C2F] dark:text-white hover:text-[#000B13] dark:hover:text-[#80B7DF] bg-[#FFFFFF] dark:bg-[#021C2F] hover:bg-[#F3F3F3] dark:hover:bg-[#052136] border border-[#D5D8DC] dark:border-[#0e304b] rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#508EBC]"
                >
                  <BookOpen className="w-4 h-4 text-[#508EBC]" />
                  <span>{t.common.exploreCurriculum}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Focal Graphic / Interactive Animated Terminal (5 cols) - Locked to left column height so it scrolls internally */}
          <div className="lg:col-span-5 relative h-[460px] sm:h-[490px] lg:h-auto min-h-[420px] flex flex-col">
            <div className="lg:absolute lg:inset-0 w-full h-full">
              <TerminalCodeCarousel 
                onOpenEnrollment={onOpenEnrollment}
                onExploreCurriculum={onExploreCurriculum}
              />
            </div>
          </div>

        </div>

        {/* Trust and institutional accreditation indicators bar across bottom */}
        <div className="mt-8 pt-5 border-t border-[#D5D8DC]/70 dark:border-[#0e304b]/70 flex flex-wrap items-center justify-between gap-4 text-xs text-[#26292D]/90 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#508EBC] shrink-0" />
            <span className="font-medium">{t.certification.sealTitle}</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#80B7DF] shrink-0" />
            <span>{t.about.pillar2Title} (120h)</span>
          </div>
          <div className="flex items-center gap-2 text-[#508EBC] dark:text-[#80B7DF]">
            <Server className="w-4 h-4 shrink-0" />
            <span className="font-mono text-[11px]">Cyber Range Dedicado · CIn/UFPE</span>
          </div>
        </div>
      </div>
    </section>
  );
};
