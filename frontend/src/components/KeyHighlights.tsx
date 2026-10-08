import React, { useRef } from 'react';
import { Award, ShieldAlert, Cpu, Terminal, Users, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ScrollTypewriterHeader, ScrollTypewriterText } from './ScrollTypewriter';
import { useScrollInView } from '../hooks/useScrollInView';

export const KeyHighlights: React.FC = () => {
  const { t } = useLanguage();
  const cardsRef = useRef<HTMLDivElement>(null);
  const areCardsInView = useScrollInView(cardsRef as React.RefObject<HTMLElement | null>, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
  });

  const highlights = [
    {
      metric: t.hero.statWorkloadValue,
      label: t.hero.statWorkloadLabel,
      detail: t.hero.workload,
      icon: Terminal,
    },
    {
      metric: t.hero.statModulesValue,
      label: t.hero.statModulesLabel,
      detail: t.curriculum.title,
      icon: Cpu,
    },
    {
      metric: t.hero.statMecValue,
      label: t.hero.statMecLabel,
      detail: t.certification.title,
      icon: Award,
    },
    {
      metric: '100% Ph.D. & MSc',
      label: t.faculty.kicker,
      detail: t.faculty.subtitle,
      icon: Users,
    },
  ];

  return (
    <section id="programa" className="py-16 md:py-20 bg-[#F3F3F3] dark:bg-[#001726] border-b border-[#D5D8DC] dark:border-[#0e304b] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section lead with scroll-triggered typewriter streaming and persistent cursor */}
        <ScrollTypewriterHeader
          kicker={t.highlights.kicker}
          title={t.highlights.title}
          subtitle={t.highlights.subtitle}
          className="max-w-3xl space-y-3 mb-12"
          titleClassName="font-display text-2xl sm:text-3xl font-bold text-[#021C2F] dark:text-white tracking-tight min-h-[36px] sm:min-h-[44px]"
          subtitleClassName="text-sm sm:text-base text-[#26292D] dark:text-slate-300 leading-relaxed min-h-[48px]"
        />

        {/* 4 Quantitative Rigor Highlights */}
        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className="p-6 rounded-lg bg-[#FFFFFF] dark:bg-[#021C2F] border border-[#D5D8DC] dark:border-[#0e304b] hover:border-[#508EBC]/50 transition-colors shadow-sm group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-md bg-[#508EBC]/15 border border-[#508EBC]/30 flex items-center justify-center text-[#508EBC] dark:text-[#80B7DF] group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-[#508EBC] dark:text-[#80B7DF]">0{idx + 1}</span>
                </div>
                <div className="font-display text-2xl font-bold text-[#021C2F] dark:text-white tracking-tight tabular-nums min-h-[32px]">
                  <ScrollTypewriterText 
                    text={item.metric} 
                    speed={35}
                    delay={100 + idx * 80}
                    enabled={areCardsInView}
                    showCursor={true}
                    persistentCursor={false}
                  />
                </div>
                <div className="text-sm font-semibold text-[#021C2F] dark:text-[#80B7DF] mt-1 mb-2 min-h-[20px]">
                  <ScrollTypewriterText 
                    text={item.label} 
                    speed={25}
                    delay={250 + idx * 80}
                    enabled={areCardsInView}
                    showCursor={true}
                    persistentCursor={false}
                  />
                </div>
                <div className="text-xs text-[#26292D]/80 dark:text-slate-300 leading-relaxed min-h-[32px]">
                  <ScrollTypewriterText 
                    text={item.detail} 
                    speed={18}
                    delay={400 + idx * 80}
                    enabled={areCardsInView}
                    showCursor={true}
                    persistentCursor={true}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Triple pillars */}
        <div className="mt-12 pt-10 border-t border-[#D5D8DC] dark:border-[#0e304b] grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
          <div className="space-y-2">
            <h3 className="font-semibold text-[#021C2F] dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#508EBC] shrink-0" />
              <ScrollTypewriterText 
                text={t.highlights.card1Title} 
                speed={25} 
                delay={200}
                showCursor={true}
                persistentCursor={false}
              />
            </h3>
            <p className="text-xs text-[#26292D]/80 dark:text-slate-300 leading-relaxed">
              <ScrollTypewriterText 
                text={t.highlights.card1Desc} 
                speed={16} 
                delay={350}
                showCursor={true}
                persistentCursor={true}
              />
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-[#021C2F] dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#508EBC] shrink-0" />
              <ScrollTypewriterText 
                text={t.highlights.card2Title} 
                speed={25} 
                delay={250}
                showCursor={true}
                persistentCursor={false}
              />
            </h3>
            <p className="text-xs text-[#26292D]/80 dark:text-slate-300 leading-relaxed">
              <ScrollTypewriterText 
                text={t.highlights.card2Desc} 
                speed={16} 
                delay={400}
                showCursor={true}
                persistentCursor={true}
              />
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-[#021C2F] dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#508EBC] shrink-0" />
              <ScrollTypewriterText 
                text={t.highlights.card3Title} 
                speed={25} 
                delay={300}
                showCursor={true}
                persistentCursor={false}
              />
            </h3>
            <p className="text-xs text-[#26292D]/80 dark:text-slate-300 leading-relaxed">
              <ScrollTypewriterText 
                text={t.highlights.card3Desc} 
                speed={16} 
                delay={450}
                showCursor={true}
                persistentCursor={true}
              />
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-[#021C2F] dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#508EBC] shrink-0" />
              <ScrollTypewriterText 
                text={t.highlights.card4Title} 
                speed={25} 
                delay={350}
                showCursor={true}
                persistentCursor={false}
              />
            </h3>
            <p className="text-xs text-[#26292D]/80 dark:text-slate-300 leading-relaxed">
              <ScrollTypewriterText 
                text={t.highlights.card4Desc} 
                speed={16} 
                delay={500}
                showCursor={true}
                persistentCursor={true}
              />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
