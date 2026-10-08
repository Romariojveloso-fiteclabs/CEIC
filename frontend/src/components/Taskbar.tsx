import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Moon, 
  Sun, 
  Wifi, 
  Clock, 
  Laptop, 
  FileText,
  ArrowRight
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { StartMenu } from './StartMenu';

interface TaskbarProps {
  isAppOpen: boolean;
  onToggleApp: () => void;
  isCmsOpen?: boolean;
  onToggleCms?: () => void;
  activeWindow?: 'portal' | 'cms' | null;
  onOpenCms?: () => void;
  onOpenEnrollment: () => void;
  onOpenBrochure: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({
  isAppOpen,
  onToggleApp,
  isCmsOpen = false,
  onToggleCms,
  activeWindow = null,
  onOpenCms,
  onOpenEnrollment,
  onOpenBrochure,
  onNavigateSection,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { t, language } = useLanguage();
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const locale = language === 'en' ? 'en-US' : language === 'es' ? 'es-ES' : 'pt-BR';
      setCurrentTime(
        now.toLocaleTimeString(locale, { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [language]);

  return (
    <>
      {/* Start Menu Popover */}
      <StartMenu
        isOpen={startMenuOpen}
        onClose={() => setStartMenuOpen(false)}
        isAppOpen={isAppOpen}
        onToggleApp={onToggleApp}
        isCmsOpen={isCmsOpen}
        onToggleCms={onToggleCms}
        onOpenCms={onOpenCms}
        onOpenEnrollment={onOpenEnrollment}
        onOpenBrochure={onOpenBrochure}
        onNavigateSection={onNavigateSection}
      />

      {/* Fixed OS Taskbar */}
      <footer className="fixed bottom-0 left-0 right-0 h-11 bg-[#021C2F] border-t border-[#000B13] z-40 select-none flex items-center justify-between px-2 sm:px-3 text-slate-200 transition-colors shadow-2xl">
        {/* Left Section: Start Button & Open Applications */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Start Menu Button */}
          <button
            onClick={() => setStartMenuOpen(!startMenuOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all focus:outline-none ${
              startMenuOpen
                ? 'bg-[#508EBC] text-white shadow-md'
                : 'bg-[#000B13]/60 hover:bg-[#508EBC]/20 text-[#80B7DF] border border-[#508EBC]/40'
            }`}
            title={t.common.start}
          >
            <Shield className="w-4 h-4 text-[#80B7DF] fill-[#508EBC]/20" />
            <span className="tracking-wide text-white">{t.common.start}</span>
          </button>

          {/* Separator */}
          <div className="w-[1px] h-5 bg-[#000B13] mx-1" />

          {/* CEIC Software Active Window Button in Taskbar */}
          <button
            onClick={onToggleApp}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all border ${
              isAppOpen && activeWindow === 'portal'
                ? 'bg-[#508EBC]/35 text-white border-[#508EBC] shadow-sm font-semibold'
                : isAppOpen
                ? 'bg-[#508EBC]/20 text-slate-200 border-[#508EBC]/40 font-medium'
                : 'bg-transparent hover:bg-[#508EBC]/15 text-slate-300 border-transparent'
            }`}
            title={isAppOpen ? t.desktop.minimizeNotification : t.common.openApp}
          >
            <Laptop className="w-3.5 h-3.5 text-[#80B7DF]" />
            <span className="truncate max-w-[130px] sm:max-w-[180px]">
              {t.brand.name} - Portal
            </span>
            <span 
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                isAppOpen ? 'bg-[#80B7DF] shadow-sm shadow-[#80B7DF]' : 'bg-slate-500'
              }`}
            />
          </button>

          {/* CEIC CMS Active Window Button in Taskbar */}
          <button
            onClick={onToggleCms}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all border ${
              isCmsOpen && activeWindow === 'cms'
                ? 'bg-purple-950/60 text-white border-purple-400 shadow-sm font-semibold ring-1 ring-purple-400/30'
                : isCmsOpen
                ? 'bg-purple-950/30 text-purple-200 border-purple-500/40 font-medium'
                : 'bg-transparent hover:bg-purple-950/20 text-slate-300 border-transparent'
            }`}
            title={isCmsOpen ? (activeWindow === 'cms' ? "Minimizar CMS" : "Trazer CMS para primeiro plano") : "Abrir Aplicação CMS"}
          >
            <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
              isCmsOpen ? 'bg-purple-600 text-white' : 'bg-slate-700/80 text-slate-300'
            }`}>
              <Shield className="w-2.5 h-2.5" />
            </div>
            <span className="truncate max-w-[130px] sm:max-w-[180px]">
              CEIC CMS <span className="text-[10px] text-purple-300 font-mono">(/admin)</span>
            </span>
            <span 
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                isCmsOpen ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-slate-500'
              }`}
            />
          </button>

          {/* Quick document shortcut (desktop style) */}
          <button
            onClick={onOpenBrochure}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-[#508EBC]/20 transition-colors"
            title={t.common.downloadBrochure}
          >
            <FileText className="w-3.5 h-3.5 text-[#80B7DF]" />
            <span className="text-[11px]">PPC.pdf</span>
          </button>
        </div>

        {/* Right Section: System Tray (Language, Network, Theme, Time, Show Desktop) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Quick Enrollment Button */}
          <button
            onClick={onOpenEnrollment}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#508EBC] hover:bg-[#417fae] text-white transition-colors shadow-sm"
          >
            <span>{t.common.enroll}</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          {/* Taskbar Language Switcher in System Tray */}
          <LanguageSelector variant="taskbar" />

          {/* Theme Switcher Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-md hover:bg-[#508EBC]/20 text-slate-300 hover:text-white transition-colors"
            title={theme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-300" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-slate-200" />
            )}
          </button>

          {/* Network Indicator */}
          <div 
            className="hidden xs:flex items-center gap-1 text-[11px] text-[#80B7DF]"
            title="Conexão de Rede: Conectado ao servidor UFPE (100% Estável)"
          >
            <Wifi className="w-3.5 h-3.5 text-[#80B7DF]" />
          </div>

          {/* System Clock */}
          <div className="flex items-center gap-1 font-mono text-xs text-slate-200 px-1 font-medium">
            <Clock className="w-3 h-3 text-[#80B7DF] hidden sm:inline" />
            <span>{currentTime || '12:00'}</span>
          </div>

          {/* Show Desktop Sliver Button (far right edge) */}
          <button
            onClick={onToggleApp}
            className="w-3 h-7 ml-1 border-l border-[#000B13] hover:bg-[#508EBC]/20 transition-colors rounded-r"
            title={isAppOpen ? t.desktop.minimizeNotification : t.common.restore}
          />
        </div>
      </footer>
    </>
  );
};
