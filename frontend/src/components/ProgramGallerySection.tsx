import React, { useState } from 'react';
import { initialProgramImages } from '../data/galleryData';
import { ProgramImage } from '../types/course';
import { 
  Plus, 
  Upload, 
  X, 
  Image as ImageIcon, 
  Calendar, 
  Maximize2, 
  Eye, 
  Check, 
  Layers 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ProgramGallerySection: React.FC = () => {
  const { t } = useLanguage();
  const [images, setImages] = useState<ProgramImage[]>(initialProgramImages);
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [activeLightboxImage, setActiveLightboxImage] = useState<ProgramImage | null>(null);
  
  // State for Add Image Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newImageTitle, setNewImageTitle] = useState('');
  const [newImageCategory, setNewImageCategory] = useState<'cyber-range' | 'laboratorios' | 'aulas' | 'pesquisa' | 'certificacao'>('cyber-range');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageCaption, setNewImageCaption] = useState('');
  const [newImageDate, setNewImageDate] = useState('2026');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const categories = [
    { id: 'todos', label: 'Todas as Imagens' },
    { id: 'cyber-range', label: 'Cyber Range & SOC' },
    { id: 'laboratorios', label: 'Laboratórios & IA' },
    { id: 'aulas', label: 'Aulas & Encontros' },
    { id: 'pesquisa', label: 'Pesquisa & Bancas' },
  ];

  const filteredImages = selectedCategory === 'todos'
    ? images
    : images.filter((img) => img.category === selectedCategory);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setNewImageUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = imagePreview || newImageUrl;
    if (!finalUrl || !newImageTitle) return;

    const categoryLabels: Record<string, string> = {
      'cyber-range': 'Cyber Range',
      'laboratorios': 'Laboratórios',
      'aulas': 'Aulas Ao Vivo',
      'pesquisa': 'Pesquisa & TCC',
      'certificacao': 'Certificação',
    };

    const newImg: ProgramImage = {
      id: `img-${Date.now()}`,
      title: newImageTitle,
      category: newImageCategory,
      categoryLabel: categoryLabels[newImageCategory] || 'Geral',
      imageUrl: finalUrl,
      caption: newImageCaption || newImageTitle,
      date: newImageDate || '2026',
    };

    setImages((prev) => [newImg, ...prev]);
    setIsAddModalOpen(false);

    // Reset form
    setNewImageTitle('');
    setNewImageUrl('');
    setImagePreview(null);
    setNewImageCaption('');
    setNewImageDate('2026');
  };

  return (
    <section id="galeria" className="py-16 md:py-24 bg-[#F7F9FB] dark:bg-[#000B13] border-b border-[#D5D8DC] dark:border-[#0e304b] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div className="max-w-3xl space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-[#508EBC] dark:text-[#80B7DF] font-semibold">
              {t.gallery.kicker}
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#021C2F] dark:text-white tracking-tight">
              {t.gallery.title}
            </h2>
            <p className="text-sm text-[#26292D] dark:text-slate-300 leading-relaxed">
              {t.gallery.subtitle}
            </p>
          </div>

          {/* Action button to add program image */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-[#508EBC] hover:bg-[#417fae] rounded-md transition-all shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Imagem do Programa</span>
          </button>
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors focus:outline-none ${
                selectedCategory === cat.id
                  ? 'bg-[#508EBC] text-white shadow-sm font-semibold'
                  : 'text-[#26292D] dark:text-slate-300 hover:text-[#021C2F] dark:hover:text-white hover:bg-[#F3F3F3] dark:hover:bg-[#021C2F]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className="group rounded-lg bg-[#FFFFFF] dark:bg-[#021C2F] border border-[#D5D8DC] dark:border-[#0e304b] hover:border-[#508EBC]/60 transition-all overflow-hidden flex flex-col justify-between shadow-sm"
            >
              {/* Image Frame with Aspect Ratio */}
              <div 
                className="relative aspect-video bg-[#000B13] overflow-hidden cursor-pointer"
                onClick={() => setActiveLightboxImage(image)}
              >
                <img
                  src={image.imageUrl}
                  alt={image.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#000B13]/80 via-transparent to-transparent pointer-events-none"></div>

                {/* Category & Date badge on image */}
                <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono">
                  <span className="bg-[#021C2F]/90 text-[#80B7DF] border border-[#508EBC]/40 px-2 py-0.5 rounded backdrop-blur-sm">
                    {image.categoryLabel}
                  </span>
                  <span className="bg-[#000B13]/90 text-slate-200 border border-[#021C2F] px-2 py-0.5 rounded backdrop-blur-sm">
                    {image.date}
                  </span>
                </div>

                {/* Hover zoom indicator */}
                <div className="absolute inset-0 bg-[#000B13]/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-3 py-1.5 rounded-md bg-[#021C2F]/95 text-white text-xs font-medium flex items-center gap-1.5 border border-[#508EBC]/40">
                    <Maximize2 className="w-3.5 h-3.5 text-[#80B7DF]" />
                    <span>Expandir Imagem</span>
                  </span>
                </div>
              </div>

              {/* Caption and Info */}
              <div className="p-4 space-y-1.5">
                <h3 className="font-display text-sm font-bold text-[#021C2F] dark:text-white group-hover:text-[#508EBC] transition-colors">
                  {image.title}
                </h3>
                <p className="text-xs text-[#26292D]/80 dark:text-slate-300 leading-relaxed line-clamp-2">
                  {image.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Adicionar Imagem do Programa */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="max-w-md w-full rounded-xl bg-[#FFFFFF] dark:bg-[#021C2F] border border-[#D5D8DC] dark:border-[#0e304b] shadow-2xl p-6 sm:p-7 relative text-[#26292D] dark:text-slate-200 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-[#021C2F] dark:hover:text-white p-1 rounded hover:bg-[#F3F3F3] dark:hover:bg-[#001726]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                <div>
                  <span className="text-xs font-mono text-[#508EBC] dark:text-[#80B7DF] uppercase tracking-wider block mb-1 font-semibold">
                    Galeria do Programa
                  </span>
                  <h3 className="font-display text-xl font-bold text-[#021C2F] dark:text-white">
                    Adicionar Imagem das Instalações
                  </h3>
                  <p className="text-xs text-[#26292D]/80 dark:text-slate-300">
                    Cadastre uma nova foto do Cyber Range, laboratórios ou eventos acadêmicos.
                  </p>
                </div>

                {/* Preview Box */}
                <div className="aspect-video rounded-lg bg-[#F7F9FB] dark:bg-[#000B13] border border-[#D5D8DC] dark:border-[#0e304b] overflow-hidden flex items-center justify-center relative">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Pré-visualização"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-slate-400 text-xs">
                      <ImageIcon className="w-8 h-8 text-slate-400" />
                      <span>Nenhuma imagem selecionada ainda</span>
                    </div>
                  )}
                </div>

                <form onSubmit={handleAddImage} className="space-y-3.5 text-xs">
                  {/* File Upload Option */}
                  <div>
                    <label className="block font-medium text-[#26292D] dark:text-slate-300 mb-1">
                      Enviar Arquivo do Computador:
                    </label>
                    <label className="flex items-center justify-center gap-2 w-full p-2.5 rounded-md border border-dashed border-[#D5D8DC] dark:border-[#0e304b] hover:border-[#508EBC] bg-[#F7F9FB] dark:bg-[#000B13] cursor-pointer transition-colors text-[#26292D] dark:text-slate-300">
                      <Upload className="w-4 h-4 text-[#508EBC]" />
                      <span>Selecionar Foto (PNG, JPG, WEBP)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Or URL input */}
                  <div>
                    <label className="block font-medium text-[#26292D] dark:text-slate-300 mb-1">
                      Ou Digite a URL da Imagem:
                    </label>
                    <input
                      type="url"
                      value={newImageUrl}
                      onChange={(e) => {
                        setNewImageUrl(e.target.value);
                        setImagePreview(e.target.value);
                      }}
                      placeholder="https://exemplo.com/foto-cyber-range.jpg"
                      className="w-full px-3 py-2 bg-[#F7F9FB] dark:bg-[#000B13] border border-[#D5D8DC] dark:border-[#0e304b] rounded-md text-[#26292D] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#508EBC]"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-[#26292D] dark:text-slate-300 mb-1">
                      Título da Imagem:
                    </label>
                    <input
                      type="text"
                      required
                      value={newImageTitle}
                      onChange={(e) => setNewImageTitle(e.target.value)}
                      placeholder="Ex: Laboratório de Detecção de Ransomware"
                      className="w-full px-3 py-2 bg-[#F7F9FB] dark:bg-[#000B13] border border-[#D5D8DC] dark:border-[#0e304b] rounded-md text-[#26292D] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#508EBC]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-[#26292D] dark:text-slate-300 mb-1">
                        Categoria:
                      </label>
                      <select
                        value={newImageCategory}
                        onChange={(e) => setNewImageCategory(e.target.value as any)}
                        className="w-full px-3 py-2 bg-[#F7F9FB] dark:bg-[#000B13] border border-[#D5D8DC] dark:border-[#0e304b] rounded-md text-[#26292D] dark:text-white focus:outline-none focus:border-[#508EBC]"
                      >
                        <option value="cyber-range">Cyber Range & SOC</option>
                        <option value="laboratorios">Laboratórios & IA</option>
                        <option value="aulas">Aulas Ao Vivo</option>
                        <option value="pesquisa">Pesquisa & TCC</option>
                        <option value="certificacao">Certificação</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium text-[#26292D] dark:text-slate-300 mb-1">
                        Data ou Turma:
                      </label>
                      <input
                        type="text"
                        value={newImageDate}
                        onChange={(e) => setNewImageDate(e.target.value)}
                        placeholder="Ex: Março 2026"
                        className="w-full px-3 py-2 bg-[#F7F9FB] dark:bg-[#000B13] border border-[#D5D8DC] dark:border-[#0e304b] rounded-md text-[#26292D] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#508EBC]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-[#26292D] dark:text-slate-300 mb-1">
                      Legenda / Descrição:
                    </label>
                    <textarea
                      rows={2}
                      value={newImageCaption}
                      onChange={(e) => setNewImageCaption(e.target.value)}
                      placeholder="Breve descrição da atividade ou ambiente registrado..."
                      className="w-full px-3 py-2 bg-[#F7F9FB] dark:bg-[#000B13] border border-[#D5D8DC] dark:border-[#0e304b] rounded-md text-[#26292D] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#508EBC]"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="px-4 py-2 text-xs font-medium text-[#26292D] dark:text-slate-300 hover:text-[#021C2F] dark:hover:text-white bg-[#F3F3F3] dark:bg-[#001726] hover:bg-[#FFFFFF] dark:hover:bg-[#021C2F] border border-[#D5D8DC] dark:border-[#0e304b] rounded-md transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-semibold text-white bg-[#508EBC] hover:bg-[#417fae] rounded-md transition-colors"
                    >
                      Adicionar à Galeria
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Fullscreen Lightbox View */}
        {activeLightboxImage && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
            onClick={() => setActiveLightboxImage(null)}
          >
            <div 
              className="max-w-4xl w-full rounded-xl bg-[#000B13] border border-[#021C2F] overflow-hidden shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveLightboxImage(null)}
                className="absolute top-4 right-4 z-10 text-slate-400 hover:text-white p-2 rounded-full bg-[#021C2F]/80 hover:bg-[#021C2F] border border-[#508EBC]/40 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-video bg-black flex items-center justify-center">
                <img
                  src={activeLightboxImage.imageUrl}
                  alt={activeLightboxImage.title}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-5 sm:p-6 bg-[#021C2F] border-t border-[#000B13] space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-[#80B7DF]">
                  <span>{activeLightboxImage.categoryLabel}</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-300">{activeLightboxImage.date}</span>
                </div>
                <h3 className="font-display text-lg font-bold text-white">
                  {activeLightboxImage.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeLightboxImage.caption}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
