import React, { useState } from 'react';
import { X, Search, Image as ImageIcon, Upload, Check } from 'lucide-react';
import { useCms } from '../../context/CmsContext';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  title?: string;
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  title = 'Selecionar Mídia',
}) => {
  const { media, uploadMediaItem } = useCms();
  const [search, setSearch] = useState('');
  const [selectedUrl, setSelectedUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');

  if (!isOpen) return null;

  const filteredMedia = media.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.altText.toLowerCase().includes(search.toLowerCase())
  );

  const handleQuickUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;
    const item = uploadMediaItem({
      title: newTitle || 'Mídia enviada',
      url: newUrl,
      altText: newTitle || 'Mídia institucional',
      fileType: 'image/jpeg',
      fileSize: '350 KB',
    });
    setSelectedUrl(item.url);
    setIsUploading(false);
    setNewTitle('');
    setNewUrl('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="max-w-2xl w-full rounded-2xl bg-white dark:bg-[#021C2F] border border-slate-300 dark:border-[#508EBC]/40 shadow-2xl p-6 text-xs flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#0e304b] shrink-0">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#508EBC]" />
            <h3 className="font-display font-bold text-base text-[#021C2F] dark:text-white">
              {title}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Actions */}
        <div className="py-3 flex items-center gap-2 shrink-0">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar arquivos de mídia..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-[#000B13] border border-slate-200 dark:border-[#0e304b] text-xs text-[#021C2F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#508EBC]"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsUploading(!isUploading)}
            className="px-3 py-2 rounded-xl bg-[#508EBC]/15 text-[#508EBC] dark:text-[#80B7DF] border border-[#508EBC]/30 hover:bg-[#508EBC]/25 flex items-center gap-1.5 font-semibold transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Novo Link/Arquivo</span>
          </button>
        </div>

        {isUploading && (
          <form onSubmit={handleQuickUpload} className="p-3 mb-3 bg-slate-50 dark:bg-[#000B13] rounded-xl border border-slate-200 dark:border-[#0e304b] space-y-2 shrink-0">
            <p className="font-semibold text-slate-700 dark:text-slate-300">Inserir URL de Imagem</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Título do arquivo"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="p-2 rounded-lg bg-white dark:bg-[#021C2F] border border-slate-300 dark:border-[#0e304b] text-slate-900 dark:text-white text-xs"
              />
              <input
                type="url"
                required
                placeholder="URL da imagem (https://...)"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="p-2 rounded-lg bg-white dark:bg-[#021C2F] border border-slate-300 dark:border-[#0e304b] text-slate-900 dark:text-white text-xs font-mono"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsUploading(false)}
                className="px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-700 text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-[#508EBC] text-white font-bold text-xs"
              >
                Adicionar ao Acervo
              </button>
            </div>
          </form>
        )}

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-3 p-1">
          {filteredMedia.map((m) => {
            const isSelected = selectedUrl === m.url;
            return (
              <div
                key={m.id}
                onClick={() => setSelectedUrl(m.url)}
                className={`relative rounded-xl overflow-hidden border cursor-pointer group transition-all ${
                  isSelected
                    ? 'border-[#508EBC] ring-2 ring-[#508EBC]'
                    : 'border-slate-200 dark:border-[#0e304b] hover:border-[#508EBC]/60'
                }`}
              >
                <div className="aspect-video w-full bg-black/60 relative overflow-hidden">
                  <img src={m.url} alt={m.altText} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  {isSelected && (
                    <div className="absolute inset-0 bg-[#508EBC]/40 flex items-center justify-center">
                      <div className="w-7 h-7 rounded-full bg-white text-[#508EBC] flex items-center justify-center shadow-lg">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-2 bg-slate-50 dark:bg-[#000B13] truncate">
                  <p className="font-semibold text-slate-900 dark:text-slate-200 truncate">{m.title}</p>
                  <p className="text-[10px] text-slate-400 font-mono truncate">{m.fileSize}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 mt-3 border-t border-slate-200 dark:border-[#0e304b] flex items-center justify-between shrink-0">
          <span className="text-slate-400 text-[11px] font-mono truncate max-w-xs">
            {selectedUrl ? selectedUrl : 'Nenhum item selecionado'}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-[#000B13] text-slate-600 dark:text-slate-300 font-semibold text-xs"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={!selectedUrl}
              onClick={() => {
                onSelect(selectedUrl);
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-[#508EBC] hover:bg-[#417fae] disabled:opacity-50 text-white font-bold text-xs transition-colors"
            >
              Usar Esta Mídia
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
