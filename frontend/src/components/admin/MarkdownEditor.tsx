import React, { useState } from 'react';
import { Bold, Italic, Heading2, List, Link as LinkIcon, Image as ImageIcon, Eye, Code } from 'lucide-react';
import { marked } from 'marked';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  onOpenMediaPicker?: () => void;
  rows?: number;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  onOpenMediaPicker,
  rows = 10,
}) => {
  const [isPreview, setIsPreview] = useState(false);

  const insertSyntax = (before: string, after = '') => {
    onChange(`${value}\n${before}${after}`);
  };

  return (
    <div className="rounded-xl border border-slate-300 dark:border-[#0e304b] overflow-hidden bg-white dark:bg-[#000B13] text-xs">
      {/* Toolbar */}
      <div className="p-2 bg-slate-50 dark:bg-[#011424] border-b border-slate-200 dark:border-[#0e304b] flex items-center justify-between flex-wrap gap-1">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => insertSyntax('**', '**')}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-[#0e304b] text-slate-600 dark:text-slate-300"
            title="Negrito"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertSyntax('*', '*')}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-[#0e304b] text-slate-600 dark:text-slate-300"
            title="Itálico"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertSyntax('## ')}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-[#0e304b] text-slate-600 dark:text-slate-300"
            title="Título"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertSyntax('- ')}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-[#0e304b] text-slate-600 dark:text-slate-300"
            title="Lista"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertSyntax('[Texto do link](https://exemplo.com)')}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-[#0e304b] text-slate-600 dark:text-slate-300"
            title="Inserir Link"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>
          {onOpenMediaPicker && (
            <button
              type="button"
              onClick={onOpenMediaPicker}
              className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-[#0e304b] text-[#508EBC] dark:text-[#80B7DF]"
              title="Inserir Mídia do Acervo"
            >
              <ImageIcon className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
            isPreview
              ? 'bg-[#508EBC] text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#0e304b]'
          }`}
        >
          {isPreview ? <Code className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{isPreview ? 'Editar Markdown' : 'Visualizar Preview'}</span>
        </button>
      </div>

      {/* Editor area / Preview */}
      {isPreview ? (
        <div
          className="p-4 prose prose-sm dark:prose-invert max-w-none min-h-[160px] overflow-y-auto bg-slate-50/50 dark:bg-[#000B13]/80 leading-relaxed text-xs"
          dangerouslySetInnerHTML={{ __html: marked.parse(value || '*Nenhum conteúdo digitado ainda.*') as string }}
        />
      ) : (
        <textarea
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Digite o conteúdo formatado em Markdown..."
          className="w-full p-3 bg-transparent text-slate-900 dark:text-slate-200 font-mono text-xs focus:outline-none resize-y"
        />
      )}
    </div>
  );
};
