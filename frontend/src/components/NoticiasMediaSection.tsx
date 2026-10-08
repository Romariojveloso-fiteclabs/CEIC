import React, { useState } from 'react';
import { mediaData } from '../data/mediaData';
import { 
  Tv, 
  Radio, 
  Mic, 
  Newspaper, 
  ExternalLink, 
  Calendar, 
  User, 
  ShieldCheck,
  Search,
  Filter
} from 'lucide-react';

export const NoticiasMediaSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('todos');

  const filteredMedia = mediaData.filter((item) => {
    const matchesSearch = 
      item.facultyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mediaTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.details.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'tv') {
      return item.vehicle.toLowerCase().includes('globo') || item.vehicle.toLowerCase().includes('record');
    }
    if (selectedFilter === 'podcast') {
      return item.vehicle.toLowerCase().includes('podcast') || item.vehicle.toLowerCase().includes('cast');
    }
    if (selectedFilter === 'radio') {
      return item.vehicle.toLowerCase().includes('rádio') || item.vehicle.toLowerCase().includes('cbn') || item.vehicle.toLowerCase().includes('fm');
    }
    if (selectedFilter === 'imprensa') {
      return item.vehicle.toLowerCase().includes('diário') || item.vehicle.toLowerCase().includes('jornal') || item.vehicle.toLowerCase().includes('tribuna');
    }
    return true;
  });

  return (
    <section id="noticias-midia" className="py-12 md:py-20 bg-[#F7F9FB] dark:bg-[#000B13] border-b border-[#D5D8DC] dark:border-[#0e304b] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase bg-[#508EBC]/15 text-[#508EBC] dark:text-[#80B7DF] border border-[#508EBC]/30">
            <Tv className="w-3.5 h-3.5" />
            <span>Presença Institucional & Grande Mídia</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#021C2F] dark:text-white">
            Corpo Docente na Grande Mídia
          </h2>

          <p className="text-sm sm:text-base text-[#26292D] dark:text-slate-300 leading-relaxed">
            Reconhecimento que transcende a universidade. Nossos pesquisadores e professores são fontes técnicas frequentes nos principais telejornais da Rede Globo, emissoras de rádio e podcasts especializados em cibersegurança e perícia forense.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="mb-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-xl bg-[#FFFFFF] dark:bg-[#021C2F] border border-[#D5D8DC] dark:border-[#0e304b] shadow-xs">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'todos', label: 'Todos os Registros' },
              { id: 'tv', label: 'Televisão' },
              { id: 'radio', label: 'Rádio' },
              { id: 'podcast', label: 'Podcasts' },
              { id: 'imprensa', label: 'Jornais Impressos' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedFilter === f.id
                    ? 'bg-[#508EBC] text-white shadow-xs font-semibold'
                    : 'text-[#26292D] dark:text-slate-300 hover:bg-[#F3F3F3] dark:hover:bg-[#001726]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por professor, veículo..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-[#F7F9FB] dark:bg-[#000B13] border border-[#D5D8DC] dark:border-[#0e304b] text-[#26292D] dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#508EBC]"
            />
          </div>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col rounded-xl bg-[#FFFFFF] dark:bg-[#021C2F] border border-[#D5D8DC] dark:border-[#0e304b] overflow-hidden shadow-xs hover:shadow-md transition-all hover:-translate-y-1"
            >
              {/* Media Screenshot */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-900 border-b border-[#D5D8DC] dark:border-[#0e304b]">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.mediaTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400 font-mono text-xs">
                    Registro de Transmissão
                  </div>
                )}
                {/* Vehicle Badge */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#000B13]/80 backdrop-blur-xs text-[10px] font-mono text-[#80B7DF] border border-[#508EBC]/40">
                  {item.vehicle}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-[#508EBC]" />
                    <span>{item.date || 'Registro Oficial'}</span>
                  </div>

                  <h3 className="font-display text-base font-bold text-[#021C2F] dark:text-white group-hover:text-[#508EBC] dark:group-hover:text-[#80B7DF] transition-colors leading-snug">
                    {item.mediaTitle}
                  </h3>

                  <p className="text-xs text-[#26292D]/80 dark:text-slate-300 leading-relaxed">
                    {item.details}
                  </p>
                </div>

                {/* Faculty Author Footer */}
                <div className="pt-3 border-t border-[#D5D8DC] dark:border-[#0e304b] flex items-center gap-3">
                  {item.facultyPhotoUrl ? (
                    <img
                      src={item.facultyPhotoUrl}
                      alt={item.facultyName}
                      className="w-8 h-8 rounded-full object-cover border border-[#508EBC]/40"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#508EBC]/20 flex items-center justify-center text-[#508EBC]">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-[#021C2F] dark:text-white truncate">
                      {item.facultyName}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono truncate">
                      {item.facultyRole}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMedia.length === 0 && (
          <div className="p-12 text-center text-slate-400 font-mono text-sm bg-[#FFFFFF] dark:bg-[#021C2F] rounded-xl border border-[#D5D8DC] dark:border-[#0e304b]">
            Nenhum registro encontrado para os critérios de busca.
          </div>
        )}
      </div>
    </section>
  );
};
