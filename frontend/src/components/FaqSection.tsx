import React, { useState } from 'react';
import { localizedFaqData } from '../data/faqData';
import { 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  Search, 
  CheckCircle2, 
  ShieldCheck,
  Phone
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const FaqSection: React.FC = () => {
  const { language } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'todos', label: 'Todas as Dúvidas' },
    { id: 'sigaa', label: 'SIGAA & E-mail UFPE' },
    { id: 'certificacao', label: 'Certificação & MEC' },
    { id: 'metodologia', label: 'Metodologia & Residência' },
    { id: 'matricula', label: 'Matrícula & Diplomas' },
    { id: 'academico', label: 'Aulas & Formato' },
  ];

  const currentFaqs = localizedFaqData[language] || localizedFaqData.pt;

  const filteredFaqs = currentFaqs.filter((f) => {
    const matchesCategory = activeCategory === 'todos' || f.category === activeCategory;
    const matchesSearch = 
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq-section" className="py-12 md:py-20 bg-[#F7F9FB] dark:bg-[#000B13] border-b border-[#D5D8DC] dark:border-[#0e304b] transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase bg-[#508EBC]/15 text-[#508EBC] dark:text-[#80B7DF] border border-[#508EBC]/30">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Perguntas Frequentes & Esclarecimentos</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#021C2F] dark:text-white tracking-tight">
            Dúvidas Frequentes sobre o CEIC e a UFPE
          </h2>

          <p className="text-sm sm:text-base text-[#26292D] dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Respostas oficiais e transparentes sobre emissão de certificados, dinâmica das aulas síncronas, acesso aos portais SIGAA/Google Classroom e convalidação acadêmica.
          </p>
        </div>

        {/* Search & Categories Bar */}
        <div className="space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar por tema (ex: SIGAA, MEC, Presença, Diploma)..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[#FFFFFF] dark:bg-[#021C2F] border border-[#D5D8DC] dark:border-[#0e304b] text-[#021C2F] dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#508EBC] shadow-xs"
            />
          </div>

          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors focus:outline-none ${
                  activeCategory === c.id
                    ? 'bg-[#508EBC] text-white shadow-xs font-semibold'
                    : 'text-[#26292D] dark:text-slate-300 hover:text-[#021C2F] dark:hover:text-white bg-[#FFFFFF] dark:bg-[#021C2F] border border-[#D5D8DC] dark:border-[#0e304b]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-[#FFFFFF] dark:bg-[#021C2F] border border-[#D5D8DC] dark:border-[#0e304b] overflow-hidden transition-colors shadow-xs"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#508EBC]"
                >
                  <div className="space-y-1 pr-2">
                    <span className="font-display text-sm sm:text-base font-bold text-[#021C2F] dark:text-white leading-snug block">
                      {faq.question}
                    </span>
                    {faq.highlight && (
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#508EBC]/15 text-[#508EBC] dark:text-[#80B7DF]">
                        {faq.highlight}
                      </span>
                    )}
                  </div>
                  <div className="w-6 h-6 rounded-md bg-[#F3F3F3] dark:bg-[#000B13] border border-[#D5D8DC] dark:border-[#0e304b] flex items-center justify-center text-[#021C2F] dark:text-white shrink-0 mt-0.5">
                    {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-[#508EBC]" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#26292D] dark:text-slate-300 leading-relaxed border-t border-[#D5D8DC] dark:border-[#0e304b] pt-3.5">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}

          {filteredFaqs.length === 0 && (
            <div className="p-8 text-center text-slate-400 font-mono text-xs bg-[#FFFFFF] dark:bg-[#021C2F] rounded-xl border border-[#D5D8DC] dark:border-[#0e304b]">
              Nenhuma pergunta encontrada com o termo buscado.
            </div>
          )}
        </div>

        {/* Support contacts box */}
        <div className="p-5 rounded-2xl bg-[#508EBC]/10 border border-[#508EBC]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-bold text-[#021C2F] dark:text-white">
              Ainda possui alguma dúvida específica?
            </h4>
            <p className="text-slate-400">
              Nossa coordenação técnica atende pelo WhatsApp institucional em horário comercial.
            </p>
          </div>

          <a
            href="https://wa.me/5581983217076?text=Olá,%20gostaria%20de%20tirar%20uma%20dúvida%20sobre%20o%20CEIC."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold shadow-xs shrink-0 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Falar no WhatsApp (81) 98321-7076</span>
          </a>
        </div>
      </div>
    </section>
  );
};
