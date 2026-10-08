import React, { useState, useMemo } from 'react';
import { marked } from 'marked';
import { articlesData } from '../content/articlesData';
import { 
  FileText, 
  Code2, 
  Copy, 
  Check, 
  BookOpen, 
  Search, 
  Clock, 
  User, 
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const MarkdownContentSection: React.FC = () => {
  const { t } = useLanguage();
  const [selectedSlug, setSelectedSlug] = useState<string>(articlesData[0].frontmatter.slug);
  const [viewMode, setViewMode] = useState<'rendered' | 'raw'>('rendered');
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');

  const categories = [
    { id: 'todos', label: 'Todos' },
    { id: 'ia-defensiva', label: 'IA Defensiva' },
    { id: 'threat-hunting', label: 'Threat Hunting' },
    { id: 'forense-digital', label: 'Forense Digital' },
    { id: 'criptografia', label: 'Criptografia' },
  ];

  const filteredArticles = useMemo(() => {
    return articlesData.filter((article) => {
      const matchesCategory = selectedCategory === 'todos' || article.frontmatter.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        article.frontmatter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.frontmatter.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.frontmatter.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const currentIndex = useMemo(() => {
    return articlesData.findIndex((a) => a.frontmatter.slug === selectedSlug);
  }, [selectedSlug]);

  const activeArticle = useMemo(() => {
    const found = articlesData[currentIndex];
    return found || articlesData[0];
  }, [currentIndex]);

  const handlePrevArticle = () => {
    const nextIdx = (currentIndex - 1 + articlesData.length) % articlesData.length;
    setSelectedSlug(articlesData[nextIdx].frontmatter.slug);
  };

  const handleNextArticle = () => {
    const nextIdx = (currentIndex + 1) % articlesData.length;
    setSelectedSlug(articlesData[nextIdx].frontmatter.slug);
  };

  const renderedHtml = useMemo(() => {
    if (!activeArticle) return '';
    try {
      return marked.parse(activeArticle.rawMarkdown) as string;
    } catch {
      return activeArticle.rawMarkdown;
    }
  }, [activeArticle]);

  const handleCopyMarkdown = () => {
    if (!activeArticle) return;
    navigator.clipboard.writeText(activeArticle.rawMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const proseSizeClasses = {
    sm: 'text-xs prose-sm leading-normal',
    base: 'text-sm prose-base leading-relaxed',
    lg: 'text-base prose-lg leading-loose',
  }[fontSize];

  return (
    <section id="artigos" className="py-14 sm:py-20 md:py-24 bg-[#F7F9FB] dark:bg-[#000B13] border-b border-[#D5D8DC] dark:border-[#0e304b] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 sm:mb-10">
          <div className="max-w-2xl space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#508EBC] dark:text-[#80B7DF] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.articles.kicker}</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#021C2F] dark:text-white tracking-tight">
              {t.articles.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#26292D] dark:text-slate-300 leading-relaxed">
              {t.articles.subtitle}
            </p>
          </div>

          {/* Quick Stats & Format Toggle */}
          <div className="flex items-center gap-2 self-start lg:self-auto shrink-0">
            <div className="flex items-center p-1 bg-[#F3F3F3] dark:bg-[#001726] rounded-lg border border-[#D5D8DC] dark:border-[#0e304b] transition-colors">
              <button
                onClick={() => setViewMode('rendered')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#508EBC] ${
                  viewMode === 'rendered'
                    ? 'bg-[#FFFFFF] dark:bg-[#021C2F] text-[#021C2F] dark:text-white shadow-sm font-semibold border border-[#D5D8DC] dark:border-[#0e304b]'
                    : 'text-[#26292D] dark:text-slate-300 hover:text-[#021C2F] dark:hover:text-white'
                }`}
                title="Modo Leitura Formatada"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#508EBC]" />
                <span className="hidden sm:inline">Modo</span> Leitura
              </button>
              <button
                onClick={() => setViewMode('raw')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#508EBC] ${
                  viewMode === 'raw'
                    ? 'bg-[#FFFFFF] dark:bg-[#021C2F] text-[#021C2F] dark:text-white shadow-sm font-semibold border border-[#D5D8DC] dark:border-[#0e304b]'
                    : 'text-[#26292D] dark:text-slate-300 hover:text-[#021C2F] dark:hover:text-white'
                }`}
                title="Modo Código Fonte Markdown"
              >
                <Code2 className="w-3.5 h-3.5 text-[#508EBC]" />
                <span className="hidden sm:inline">Código</span> .md
              </button>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8 pb-4 border-b border-[#D5D8DC] dark:border-[#0e304b]">
          {/* Categories */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#508EBC] ${
                  selectedCategory === cat.id
                    ? 'bg-[#508EBC] text-white font-semibold shadow-xs'
                    : 'bg-[#FFFFFF] dark:bg-[#021C2F] text-[#26292D] dark:text-slate-300 border border-[#D5D8DC] dark:border-[#0e304b] hover:text-[#021C2F] dark:hover:text-white hover:bg-[#F3F3F3] dark:hover:bg-[#001726]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative min-w-full md:min-w-[280px]">
            <Search className="w-3.5 h-3.5 text-[#508EBC] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.common.search}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FFFFFF] dark:bg-[#021C2F] border border-[#D5D8DC] dark:border-[#0e304b] rounded-md text-[#26292D] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#508EBC] focus:ring-1 focus:ring-[#508EBC]"
            />
          </div>
        </div>

        {/* 2-Column Responsive Reader */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Article Catalog (4 cols on lg, full width on mobile/tablet) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-[#26292D]/70 dark:text-slate-400 uppercase tracking-wider pb-1">
              <span>Artigos Disponíveis</span>
              <span className="text-[11px] font-semibold text-[#508EBC] dark:text-[#80B7DF]">
                {filteredArticles.length} {filteredArticles.length === 1 ? 'item' : 'itens'}
              </span>
            </div>

            {filteredArticles.length === 0 ? (
              <div className="p-6 text-center rounded-lg bg-[#FFFFFF] dark:bg-[#021C2F] border border-[#D5D8DC] dark:border-[#0e304b] text-xs text-[#26292D]/70 dark:text-slate-400">
                Nenhum artigo encontrado para o filtro selecionado.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[540px] overflow-y-auto pr-1">
                {filteredArticles.map((article) => {
                  const isSelected = activeArticle.frontmatter.slug === article.frontmatter.slug;
                  return (
                    <button
                      key={article.frontmatter.slug}
                      onClick={() => setSelectedSlug(article.frontmatter.slug)}
                      className={`w-full text-left p-3.5 sm:p-4 rounded-lg border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#508EBC] ${
                        isSelected
                          ? 'bg-[#FFFFFF] dark:bg-[#021C2F] border-[#508EBC] shadow-md shadow-[#508EBC]/15 ring-1 ring-[#508EBC]/30'
                          : 'bg-[#FFFFFF] dark:bg-[#021C2F] border-[#D5D8DC] dark:border-[#0e304b] hover:border-[#508EBC]/60 text-[#26292D] dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-[11px] text-[#26292D]/70 dark:text-slate-400 font-mono mb-1">
                        <span className="text-[#508EBC] dark:text-[#80B7DF] font-semibold">{article.frontmatter.categoryLabel}</span>
                        <span aria-hidden="true">·</span>
                        <span>{article.frontmatter.readTime}</span>
                      </div>

                      <h3 className={`font-display text-xs sm:text-sm font-bold leading-snug line-clamp-2 ${
                        isSelected ? 'text-[#021C2F] dark:text-white' : 'text-[#021C2F]/90 dark:text-slate-200'
                      }`}>
                        {article.frontmatter.title}
                      </h3>

                      <p className="text-xs text-[#26292D]/80 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                        {article.frontmatter.description}
                      </p>

                      <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#26292D]/70 dark:text-slate-400 pt-2 border-t border-[#D5D8DC] dark:border-[#0e304b]">
                        <span className="truncate max-w-[140px]">{article.frontmatter.author}</span>
                        <span className="font-mono text-[10px] shrink-0">
                          {article.frontmatter.pubDate}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Reader Canvas (8 cols on lg) */}
          <div className="lg:col-span-8">
            <div className="rounded-xl bg-[#FFFFFF] dark:bg-[#021C2F] border border-[#D5D8DC] dark:border-[#0e304b] shadow-lg overflow-hidden transition-colors">
              {/* Comprehensive Reader Header Toolbar */}
              <div className="px-3 sm:px-5 py-3 bg-[#F3F3F3] dark:bg-[#001726] border-b border-[#D5D8DC] dark:border-[#0e304b] flex flex-wrap items-center justify-between gap-3 text-xs transition-colors">
                {/* Left: Article navigation and title badge */}
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={handlePrevArticle}
                      className="p-1 text-[#021C2F] dark:text-white hover:text-[#000B13] bg-[#FFFFFF] dark:bg-[#021C2F] hover:bg-[#F3F3F3] dark:hover:bg-[#041d33] border border-[#D5D8DC] dark:border-[#0e304b] rounded transition-colors"
                      title="Artigo anterior"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] font-mono text-[#26292D]/70 dark:text-slate-400 px-1">
                      {currentIndex + 1}/{articlesData.length}
                    </span>
                    <button
                      onClick={handleNextArticle}
                      className="p-1 text-[#021C2F] dark:text-white hover:text-[#000B13] bg-[#FFFFFF] dark:bg-[#021C2F] hover:bg-[#F3F3F3] dark:hover:bg-[#041d33] border border-[#D5D8DC] dark:border-[#0e304b] rounded transition-colors"
                      title="Próximo artigo"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="hidden sm:inline-block font-display font-semibold text-[#021C2F] dark:text-white truncate max-w-[200px] xl:max-w-[280px]">
                    {activeArticle.frontmatter.title}
                  </span>
                </div>

                {/* Right: Reader controls (font sizing + copy action) */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Font Size controls (only in rendered mode) */}
                  {viewMode === 'rendered' && (
                    <div className="hidden sm:flex items-center gap-0.5 p-0.5 bg-[#FFFFFF] dark:bg-[#021C2F] rounded border border-[#D5D8DC] dark:border-[#0e304b]">
                      <button
                        onClick={() => setFontSize('sm')}
                        className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${fontSize === 'sm' ? 'bg-[#508EBC] text-white font-bold' : 'text-[#26292D] dark:text-slate-300'}`}
                        title="Fonte pequena"
                      >
                        A-
                      </button>
                      <button
                        onClick={() => setFontSize('base')}
                        className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${fontSize === 'base' ? 'bg-[#508EBC] text-white font-bold' : 'text-[#26292D] dark:text-slate-300'}`}
                        title="Fonte padrão"
                      >
                        A
                      </button>
                      <button
                        onClick={() => setFontSize('lg')}
                        className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${fontSize === 'lg' ? 'bg-[#508EBC] text-white font-bold' : 'text-[#26292D] dark:text-slate-300'}`}
                        title="Fonte grande"
                      >
                        A+
                      </button>
                    </div>
                  )}

                  {/* Copy Markdown / Source */}
                  <button
                    onClick={handleCopyMarkdown}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-[#021C2F] dark:text-white hover:text-[#000B13] bg-[#FFFFFF] dark:bg-[#021C2F] hover:bg-[#F3F3F3] dark:hover:bg-[#041d33] border border-[#D5D8DC] dark:border-[#0e304b] rounded transition-colors"
                    title="Copiar código fonte Markdown"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#508EBC] shrink-0" />
                        <span className="text-[#508EBC] text-[11px] font-semibold">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#508EBC] shrink-0" />
                        <span className="text-[11px]">Copiar .md</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Viewport: Either Rendered or Raw Markdown */}
              {viewMode === 'rendered' ? (
                <div className="p-4 sm:p-7 lg:p-8 space-y-6">
                  {/* Article Frontmatter Metadata Box */}
                  <div className="p-4 sm:p-5 rounded-lg bg-[#F7F9FB] dark:bg-[#000B13] border border-[#D5D8DC] dark:border-[#0e304b] text-xs text-[#26292D] dark:text-slate-300 space-y-2.5 transition-colors">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[#26292D]/70 dark:text-slate-400 font-mono text-[11px]">
                      <span className="text-[#508EBC] dark:text-[#80B7DF] font-semibold">{activeArticle.frontmatter.categoryLabel}</span>
                      <span>·</span>
                      <span>Publicado em {activeArticle.frontmatter.pubDate}</span>
                      <span>·</span>
                      <span>{activeArticle.frontmatter.readTime}</span>
                    </div>
                    <div className="text-sm font-semibold text-[#021C2F] dark:text-white">
                      {activeArticle.frontmatter.author}
                    </div>
                    <div className="text-xs text-[#26292D]/70 dark:text-slate-400">
                      {activeArticle.frontmatter.authorRole}
                    </div>
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {activeArticle.frontmatter.tags.map((t, idx) => (
                        <span key={idx} className="font-mono text-[10px] text-[#021C2F] dark:text-[#80B7DF] bg-[#FFFFFF] dark:bg-[#021C2F] px-2 py-0.5 rounded border border-[#D5D8DC] dark:border-[#0e304b]">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Rendered HTML Prose with clean adaptive typography */}
                  <div 
                    className={`prose dark:prose-invert prose-slate max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-[#021C2F] dark:prose-headings:text-white prose-p:text-[#26292D] dark:prose-p:text-slate-200 prose-pre:bg-[#000B13] prose-pre:text-slate-200 prose-pre:border prose-pre:border-[#021C2F] dark:prose-pre:border-[#0e304b] prose-code:text-[#508EBC] prose-code:font-mono overflow-x-auto ${proseSizeClasses}`}
                    dangerouslySetInnerHTML={{ __html: renderedHtml }}
                  />

                  {/* Footer navigation within article */}
                  <div className="pt-6 mt-8 border-t border-[#D5D8DC] dark:border-[#0e304b] flex items-center justify-between">
                    <button
                      onClick={handlePrevArticle}
                      className="flex items-center gap-1.5 text-xs font-medium text-[#26292D] dark:text-slate-300 hover:text-[#508EBC] dark:hover:text-[#80B7DF] transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Artigo anterior</span>
                    </button>
                    <button
                      onClick={handleNextArticle}
                      className="flex items-center gap-1.5 text-xs font-medium text-[#26292D] dark:text-slate-300 hover:text-[#508EBC] dark:hover:text-[#80B7DF] transition-colors"
                    >
                      <span>Próximo artigo</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Raw Markdown with Syntax View */
                <div className="p-4 sm:p-6 bg-[#000B13]">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                    <span>Estrutura Markdown com metadados Frontmatter YAML:</span>
                    <span>{activeArticle.rawMarkdown.length} bytes</span>
                  </div>
                  <pre className="font-mono text-xs text-slate-200 overflow-x-auto whitespace-pre leading-relaxed p-4 rounded bg-[#021C2F]/50 border border-[#021C2F]">
                    {activeArticle.rawMarkdown}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
