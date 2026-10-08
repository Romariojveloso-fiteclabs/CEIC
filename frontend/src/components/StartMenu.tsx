import React from 'react';
import { 
  Shield, 
  FileText, 
  Layers, 
  Users, 
  Award, 
  ArrowRight, 
  Moon, 
  Sun, 
  Power, 
  Terminal,
  FolderOpen,
  HelpCircle,
  ExternalLink,
  Laptop,
  Lock
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isAppOpen: boolean;
  onToggleApp: () => void;
  isCmsOpen?: boolean;
  onToggleCms?: () => void;
  onOpenCms?: () => void;
  onOpenEnrollment: () => void;
  onOpenBrochure: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({
  isOpen,
  onClose,
  isAppOpen,
  onToggleApp,
  isCmsOpen = false,
  onToggleCms,
  onOpenCms,
  onOpenEnrollment,
  onOpenBrochure,
  onNavigateSection,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop to close start menu on outside click */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose} 
      />

      {/* Start Menu Container */}
      <div 
        className="fixed bottom-12 left-2 z-50 w-80 sm:w-96 bg-[#021C2F] border border-[#000B13] rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-2 duration-150 select-none text-slate-200"
      >
        {/* User / Academic Profile Banner */}
        <div className="p-4 bg-[#000B13] border-b border-[#021C2F] flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#508EBC]/20 border border-[#508EBC]/40 flex items-center justify-center text-[#80B7DF] font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">
              {t.desktop.startMenuTitle}
            </p>
            <p className="text-[11px] text-[#80B7DF] truncate">
              {t.brand.programType} ({t.brand.institution})
            </p>
          </div>
          <span className="w-2 h-2 rounded-full bg-[#80B7DF] shadow-sm shadow-[#80B7DF]/50"></span>
        </div>

        {/* Pinned Programs / Softwares */}
        <div className="p-3 space-y-1">
          <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400">
            {t.desktop.quickLaunch}
          </div>

          {/* Main Portal App Toggle */}
          <button
            onClick={() => {
              onToggleApp();
              onClose();
            }}
            className={`w-full text-left p-2.5 rounded-lg flex items-center justify-between transition-colors ${
              isAppOpen
                ? 'bg-[#508EBC]/30 text-white border border-[#508EBC]/50'
                : 'hover:bg-[#508EBC]/15 text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-[#508EBC] text-white flex items-center justify-center shadow-sm">
                <Laptop className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">{t.desktop.mainApp}</p>
                <p className="text-[10px] text-slate-300">
                  {isAppOpen ? t.desktop.minimizeNotification : t.common.openApp}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#000B13] text-[#80B7DF] border border-[#508EBC]/30">
              {isAppOpen ? 'ON' : 'Run'}
            </span>
          </button>

          {/* Inscrição */}
          <button
            onClick={() => {
              onClose();
              onOpenEnrollment();
            }}
            className="w-full text-left p-2 rounded-lg hover:bg-[#508EBC]/15 flex items-center gap-2.5 transition-colors text-slate-200"
          >
            <div className="w-7 h-7 rounded bg-[#508EBC] text-white flex items-center justify-center">
              <ArrowRight className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white">{t.common.enrollNow}</p>
              <p className="text-[10px] text-slate-400 truncate">{t.desktop.enrollType}</p>
            </div>
          </button>

          {/* PPC Document */}
          <button
            onClick={() => {
              onClose();
              onOpenBrochure();
            }}
            className="w-full text-left p-2 rounded-lg hover:bg-[#508EBC]/15 flex items-center gap-2.5 transition-colors text-slate-200"
          >
            <div className="w-7 h-7 rounded bg-[#021C2F] border border-[#508EBC]/40 text-[#80B7DF] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white">{t.common.downloadBrochure}</p>
              <p className="text-[10px] text-slate-400 truncate">{t.desktop.ppcType}</p>
            </div>
          </button>

          {/* CMS Application Launcher */}
          <button
            onClick={() => {
              onClose();
              if (onOpenCms) {
                onOpenCms();
              } else if (onToggleCms) {
                onToggleCms();
              } else {
                onNavigateSection('cms');
              }
            }}
            className={`w-full text-left p-2.5 rounded-lg flex items-center justify-between transition-colors ${
              isCmsOpen
                ? 'bg-purple-950/40 text-white border border-purple-500/50'
                : 'hover:bg-[#508EBC]/15 text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-purple-700 text-white flex items-center justify-center shadow-xs">
                <Shield className="w-4 h-4 text-purple-200" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white">CEIC CMS — Painel Administrativo</p>
                <p className="text-[10px] text-purple-300 truncate font-mono">/admin · Better Auth</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#000B13] text-purple-300 border border-purple-500/30">
              {isCmsOpen ? '✓ Ativo' : 'Executar'}
            </span>
          </button>

          {/* Quick links to sections */}
          <div className="pt-2 border-t border-[#000B13]">
            <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400">
              {t.desktop.allPrograms}
            </div>

            <div className="grid grid-cols-2 gap-1 pt-1">
              <button
                onClick={() => {
                  onClose();
                  onNavigateSection('home');
                }}
                className="text-left px-2 py-1.5 rounded hover:bg-[#508EBC]/20 text-xs flex items-center gap-1.5 text-slate-200"
              >
                <Shield className="w-3.5 h-3.5 text-[#80B7DF]" />
                <span className="truncate">{t.nav.home}</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onNavigateSection('curriculo');
                }}
                className="text-left px-2 py-1.5 rounded hover:bg-[#508EBC]/20 text-xs flex items-center gap-1.5 text-slate-200"
              >
                <Layers className="w-3.5 h-3.5 text-[#80B7DF]" />
                <span className="truncate">{t.nav.curriculum}</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onNavigateSection('noticias');
                }}
                className="text-left px-2 py-1.5 rounded hover:bg-[#508EBC]/20 text-xs flex items-center gap-1.5 text-slate-200"
              >
                <FolderOpen className="w-3.5 h-3.5 text-[#80B7DF]" />
                <span className="truncate">Mídia & Notícias</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onNavigateSection('docentes');
                }}
                className="text-left px-2 py-1.5 rounded hover:bg-[#508EBC]/20 text-xs flex items-center gap-1.5 text-slate-200"
              >
                <Users className="w-3.5 h-3.5 text-[#80B7DF]" />
                <span className="truncate">{t.nav.faculty}</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onNavigateSection('admissao');
                }}
                className="text-left px-2 py-1.5 rounded hover:bg-[#508EBC]/20 text-xs flex items-center gap-1.5 text-slate-200"
              >
                <Award className="w-3.5 h-3.5 text-[#80B7DF]" />
                <span className="truncate">Inscrição & Seleção</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onNavigateSection('manual-docente');
                }}
                className="text-left px-2 py-1.5 rounded hover:bg-[#508EBC]/20 text-xs flex items-center gap-1.5 text-slate-200"
              >
                <FileText className="w-3.5 h-3.5 text-[#80B7DF]" />
                <span className="truncate">Manual do Docente</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onNavigateSection('faq');
                }}
                className="text-left px-2 py-1.5 rounded hover:bg-[#508EBC]/20 text-xs flex items-center gap-1.5 text-slate-200"
              >
                <HelpCircle className="w-3.5 h-3.5 text-[#80B7DF]" />
                <span className="truncate">Dúvidas Frequentes</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onNavigateSection('cyber-range');
                }}
                className="text-left px-2 py-1.5 rounded hover:bg-[#508EBC]/20 text-xs flex items-center gap-1.5 text-slate-200"
              >
                <Shield className="w-3.5 h-3.5 text-[#80B7DF]" />
                <span className="truncate">{t.nav.cyberRange}</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onNavigateSection('galeria');
                }}
                className="text-left px-2 py-1.5 rounded hover:bg-[#508EBC]/20 text-xs flex items-center gap-1.5 text-slate-200"
              >
                <FolderOpen className="w-3.5 h-3.5 text-[#80B7DF]" />
                <span className="truncate">{t.nav.gallery}</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onNavigateSection('artigos');
                }}
                className="text-left px-2 py-1.5 rounded hover:bg-[#508EBC]/20 text-xs flex items-center gap-1.5 text-slate-200"
              >
                <FileText className="w-3.5 h-3.5 text-[#80B7DF]" />
                <span className="truncate">{t.nav.articles}</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onNavigateSection('certificacao');
                }}
                className="text-left px-2 py-1.5 rounded hover:bg-[#508EBC]/20 text-xs flex items-center gap-1.5 text-slate-200"
              >
                <Award className="w-3.5 h-3.5 text-[#80B7DF]" />
                <span className="truncate">{t.nav.certification}</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onNavigateSection('contato');
                }}
                className="text-left px-2 py-1.5 rounded hover:bg-[#508EBC]/20 text-xs flex items-center gap-1.5 text-slate-200"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#80B7DF]" />
                <span className="truncate">{t.nav.contact}</span>
              </button>
            </div>
          </div>
        </div>

        {/* System Language Selector strip in Start Menu */}
        <div className="px-3 py-2 bg-[#000B13]/90 border-t border-[#021C2F] flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-300">
            {t.common.systemLanguage}:
          </span>
          <LanguageSelector variant="compact" />
        </div>

        {/* Bottom System Controls */}
        <div className="p-2.5 bg-[#000B13] border-t border-[#021C2F] flex items-center justify-between">
          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded hover:bg-[#508EBC]/20 text-slate-300 hover:text-white transition-colors"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-300" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-200" />
                <span>Dark</span>
              </>
            )}
          </button>

          {/* Close Software / Go to Desktop action */}
          <button
            onClick={() => {
              onClose();
              if (isAppOpen) {
                onToggleApp();
              }
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-rose-400 hover:bg-rose-500/20 rounded transition-colors"
            title={t.desktop.minimizeNotification}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{t.common.close}</span>
          </button>
        </div>
      </div>
    </>
  );
};
