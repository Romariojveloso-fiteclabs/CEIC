import React, { useState } from 'react';
import { 
  Shield, 
  Laptop, 
  FileText, 
  ArrowRight, 
  Trash2, 
  Layers, 
  BookOpen, 
  Maximize2,
  Users,
  MapPin,
  Lock,
  Tv,
  GraduationCap,
  HelpCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

interface DesktopProps {
  onOpenApp: () => void;
  onOpenCms?: () => void;
  onOpenEnrollment: () => void;
  onOpenBrochure: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Desktop: React.FC<DesktopProps> = ({
  onOpenApp,
  onOpenCms,
  onOpenEnrollment,
  onOpenBrochure,
  onNavigateSection,
}) => {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const { t } = useLanguage();

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const desktopIcons = [
    {
      id: 'ceic-app',
      name: t.desktop.mainApp,
      type: t.desktop.mainAppType,
      icon: Laptop,
      iconBg: 'bg-emerald-600 text-white shadow-emerald-600/30',
      action: onOpenApp,
      badge: 'App',
    },
    {
      id: 'ppc-doc',
      name: t.desktop.ppcDoc,
      type: t.desktop.ppcType,
      icon: FileText,
      iconBg: 'bg-amber-600 text-white shadow-amber-600/30',
      action: onOpenBrochure,
    },
    {
      id: 'inscricao-app',
      name: t.desktop.enrollApp,
      type: t.desktop.enrollType,
      icon: ArrowRight,
      iconBg: 'bg-blue-600 text-white shadow-blue-600/30',
      action: onOpenEnrollment,
      badge: '2026',
    },
    {
      id: 'curriculo-folder',
      name: t.desktop.curriculumFolder,
      type: t.desktop.curriculumType,
      icon: Layers,
      iconBg: 'bg-indigo-600 text-white shadow-indigo-600/30',
      action: () => {
        onNavigateSection('curriculo');
      },
    },
    {
      id: 'cyber-range-tool',
      name: t.desktop.cyberRangeTool,
      type: t.desktop.cyberRangeType,
      icon: Shield,
      iconBg: 'bg-rose-600 text-white shadow-rose-600/30',
      action: () => {
        onNavigateSection('cyber-range');
      },
    },
    {
      id: 'artigos-folder',
      name: t.desktop.articlesFolder,
      type: t.desktop.articlesType,
      icon: BookOpen,
      iconBg: 'bg-teal-600 text-white shadow-teal-600/30',
      action: () => {
        onNavigateSection('artigos');
      },
    },
    {
      id: 'docentes-shortcut',
      name: t.desktop.facultyShortcut,
      type: t.desktop.facultyType,
      icon: Users,
      iconBg: 'bg-blue-700 text-white shadow-blue-700/30',
      action: () => {
        onNavigateSection('docentes');
      },
    },
    {
      id: 'noticias-shortcut',
      name: 'Mídia & Notícias.tv',
      type: 'Presença na Imprensa',
      icon: Tv,
      iconBg: 'bg-purple-600 text-white shadow-purple-600/30',
      action: () => {
        onNavigateSection('noticias');
      },
    },
    {
      id: 'manual-shortcut',
      name: 'Manual do Docente.pdf',
      type: 'Guia Acadêmico SIGAA',
      icon: GraduationCap,
      iconBg: 'bg-amber-700 text-white shadow-amber-700/30',
      action: () => {
        onNavigateSection('manual-docente');
      },
    },
    {
      id: 'faq-shortcut',
      name: 'Dúvidas Frequentes.faq',
      type: 'Base de Esclarecimentos',
      icon: HelpCircle,
      iconBg: 'bg-cyan-600 text-white shadow-cyan-600/30',
      action: () => {
        onNavigateSection('faq');
      },
    },
    {
      id: 'mapa-shortcut',
      name: t.desktop.contactShortcut,
      type: t.desktop.contactType,
      icon: MapPin,
      iconBg: 'bg-sky-600 text-white shadow-sky-600/30',
      action: () => {
        onNavigateSection('contato');
      },
    },
    {
      id: 'cms-shortcut',
      name: 'Painel CMS',
      type: 'Gestão Administrativa (/admin)',
      icon: Shield,
      iconBg: 'bg-purple-700 text-white shadow-purple-700/30',
      action: () => {
        if (onOpenCms) onOpenCms();
        else onNavigateSection('cms');
      },
      badge: 'Admin',
    },
    {
      id: 'trash-bin',
      name: t.desktop.trash,
      type: t.desktop.trashType,
      icon: Trash2,
      iconBg: 'bg-slate-500 text-white shadow-slate-500/30',
      action: () => showToast(t.desktop.trashType),
    },
  ];

  return (
    <div 
      className="relative min-h-[calc(100vh-44px)] w-full overflow-hidden select-none bg-[#000B13] text-white p-4 sm:p-8 flex flex-col justify-between"
      style={{
        backgroundImage: `radial-gradient(ellipse at 50% 30%, rgba(80, 142, 188, 0.12) 0%, rgba(2, 28, 47, 0.95) 70%, #000B13 100%)`
      }}
      onClick={() => setSelectedIcon(null)}
    >
      {/* Subtle Background Watermark / Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      {/* Central Watermark Logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
        <Shield className="w-[480px] h-[480px] text-[#508EBC]" />
      </div>

      {/* Toast Notification */}
      {notification && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-[#021C2F] text-[#80B7DF] border border-[#508EBC]/50 px-4 py-2 rounded-lg text-xs font-mono shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-2">
          {notification}
        </div>
      )}

      {/* Top Desktop Area: Desktop Icons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 max-w-4xl z-10">
        {desktopIcons.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedIcon === item.id;

          return (
            <div
              key={item.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIcon(item.id);
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                item.action();
              }}
              className={`group flex flex-col items-center p-3 rounded-xl cursor-pointer text-center transition-all ${
                isSelected 
                  ? 'bg-[#508EBC]/25 ring-1 ring-[#508EBC] shadow-lg backdrop-blur-sm' 
                  : 'hover:bg-white/10'
              }`}
            >
              {/* Icon Container with App Badge */}
              <div className="relative mb-2">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 ${item.iconBg}`}>
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                {item.badge && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[#508EBC] text-white shadow-sm uppercase font-mono border border-white/20">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Title */}
              <span className="text-xs font-medium text-slate-200 tracking-tight leading-tight line-clamp-2 drop-shadow-md">
                {item.name}
              </span>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5 opacity-80">
                {item.type}
              </span>

              {/* Mobile Single-click button if on touch */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  item.action();
                }}
                className="mt-1.5 text-[10px] text-[#80B7DF] hover:underline font-mono md:hidden"
              >
                {t.common.openApp}
              </button>
            </div>
          );
        })}
      </div>

      {/* Center / Right: Desktop Information & Reopen Card */}
      <div className="z-10 mt-8 mb-6 self-center md:self-end max-w-md w-full bg-[#021C2F]/95 border border-[#508EBC]/40 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#508EBC]/20 border border-[#508EBC]/40 flex items-center justify-center text-[#80B7DF]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-sm sm:text-base text-white">
                {t.desktop.startMenuTitle}
              </h2>
              <p className="text-xs text-slate-300">
                {t.brand.programType} ({t.brand.institution})
              </p>
            </div>
          </div>
          <LanguageSelector variant="compact" />
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-5">
          {t.desktop.minimizeNotification} {t.desktop.openedNotification}
        </p>

        {/* Primary Action to Restore / Open Software */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={onOpenApp}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-[#508EBC] hover:bg-[#417fae] transition-all shadow-lg shadow-[#508EBC]/30 hover:scale-[1.02]"
          >
            <Maximize2 className="w-4 h-4" />
            <span>{t.common.openApp}</span>
          </button>

          <button
            onClick={onOpenBrochure}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 bg-[#000B13] hover:bg-[#000B13]/80 border border-[#508EBC]/40 transition-colors"
          >
            <FileText className="w-4 h-4 text-[#80B7DF]" />
            <span>{t.common.brochure}</span>
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-[#000B13] flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Turma 2025/2026</span>
          <span className="text-[#80B7DF] font-semibold">{t.admission.deadlineTitle}</span>
        </div>
      </div>
    </div>
  );
};
