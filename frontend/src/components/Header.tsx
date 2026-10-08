import React, { useState } from 'react';
import { 
  Shield, 
  Menu, 
  X, 
  ArrowUpRight, 
  FileText, 
  Sun, 
  Moon,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { LanguageSelector } from './LanguageSelector';

export type PageId = 
  | 'home' 
  | 'curriculo' 
  | 'noticias'
  | 'docentes' 
  | 'admissao' 
  | 'manual-docente'
  | 'faq'
  | 'cyber-range' 
  | 'galeria' 
  | 'artigos' 
  | 'certificacao' 
  | 'contato'
  | 'cms';

interface HeaderProps {
  activePage: PageId;
  onNavigatePage: (page: PageId) => void;
  onOpenCms?: () => void;
  onOpenEnrollment: () => void;
  onOpenBrochure: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  activePage, 
  onNavigatePage, 
  onOpenCms,
  onOpenEnrollment, 
  onOpenBrochure 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  // Primary navigation links visible in top bar on desktop
  const primaryNavLinks: { id: PageId; label: string }[] = [
    { id: 'home', label: t.nav.home },
    { id: 'curriculo', label: t.nav.curriculum },
    { id: 'noticias', label: t.nav.news || 'Mídia & Notícias' },
    { id: 'docentes', label: t.nav.faculty },
    { id: 'admissao', label: t.nav.admission },
    { id: 'manual-docente', label: t.nav.manualDocente || 'Manual do Docente' },
    { id: 'faq', label: t.nav.faq || 'FAQ' },
  ];

  // Secondary links under the "Mais" dropdown for clean uncluttered layout
  const secondaryNavLinks: { id: PageId; label: string }[] = [
    { id: 'cyber-range', label: t.nav.cyberRange },
    { id: 'galeria', label: t.nav.gallery },
    { id: 'artigos', label: t.nav.articles },
    { id: 'certificacao', label: t.nav.certification },
    { id: 'contato', label: t.nav.contact },
  ];

  const allNavLinks = [...primaryNavLinks, ...secondaryNavLinks];
  const isSecondaryActive = secondaryNavLinks.some((l) => l.id === activePage);

  return (
    <header className="relative z-30 bg-[#021C2F] border-b border-[#000B13] text-white transition-colors shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand identity & Logo */}
        <button 
          onClick={() => onNavigatePage('home')}
          className="flex items-center gap-2.5 sm:gap-3 group shrink-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#508EBC] rounded"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#508EBC]/20 border border-[#508EBC]/50 flex items-center justify-center overflow-hidden shrink-0 group-hover:border-[#508EBC]/80 transition-colors">
            <img 
              src="https://ceic.tec.br/wp-content/uploads/2025/09/cropped-Design-sem-nome-12.png" 
              alt="Logo CEIC" 
              className="w-full h-full object-contain p-0.5"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-[#80B7DF]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-base sm:text-lg tracking-tight text-white group-hover:text-[#80B7DF] transition-colors">
                {t.brand.name}
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.2 text-[9px] font-mono uppercase bg-[#508EBC]/20 text-[#80B7DF] border border-[#508EBC]/30 rounded">
                {t.brand.institution}
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-sans font-medium text-slate-300 -mt-0.5 sm:-mt-1 tracking-wide truncate max-w-[120px] sm:max-w-none">
              {t.brand.subtitle}
            </span>
          </div>
        </button>

        {/* Primary Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-1 text-xs font-medium text-slate-200">
          {primaryNavLinks.map((link) => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onNavigatePage(link.id)}
                className={`py-1.5 px-2.5 rounded-lg transition-colors whitespace-nowrap text-xs ${
                  isActive
                    ? 'bg-[#508EBC]/30 text-white font-bold border border-[#508EBC]/60 shadow-sm'
                    : 'hover:text-white hover:bg-[#508EBC]/15 text-slate-200'
                }`}
              >
                {link.label}
              </button>
            );
          })}

          {/* More Dropdown */}
          <div className="relative">
            <button
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              className={`py-1.5 px-2.5 rounded-lg transition-colors whitespace-nowrap text-xs flex items-center gap-1 ${
                isSecondaryActive
                  ? 'bg-[#508EBC]/30 text-white font-bold border border-[#508EBC]/60'
                  : 'hover:text-white hover:bg-[#508EBC]/15 text-slate-200'
              }`}
            >
              <span>Mais</span>
              <ChevronDown className="w-3 h-3 text-[#80B7DF]" />
            </button>

            {moreDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-[#021C2F] border border-[#508EBC]/40 rounded-lg shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setMoreDropdownOpen(false)}
              >
                {secondaryNavLinks.map((subLink) => {
                  const isActive = activePage === subLink.id;
                  return (
                    <button
                      key={subLink.id}
                      onClick={() => {
                        onNavigatePage(subLink.id);
                        setMoreDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between ${
                        isActive
                          ? 'bg-[#508EBC]/30 text-white font-bold'
                          : 'text-slate-200 hover:bg-[#508EBC]/15 hover:text-white'
                      }`}
                    >
                      <span>{subLink.label}</span>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#80B7DF]"></span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={onOpenBrochure}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 sm:py-2 text-xs font-medium text-slate-200 hover:text-white bg-[#021C2F] hover:bg-[#508EBC]/20 border border-[#508EBC]/40 rounded-md transition-colors whitespace-nowrap focus:outline-none"
            title={t.common.downloadBrochure}
          >
            <FileText className="w-3.5 h-3.5 text-[#80B7DF] shrink-0" />
            <span className="hidden xl:inline">{t.common.brochure}</span>
            <span className="xl:hidden">PPC</span>
          </button>
          
          <button
            onClick={onOpenEnrollment}
            className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 xl:px-4 py-1.5 sm:py-2 text-xs font-semibold text-white bg-[#508EBC] hover:bg-[#417fae] active:bg-[#346c96] rounded-md transition-all shadow-sm hover:shadow-[#508EBC]/30 whitespace-nowrap focus:outline-none"
          >
            <span>{t.common.enroll}</span>
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 sm:p-2 text-slate-200 hover:text-white bg-[#000B13]/50 border border-[#508EBC]/30 rounded-md focus:outline-none xl:hidden"
            aria-label={mobileMenuOpen ? t.common.close : t.nav.home}
            title={t.common.start}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-[#000B13] bg-[#021C2F] px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top duration-150 max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-2 border-b border-[#508EBC]/20">
            <span className="text-xs font-medium text-slate-300">
              Tema:
            </span>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-[#000B13]/60 border border-[#508EBC]/40 text-slate-200"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-slate-200" />}
              <span>{theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-[#508EBC]/20">
            <span className="text-xs font-medium text-slate-300">
              {t.common.systemLanguage}:
            </span>
            <LanguageSelector variant="compact" />
          </div>

          <div className="flex flex-col space-y-1">
            {allNavLinks.map((link) => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    onNavigatePage(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-between text-left ${
                    isActive
                      ? 'bg-[#508EBC]/30 text-white font-bold border border-[#508EBC]/50'
                      : 'text-slate-200 hover:bg-[#508EBC]/15'
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-[#80B7DF]" />
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#508EBC]/20 flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBrochure();
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium text-slate-200 bg-[#000B13]/40 border border-[#508EBC]/30 rounded-md hover:bg-[#508EBC]/20 transition-colors"
            >
              <FileText className="w-4 h-4 text-[#80B7DF]" />
              <span>{t.common.downloadBrochure}</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenEnrollment();
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#508EBC] hover:bg-[#417fae] rounded-md transition-colors shadow-sm"
            >
              <span>{t.common.enrollNow}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
