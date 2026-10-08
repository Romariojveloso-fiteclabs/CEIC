import React, { useRef, useState, useCallback } from 'react';
import { useScrollInView } from '../hooks/useScrollInView';
import { useTypewriter, hasTypewriterAnimationRun } from '../hooks/useTypewriter';

interface ScrollTypewriterTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  className?: string;
  speed?: number; // ms per character
  delay?: number; // ms delay after in-view
  natural?: boolean;
  showCursor?: boolean;
  persistentCursor?: boolean;
  cursorClassName?: string;
  enabled?: boolean;
  onComplete?: () => void;
}

export const ScrollTypewriterText: React.FC<ScrollTypewriterTextProps> = ({
  text,
  as: Component = 'span',
  className = '',
  speed = 25,
  delay = 80,
  natural = true,
  showCursor = true,
  persistentCursor = true,
  cursorClassName = 'w-[2.5px] sm:w-[3px] h-[1.15em] bg-[#508EBC] dark:bg-[#80B7DF]',
  enabled = true,
  onComplete,
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useScrollInView(containerRef as React.RefObject<HTMLElement | null>);
  const alreadySaved = hasTypewriterAnimationRun();

  const shouldStart = (isInView && enabled) || alreadySaved;

  const { displayText, isTyping, isCompleted } = useTypewriter(text, {
    speed,
    startDelay: delay,
    natural,
    enabled: shouldStart,
    onComplete,
  });

  const shouldShowCursor =
    showCursor &&
    ((isTyping && !isCompleted) || (isCompleted && persistentCursor) || (shouldStart && !isCompleted));

  return (
    // @ts-expect-error dynamic component tag with ref
    <Component ref={containerRef} className={className}>
      <span>{displayText}</span>
      {shouldShowCursor && (
        <span
          className={`inline-block ml-1 animate-cursor-blink align-text-bottom rounded-[1px] ${cursorClassName}`}
          aria-hidden="true"
        />
      )}
    </Component>
  );
};

interface ScrollTypewriterHeaderProps {
  kicker?: string;
  kickerIcon?: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
  className?: string;
  titleAs?: 'h1' | 'h2' | 'h3';
  titleClassName?: string;
  subtitleClassName?: string;
  kickerClassName?: string;
  onHeaderComplete?: () => void;
}

export const ScrollTypewriterHeader: React.FC<ScrollTypewriterHeaderProps> = ({
  kicker,
  kickerIcon: KickerIcon,
  title,
  subtitle,
  className = 'max-w-3xl mb-12 space-y-3',
  titleAs: TitleComponent = 'h2',
  titleClassName = 'font-display text-2xl sm:text-3xl font-bold text-[#021C2F] dark:text-white tracking-tight',
  subtitleClassName = 'text-sm sm:text-base text-[#26292D] dark:text-slate-300 leading-relaxed',
  kickerClassName = 'text-xs font-mono uppercase tracking-wider text-[#508EBC] dark:text-[#80B7DF] font-semibold flex items-center gap-2',
  onHeaderComplete,
}) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useScrollInView(headerRef as React.RefObject<HTMLElement | null>);
  const alreadySaved = hasTypewriterAnimationRun();

  const [titleDone, setTitleDone] = useState(() => alreadySaved);
  const handleTitleComplete = useCallback(() => {
    setTitleDone(true);
  }, []);

  // Title typewriter
  const {
    displayText: typedTitle,
    isTyping: isTitleTyping,
    isCompleted: isTitleCompleted,
  } = useTypewriter(title, {
    speed: 26,
    startDelay: 100,
    natural: true,
    enabled: isInView || alreadySaved,
    onComplete: handleTitleComplete,
  });

  const subtitleEnabled = (isInView && (titleDone || isTitleCompleted)) || alreadySaved;

  // Subtitle typewriter: starts when title finishes
  const {
    displayText: typedSubtitle,
    isTyping: isSubtitleTyping,
    isCompleted: isSubtitleCompleted,
  } = useTypewriter(subtitle || '', {
    speed: 18,
    startDelay: 120,
    natural: true,
    enabled: subtitleEnabled,
    onComplete: onHeaderComplete,
  });

  const hasSubtitle = Boolean(subtitle && subtitle.trim().length > 0);

  return (
    <div ref={headerRef} className={className}>
      {kicker && (
        <div className={kickerClassName}>
          {KickerIcon && <KickerIcon className="w-3.5 h-3.5" />}
          <span>{kicker}</span>
        </div>
      )}

      {/* Title with typewriter & cursor */}
      <TitleComponent className={titleClassName}>
        <span>{typedTitle}</span>
        {isInView && (isTitleTyping || (!titleDone && !isTitleCompleted)) && (
          <span
            className="inline-block w-2.5 sm:w-3 h-[0.85em] bg-[#508EBC] dark:bg-[#80B7DF] ml-1.5 animate-cursor-blink align-middle rounded-[1px]"
            aria-hidden="true"
          />
        )}
        {!hasSubtitle && isTitleCompleted && (
          <span
            className="inline-block w-2.5 sm:w-3 h-[0.85em] bg-[#508EBC] dark:bg-[#80B7DF] ml-1.5 animate-cursor-blink align-middle rounded-[1px]"
            aria-hidden="true"
          />
        )}
      </TitleComponent>

      {/* Subtitle with typewriter and persistent blinking cursor */}
      {hasSubtitle && (
        <p className={subtitleClassName}>
          <span>{typedSubtitle}</span>
          {isInView && (isSubtitleTyping || isSubtitleCompleted || titleDone) && (
            <span
              className="inline-block w-[2.5px] sm:w-[3px] h-[1.15em] bg-[#508EBC] dark:bg-[#80B7DF] ml-1 animate-cursor-blink align-text-bottom rounded-[1px]"
              aria-hidden="true"
            />
          )}
        </p>
      )}
    </div>
  );
};
