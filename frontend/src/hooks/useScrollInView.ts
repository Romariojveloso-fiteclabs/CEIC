import { useState, useEffect, RefObject } from 'react';

interface UseScrollInViewOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useScrollInView(
  ref: RefObject<HTMLElement | null>,
  options: UseScrollInViewOptions = {}
): boolean {
  const { threshold = 0.05, rootMargin = '50px 0px 20px 0px', triggerOnce = true } = options;
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Helper to check if element is visible on screen
    const checkVisibility = () => {
      if (!ref.current) return false;
      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      // In view if any part of the element is within or close to the viewport
      const visible = rect.top < windowHeight + 40 && rect.bottom > -40;
      if (visible) {
        setIsInView(true);
        return true;
      }
      return false;
    };

    // Immediate check
    if (checkVisibility() && triggerOnce) {
      return;
    }

    // IntersectionObserver for native browser detection
    let observer: IntersectionObserver | null = null;
    try {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting || entry.intersectionRatio > 0) {
              setIsInView(true);
              if (triggerOnce && observer) {
                observer.disconnect();
              }
            } else if (!triggerOnce) {
              setIsInView(false);
            }
          }
        },
        { threshold, rootMargin }
      );
      observer.observe(element);
    } catch {
      // Fallback
    }

    // Using capture: true on window catches scrolls from ANY element (including inner overflow-y-auto divs)
    let rafId: number | null = null;
    const handleScrollOrResize = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (checkVisibility() && triggerOnce) {
          window.removeEventListener('scroll', handleScrollOrResize, true);
          window.removeEventListener('resize', handleScrollOrResize);
          if (observer) observer.disconnect();
        }
      });
    };

    window.addEventListener('scroll', handleScrollOrResize, { capture: true, passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (observer) observer.disconnect();
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [ref, threshold, rootMargin, triggerOnce]);

  return isInView;
}
