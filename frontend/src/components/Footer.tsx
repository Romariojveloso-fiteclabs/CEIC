import React from 'react';
import { Shield, Mail, MapPin, Phone, ArrowUp } from 'lucide-react';
import { PageId } from './Header';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onNavigatePage: (pageId: PageId) => void;
  onOpenEnrollment: () => void;
  onOpenBrochure: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onNavigatePage, 
  onOpenEnrollment, 
  onOpenBrochure 
}) => {
  const { t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#000B13] border-t border-[#021C2F] text-slate-300 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Mission (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <button 
              onClick={() => onNavigatePage('home')} 
              className="flex items-center gap-3 text-left group"
            >
              <div className="w-9 h-9 rounded-lg bg-[#508EBC]/20 border border-[#508EBC]/40 flex items-center justify-center text-[#80B7DF] overflow-hidden group-hover:bg-[#508EBC]/30 transition-colors">
                <img 
                  src="https://ceic.tec.br/wp-content/uploads/2025/09/cropped-Design-sem-nome-12.png" 
                  alt="CEIC Logo" 
                  className="w-full h-full object-contain p-0.5"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <span className="font-display font-bold text-lg text-white group-hover:text-[#80B7DF] transition-colors">
                {t.brand.name} · {t.brand.institution}
              </span>
            </button>
            <p className="text-slate-300 text-xs leading-relaxed max-w-sm">
              Centro de Excelência em Inteligência Cibernética vinculado à Universidade Federal de Pernambuco (UFPE). Formação avançada, pesquisa em segurança ofensiva e defensiva, simulações em Cyber Range e inovação com registro de patentes.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-[#80B7DF]"></span>
              <span>Pós-Graduação Lato Sensu · Residência Tecnológica</span>
            </div>
          </div>

          {/* Program navigation */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-semibold text-white">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => onNavigatePage('home')} 
                  className="hover:text-[#80B7DF] transition-colors text-left"
                >
                  Início
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigatePage('curriculo')} 
                  className="hover:text-[#80B7DF] transition-colors text-left"
                >
                  Cursos & Matriz
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigatePage('noticias')} 
                  className="hover:text-[#80B7DF] transition-colors text-left"
                >
                  Mídia & Notícias
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigatePage('docentes')} 
                  className="hover:text-[#80B7DF] transition-colors text-left"
                >
                  Corpo Docente
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigatePage('cyber-range')} 
                  className="hover:text-[#80B7DF] transition-colors text-left"
                >
                  Cyber Range
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigatePage('galeria')} 
                  className="hover:text-[#80B7DF] transition-colors text-left"
                >
                  Galeria & Fotos
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigatePage('artigos')} 
                  className="hover:text-[#80B7DF] transition-colors text-left"
                >
                  Cadernos Técnicos
                </button>
              </li>
            </ul>
          </div>

          {/* Academic & Documents */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-semibold text-white">
              Acadêmico & Editais
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => onNavigatePage('admissao')} 
                  className="hover:text-[#80B7DF] transition-colors text-left"
                >
                  Inscrição & Seleção (8 Etapas)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigatePage('manual-docente')} 
                  className="hover:text-[#80B7DF] transition-colors text-left"
                >
                  Manual do Docente (SIGAA)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigatePage('faq')} 
                  className="hover:text-[#80B7DF] transition-colors text-left"
                >
                  Dúvidas Frequentes (FAQ)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigatePage('certificacao')} 
                  className="hover:text-[#80B7DF] transition-colors text-left"
                >
                  Certificação UFPE & MEC
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenBrochure} 
                  className="hover:text-[#80B7DF] transition-colors text-left"
                >
                  Baixar PPC Oficial (PDF)
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenEnrollment} 
                  className="hover:text-white transition-colors text-left text-[#80B7DF] font-semibold"
                >
                  Candidatar-se à Vaga
                </button>
              </li>
            </ul>
          </div>

          {/* Contact and Headquarters */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-semibold text-white">
              Sede e Polos
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#508EBC] shrink-0 mt-0.5" />
                <span>
                  <strong>Polo Presencial:</strong> Av. República do Líbano, 251, Torre A, Sala 1501, Pina, Recife/PE
                </span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#508EBC] shrink-0 mt-0.5" />
                <span>
                  <strong>Sede Acadêmica:</strong> Departamento de Eletrônica e Sistemas (DES/CTG/UFPE)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#508EBC] shrink-0" />
                <span>sidney.lima@ufpe.br</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#508EBC] shrink-0" />
                <span>WhatsApp: (81) 98321-7076</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#508EBC] shrink-0" />
                <span>Central STI: (81) 2126-7777</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Quiet copyright & back to top */}
        <div className="pt-10 mt-10 border-t border-[#021C2F] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div className="flex flex-wrap items-center gap-4">
            <span>© {new Date().getFullYear()} Centro de Excelência em Inteligência Cibernética (CEIC) · Universidade Federal de Pernambuco (UFPE).</span>
            <span aria-hidden="true">·</span>
            <span>Resolução CNE/CES nº 1/2018</span>
            <span aria-hidden="true">·</span>
            <span>Todos os direitos reservados</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => onNavigatePage('cms')}
              className="hover:text-[#80B7DF] text-slate-400 hover:underline transition-colors"
            >
              Área do Gestor (CMS)
            </button>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
          >
            <span>Voltar ao topo</span>
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>
      </div>
    </footer>
  );
};
