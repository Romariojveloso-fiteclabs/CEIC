import { useState, useEffect, useRef, useCallback } from 'react';

export const CEIC_ANIMATION_KEY = 'ceic_typewriter_animated';

// Clear any previously persisted animation flags to ensure F5 re-runs animations
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem(CEIC_ANIMATION_KEY);
  } catch {
    // Ignore in restricted environments
  }
}

/**
 * Kept for backwards-compatibility; returns false so animations run on refresh.
 */
export function hasTypewriterAnimationRun(): boolean {
  return false;
}

export function setTypewriterAnimationRun(): void {
  // No-op: animations always run on reload as requested
}

export function resetTypewriterAnimation(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(CEIC_ANIMATION_KEY);
  } catch {
    // Ignore
  }
}

interface TypewriterOptions {
  speed?: number; // Base ms per character
  startDelay?: number; // ms before typing starts
  natural?: boolean; // Add subtle human typing variance & punctuation pauses
  onComplete?: () => void;
  loop?: boolean;
  enabled?: boolean; // Can be held until another animation finishes
  skipIfPreviouslyRun?: boolean;
}

export function useTypewriter(text: string, options: TypewriterOptions = {}) {
  const { 
    speed = 28, 
    startDelay = 100, 
    natural = true, 
    onComplete, 
    loop = false, 
    enabled = true,
  } = options;

  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [restartTick, setRestartTick] = useState(0);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // If empty text or disabled, reset state
    if (!enabled || !text) {
      setDisplayText('');
      setIsTyping(false);
      setIsCompleted(false);
      return;
    }

    let currentIndex = 0;
    let isCancelled = false;

    setDisplayText('');
    setIsCompleted(false);
    setIsTyping(false);

    const typeNext = () => {
      if (isCancelled) return;

      if (currentIndex < text.length) {
        currentIndex += 1;
        setDisplayText(text.slice(0, currentIndex));

        let delay = speed;
        if (natural) {
          const char = text[currentIndex - 1];
          const jitter = (Math.random() - 0.5) * (speed * 0.3);
          delay = Math.max(10, speed + jitter);
          if (char === ',' || char === ';' || char === ':') {
            delay += 80;
          } else if (char === '.' || char === '!' || char === '?') {
            delay += 140;
          }
        }

        timerRef.current = setTimeout(typeNext, delay);
      } else {
        setIsTyping(false);
        setIsCompleted(true);
        onCompleteRef.current?.();

        if (loop) {
          timerRef.current = setTimeout(() => {
            if (isCancelled) return;
            currentIndex = 0;
            setDisplayText('');
            setIsCompleted(false);
            setIsTyping(true);
            typeNext();
          }, 3000);
        }
      }
    };

    // Schedule typing start
    timerRef.current = setTimeout(() => {
      if (isCancelled) return;
      setIsTyping(true);
      typeNext();
    }, startDelay);

    return () => {
      isCancelled = true;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [text, enabled, speed, startDelay, natural, loop, restartTick]);

  const skipToEnd = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setDisplayText(text);
    setIsTyping(false);
    setIsCompleted(true);
    onCompleteRef.current?.();
  }, [text]);

  const restart = useCallback(() => {
    setRestartTick((prev) => prev + 1);
  }, []);

  return { displayText, isTyping, isCompleted, skipToEnd, restart };
}
