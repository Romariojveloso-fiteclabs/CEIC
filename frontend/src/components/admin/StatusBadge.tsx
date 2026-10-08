import React from 'react';
import { ContentStatus } from '../../types/cms';

interface StatusBadgeProps {
  status: ContentStatus | 'open' | 'upcoming' | 'closed';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  switch (status) {
    case 'published':
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 ${className}`}>
          Publicado
        </span>
      );
    case 'draft':
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 ${className}`}>
          Rascunho
        </span>
      );
    case 'archived':
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-500/15 text-slate-700 dark:text-slate-400 border border-slate-500/30 ${className}`}>
          Arquivado
        </span>
      );
    case 'open':
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30 ${className}`}>
          Inscrições Abertas
        </span>
      );
    case 'upcoming':
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-purple-500/15 text-purple-700 dark:text-purple-400 border border-purple-500/30 ${className}`}>
          Em Breve
        </span>
      );
    case 'closed':
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30 ${className}`}>
          Encerrada
        </span>
      );
    default:
      return null;
  }
};
