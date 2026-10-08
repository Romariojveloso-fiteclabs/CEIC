import React from 'react';
import { 
  Shield, 
  Minus, 
  Square, 
  X, 
  Maximize2, 
  Minimize2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface WindowHeaderProps {
  title?: string;
  badge?: string;
  icon?: React.ReactNode;
  onMinimize: () => void;
  onClose: () => void;
  isMaximized: boolean;
  onToggleMaximize: () => void;
  onStartDrag?: (e: React.PointerEvent<HTMLDivElement>) => void;
  isDragging?: boolean;
}

export const WindowHeader: React.FC<WindowHeaderProps> = ({
  title,
  badge,
  icon,
  onMinimize,
  onClose,
  isMaximized,
  onToggleMaximize,
  onStartDrag,
  isDragging = false,
}) => {
  const { t } = useLanguage();

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only primary button
    if (e.button !== 0 && e.button !== undefined) return;
    if (!isMaximized && onStartDrag) {
      onStartDrag(e);
    }
  };

  return (
    <div 
      onPointerDown={handlePointerDown}
      onDoubleClick={onToggleMaximize}
      className={`sticky top-0 z-50 h-9 bg-[#021C2F] text-slate-200 border-b border-[#000B13] flex items-center justify-between pl-3 pr-4 text-xs select-none shadow-md backdrop-blur-md transition-colors ${
        !isMaximized ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : ''
      }`}
      title={!isMaximized ? "Arraste para mover a janela · Clique duplo para maximizar" : "Clique duplo para restaurar janela"}
    >
      {/* Left: Software Window Icon & Title */}
      <div className="flex items-center gap-2.5 min-w-0 pointer-events-none">
        <div className="w-5 h-5 rounded bg-[#508EBC]/20 border border-[#508EBC]/40 flex items-center justify-center text-[#80B7DF] shrink-0">
          {icon || <Shield className="w-3.5 h-3.5" />}
        </div>
        <div className="flex items-center gap-2 truncate">
          <span className="font-semibold text-white tracking-tight truncate">
            {title || t.brand.windowTitle}
          </span>
          <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#000B13] text-[#80B7DF] border border-[#508EBC]/30">
            {badge || `${t.brand.institution} · Lato Sensu`}
          </span>
        </div>
      </div>

      {/* Right: Window Controls (Minimize, Maximize, Close) */}
      <div className="flex items-center gap-1 shrink-0" onPointerDown={(e) => e.stopPropagation()}>
        {/* Minimize Button [-] */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMinimize();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="w-7 h-6 flex items-center justify-center rounded hover:bg-[#508EBC]/20 text-slate-300 hover:text-white transition-colors"
          title={t.common.minimize}
          aria-label={t.common.minimize}
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        {/* Maximize / Restore Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleMaximize();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="w-7 h-6 flex items-center justify-center rounded hover:bg-[#508EBC]/20 text-slate-300 hover:text-white transition-colors"
          title={isMaximized ? t.common.restore : t.common.maximize}
          aria-label={isMaximized ? t.common.restore : t.common.maximize}
        >
          {isMaximized ? (
            <Minimize2 className="w-3 h-3" />
          ) : (
            <Square className="w-3 h-3" />
          )}
        </button>

        {/* Close Button [X] */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="w-7 h-6 flex items-center justify-center rounded hover:bg-rose-600 hover:text-white text-slate-300 transition-colors"
          title={t.common.close}
          aria-label={t.common.close}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
