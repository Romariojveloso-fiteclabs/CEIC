import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../i18n/translations';

interface LanguageSelectorProps {
  variant?: 'header' | 'taskbar' | 'compact' | 'startMenu';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  variant = 'header',
  className = '' 
}) => {
  const { language, setLanguage, languages, currentLanguageOption } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  // Compact / Inline Pills variant (e.g. inside Start Menu or Mobile Drawer)
  if (variant === 'compact' || variant === 'startMenu') {
    return (
      <div className={`flex items-center gap-1 bg-[#000B13]/60 dark:bg-[#000B13] p-1 rounded-lg border border-[#508EBC]/30 ${className}`}>
        {languages.map((item) => {
          const isSelected = item.code === language;
          return (
            <button
              key={item.code}
              onClick={() => handleSelect(item.code)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-all ${
                isSelected
                  ? 'bg-[#508EBC] text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-[#508EBC]/20'
              }`}
              title={item.label}
              aria-label={`Mudar idioma para ${item.label}`}
            >
              <span className="text-[11px] font-mono font-bold">{item.short}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Taskbar Tray variant (Tray indicator with upwards popover)
  if (variant === 'taskbar') {
    return (
      <div className={`relative ${className}`} ref={containerRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-mono transition-colors ${
            isOpen 
              ? 'bg-[#508EBC]/30 text-white' 
              : 'text-slate-300 hover:text-white hover:bg-[#508EBC]/20'
          }`}
          title={`Idioma atual: ${currentLanguageOption.label}`}
          aria-label="Trocar idioma"
          aria-expanded={isOpen}
        >
          <Globe className="w-3.5 h-3.5 text-[#80B7DF]" />
          <span className="text-[11px] font-semibold">{currentLanguageOption.short}</span>
        </button>

        {isOpen && (
          <div className="absolute bottom-full right-0 mb-2 w-44 bg-[#FFFFFF] dark:bg-[#021C2F] rounded-lg shadow-xl border border-[#D5D8DC] dark:border-[#0e304b] py-1 z-50 animate-in fade-in zoom-in-95 duration-100 text-xs">
            <div className="px-3 py-1.5 border-b border-[#D5D8DC] dark:border-[#0e304b] text-[10px] uppercase font-mono tracking-wider text-[#26292D]/70 dark:text-slate-400">
              Idioma / Language
            </div>
            {languages.map((item) => {
              const isSelected = item.code === language;
              return (
                <button
                  key={item.code}
                  onClick={() => handleSelect(item.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors ${
                    isSelected
                      ? 'bg-[#508EBC]/20 text-[#021C2F] dark:text-[#80B7DF] font-semibold'
                      : 'text-[#26292D] dark:text-slate-300 hover:bg-[#F3F3F3] dark:hover:bg-[#000B13]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-[#508EBC]/20 text-[10px] font-mono font-bold text-[#508EBC] dark:text-[#80B7DF]">{item.short}</span>
                    <span>{item.label}</span>
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#508EBC] dark:text-[#80B7DF]" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Header Dropdown variant
  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-[#000B13]/40 hover:bg-[#508EBC]/20 border border-[#508EBC]/40 rounded-md transition-colors focus:outline-none"
        title={`Idioma: ${currentLanguageOption.label}`}
        aria-label="Trocar idioma"
        aria-expanded={isOpen}
      >
        <Globe className="w-3.5 h-3.5 text-[#80B7DF] shrink-0" />
        <span className="text-xs font-mono font-semibold">{currentLanguageOption.short}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-44 bg-[#FFFFFF] dark:bg-[#021C2F] rounded-lg shadow-xl border border-[#D5D8DC] dark:border-[#0e304b] py-1 z-50 animate-in fade-in zoom-in-95 duration-100 text-xs">
          <div className="px-3 py-1.5 border-b border-[#D5D8DC] dark:border-[#0e304b] text-[10px] uppercase font-mono tracking-wider text-[#26292D]/70 dark:text-slate-400">
            Idioma / Language / Idioma
          </div>
          {languages.map((item) => {
            const isSelected = item.code === language;
            return (
              <button
                key={item.code}
                onClick={() => handleSelect(item.code)}
                className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors ${
                  isSelected
                    ? 'bg-[#508EBC]/20 text-[#021C2F] dark:text-[#80B7DF] font-semibold'
                    : 'text-[#26292D] dark:text-slate-300 hover:bg-[#F3F3F3] dark:hover:bg-[#000B13]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-[#508EBC]/20 text-[10px] font-mono font-bold text-[#508EBC] dark:text-[#80B7DF]">{item.short}</span>
                  <span>{item.label}</span>
                </span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#508EBC] dark:text-[#80B7DF]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
