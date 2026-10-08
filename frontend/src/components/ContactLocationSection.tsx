import React, { useState } from 'react';
import { 
  MapPin, 
  Compass, 
  Navigation, 
  Mail, 
  Phone, 
  Clock, 
  Send, 
  CheckCircle2, 
  ExternalLink, 
  Building, 
  Shield,
  MessageSquare
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ScrollTypewriterHeader } from './ScrollTypewriter';

export const ContactLocationSection: React.FC = () => {
  const { t } = useLanguage();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'duvidas-gerais',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setFormSubmitted(true);
  };

  return (
    <section id="contato-localizacao" className="py-16 md:py-24 bg-[#F7F9FB] dark:bg-[#000B13] border-b border-[#D5D8DC] dark:border-[#0e304b] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading with typewriter streaming and persistent cursor */}
        <ScrollTypewriterHeader
          kicker={t.contact.kicker}
          kickerIcon={Compass}
          title={t.contact.title}
          subtitle={t.contact.subtitle}
          className="max-w-3xl mb-12 space-y-3"
          titleClassName="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#021C2F] dark:text-white min-h-[38px] sm:min-h-[48px]"
          subtitleClassName="text-sm sm:text-base text-[#26292D] dark:text-slate-300 leading-relaxed min-h-[48px]"
        />

        {/* 2-Column Responsive Layout: Map & Location (Left) + Contact & Form (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Column 1: Map and Geographic Details (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Interactive Map Card */}
            <div className="rounded-2xl border border-[#D5D8DC] dark:border-[#0e304b] bg-[#FFFFFF] dark:bg-[#021C2F] overflow-hidden shadow-sm transition-colors">
              {/* Map Header Toolbar (Superfície secundária #F3F3F3) */}
              <div className="px-4 py-3 bg-[#F3F3F3] dark:bg-[#001726] border-b border-[#D5D8DC] dark:border-[#0e304b] flex items-center justify-between text-xs transition-colors">
                <div className="flex items-center gap-2 font-mono text-[#021C2F] dark:text-[#E6F1FA]">
                  <MapPin className="w-4 h-4 text-[#508EBC]" />
                  <span className="font-semibold text-[#021C2F] dark:text-[#E6F1FA]">Recife - PE, Brasil</span>
                  <span className="text-[#D5D8DC] dark:text-[#0e304b]">·</span>
                  <span className="text-[#26292D]/70 dark:text-slate-400 font-mono text-[11px]">8.0553° S, 34.9516° W</span>
                </div>
                <a
                  href="https://maps.google.com/?q=Centro+de+Informatica+UFPE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] font-medium text-[#508EBC] dark:text-[#80B7DF] hover:underline"
                >
                  <span>{t.contact.viewOnMap}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Embedded Map Viewport */}
              <div className="relative w-full h-[320px] sm:h-[380px] bg-slate-200 dark:bg-slate-800">
                <iframe
                  title="Localização do CEIC UFPE"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-34.9580%2C-8.0585%2C-34.9450%2C-8.0520&amp;layer=mapnik&amp;marker=-8.0553%2C-34.9516"
                  className="w-full h-full border-0"
                  loading="lazy"
                />
                
                {/* Floating Map Pin Overlay */}
                <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs p-3 rounded-xl bg-white/95 dark:bg-[#021C2F]/95 border border-[#D5D8DC] dark:border-[#0e304b] shadow-lg backdrop-blur-md text-xs">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#508EBC]/15 border border-[#508EBC]/30 flex items-center justify-center text-[#508EBC] shrink-0 mt-0.5">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-[#021C2F] dark:text-white">Centro de Informática (CIn - UFPE)</p>
                      <p className="text-[11px] text-[#26292D]/80 dark:text-slate-300 mt-0.5">
                        {t.brand.fullName} ({t.brand.name})
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address and Access Details */}
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-[#021C2F] dark:text-white">
                    <Building className="w-3.5 h-3.5 text-[#508EBC]" />
                    <span>{t.contact.addressTitle}</span>
                  </div>
                  <p className="text-[#26292D]/80 dark:text-slate-300 leading-relaxed text-[11px]">
                    {t.contact.addressLine1}<br />
                    {t.contact.addressLine2}<br />
                    {t.contact.addressLine3}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-[#021C2F] dark:text-white">
                    <Clock className="w-3.5 h-3.5 text-[#508EBC]" />
                    <span>{t.contact.hoursTitle}</span>
                  </div>
                  <p className="text-[#26292D]/80 dark:text-slate-300 leading-relaxed text-[11px]">
                    {t.contact.hoursValue}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Direct Contact Form & Channels (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Contact Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl border border-[#D5D8DC] dark:border-[#0e304b] bg-[#FFFFFF] dark:bg-[#021C2F] shadow-sm transition-colors">
                <div className="flex items-center gap-2 text-[#508EBC] mb-1">
                  <Mail className="w-4 h-4" />
                  <span className="font-semibold text-xs text-[#021C2F] dark:text-white">{t.contact.emailTitle}</span>
                </div>
                <a href={`mailto:${t.contact.emailValue}`} className="text-xs text-[#508EBC] dark:text-[#80B7DF] hover:underline font-mono">
                  {t.contact.emailValue}
                </a>
              </div>

              <div className="p-3.5 rounded-xl border border-[#D5D8DC] dark:border-[#0e304b] bg-[#FFFFFF] dark:bg-[#021C2F] shadow-sm transition-colors">
                <div className="flex items-center gap-2 text-[#508EBC] mb-1">
                  <Phone className="w-4 h-4" />
                  <span className="font-semibold text-xs text-[#021C2F] dark:text-white">{t.contact.phoneTitle}</span>
                </div>
                <a href="tel:+558121268430" className="text-xs text-[#26292D] dark:text-slate-300 hover:text-[#508EBC] dark:hover:text-[#80B7DF] font-mono">
                  {t.contact.phoneValue}
                </a>
              </div>
            </div>

            {/* Direct Message Form Card */}
            <div className="rounded-2xl border border-[#D5D8DC] dark:border-[#0e304b] bg-[#FFFFFF] dark:bg-[#021C2F] p-6 shadow-sm transition-colors">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-4 h-4 text-[#508EBC]" />
                <h3 className="font-display text-sm font-bold text-[#021C2F] dark:text-white">
                  {t.contact.formTitle}
                </h3>
              </div>

              {formSubmitted ? (
                <div className="py-8 text-center space-y-3 animate-in fade-in">
                  <div className="w-12 h-12 rounded-full bg-[#508EBC]/15 border border-[#508EBC]/30 text-[#508EBC] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-[#021C2F] dark:text-white">{t.contact.formSuccess}</h4>
                  <p className="text-xs text-[#26292D]/80 dark:text-slate-300 max-w-xs mx-auto leading-relaxed">
                    {formData.email}
                  </p>
                  <button
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({ name: '', email: '', phone: '', subject: 'duvidas-gerais', message: '' });
                    }}
                    className="text-xs font-semibold text-[#508EBC] dark:text-[#80B7DF] hover:underline pt-2"
                  >
                    OK
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-medium text-[#26292D] dark:text-slate-300 mb-1">
                      {t.contact.formName} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Dra. Juliana Menezes"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#D5D8DC] dark:border-[#0e304b] bg-[#F7F9FB] dark:bg-[#000B13] text-[#26292D] dark:text-white placeholder-[#26292D]/40 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#508EBC] focus:border-[#508EBC]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-[#26292D] dark:text-slate-300 mb-1">
                        {t.contact.formEmail} *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="seu.email@empresa.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#D5D8DC] dark:border-[#0e304b] bg-[#F7F9FB] dark:bg-[#000B13] text-[#26292D] dark:text-white placeholder-[#26292D]/40 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#508EBC] focus:border-[#508EBC]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-[#26292D] dark:text-slate-300 mb-1">
                        {t.contact.formPhone}
                      </label>
                      <input
                        type="tel"
                        placeholder="+55 (81) 98888-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#D5D8DC] dark:border-[#0e304b] bg-[#F7F9FB] dark:bg-[#000B13] text-[#26292D] dark:text-white placeholder-[#26292D]/40 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#508EBC] focus:border-[#508EBC]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#26292D] dark:text-slate-300 mb-1">
                      {t.contact.formSubject}
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#D5D8DC] dark:border-[#0e304b] bg-[#F7F9FB] dark:bg-[#000B13] text-[#26292D] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#508EBC] focus:border-[#508EBC]"
                    >
                      <option value="duvidas-gerais">Informações & Inscrição</option>
                      <option value="processo-seletivo">Processo Seletivo 2025/2026</option>
                      <option value="ementa-ppc">PPC / Ementas do Curso</option>
                      <option value="parcerias-corporativas">Parcerias Corporativas / Convênios</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#26292D] dark:text-slate-300 mb-1">
                      {t.contact.formMessage} *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#D5D8DC] dark:border-[#0e304b] bg-[#F7F9FB] dark:bg-[#000B13] text-[#26292D] dark:text-white placeholder-[#26292D]/40 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#508EBC] focus:border-[#508EBC] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-lg bg-[#508EBC] hover:bg-[#417fae] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <span>{t.contact.formSubmit}</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

