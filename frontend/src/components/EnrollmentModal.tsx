import React, { useState } from 'react';
import { X, CheckCircle, ArrowRight, User, Mail, Phone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCms } from '../context/CmsContext';

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EnrollmentModal: React.FC<EnrollmentModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { addEnrollment } = useCms();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    graduationArea: '',
    experienceYears: '1-3',
    lattesLinkedin: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      // Save to CMS context automatically
      try {
        addEnrollment({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          graduationArea: formData.graduationArea || 'Não informado',
          experienceYears: formData.experienceYears,
          lattesLinkedin: formData.lattesLinkedin,
          notes: 'Inscrição submetida pelo formulário web.',
        });
      } catch {
        // Fallback
      }
      setLoading(false);
      setSubmitted(true);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="max-w-lg w-full rounded-xl bg-[#FFFFFF] dark:bg-[#021C2F] border border-[#D5D8DC] dark:border-[#0e304b] shadow-2xl p-6 sm:p-8 relative text-[#26292D] dark:text-slate-200 max-h-[90vh] overflow-y-auto transition-colors">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-[#021C2F] dark:hover:text-white p-1 rounded-md hover:bg-[#F3F3F3] dark:hover:bg-[#001726] transition-colors"
          aria-label={t.common.close}
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div className="space-y-5">
            <div>
              <span className="text-xs font-mono text-[#508EBC] dark:text-[#80B7DF] uppercase tracking-wider block mb-1 font-semibold">
                {t.brand.programType} · {t.admission.deadlineTitle}
              </span>
              <h3 className="font-display text-xl font-bold text-[#021C2F] dark:text-white">
                {t.modalEnroll.title}
              </h3>
              <p className="text-xs text-[#26292D]/70 dark:text-slate-400 mt-1">
                {t.modalEnroll.subtitle}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-[#26292D] dark:text-slate-300 mb-1">
                  {t.modalEnroll.nameLabel}:
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#508EBC] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Carlos Eduardo Silveira"
                    className="w-full pl-9 pr-3 py-2 bg-[#F7F9FB] dark:bg-[#000B13] border border-[#D5D8DC] dark:border-[#0e304b] rounded-md text-[#26292D] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#508EBC]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-[#26292D] dark:text-slate-300 mb-1">
                    {t.modalEnroll.emailLabel}:
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#508EBC] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="seu.email@empresa.com"
                      className="w-full pl-9 pr-3 py-2 bg-[#F7F9FB] dark:bg-[#000B13] border border-[#D5D8DC] dark:border-[#0e304b] rounded-md text-[#26292D] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#508EBC]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-[#26292D] dark:text-slate-300 mb-1">
                    {t.modalEnroll.phoneLabel}:
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#508EBC] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+55 (81) 99876-5432"
                      className="w-full pl-9 pr-3 py-2 bg-[#F7F9FB] dark:bg-[#000B13] border border-[#D5D8DC] dark:border-[#0e304b] rounded-md text-[#26292D] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#508EBC]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-[#26292D] dark:text-slate-300 mb-1">
                    {t.modalEnroll.backgroundLabel}:
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.graduationArea}
                    onChange={(e) => setFormData({ ...formData, graduationArea: e.target.value })}
                    placeholder="Ex: Computer Science, IT, Engineering"
                    className="w-full px-3 py-2 bg-[#F7F9FB] dark:bg-[#000B13] border border-[#D5D8DC] dark:border-[#0e304b] rounded-md text-[#26292D] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#508EBC]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#26292D] dark:text-slate-300 mb-1">
                    {t.modalEnroll.experienceLabel}:
                  </label>
                  <select
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F7F9FB] dark:bg-[#000B13] border border-[#D5D8DC] dark:border-[#0e304b] rounded-md text-[#26292D] dark:text-white focus:outline-none focus:border-[#508EBC]"
                  >
                    <option value="iniciante">Transition to Cybersecurity</option>
                    <option value="1-3">1 - 3 years</option>
                    <option value="3-5">3 - 5 years</option>
                    <option value="5+">5+ years (Senior / Lead)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold text-white bg-[#508EBC] hover:bg-[#417fae] rounded-md transition-all shadow-md shadow-[#508EBC]/20 focus:outline-none"
                >
                  {loading ? (
                    <span>...</span>
                  ) : (
                    <>
                      <span>{t.modalEnroll.submitBtn}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#508EBC]/15 border border-[#508EBC]/30 flex items-center justify-center text-[#508EBC] mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono text-[#508EBC] dark:text-[#80B7DF] uppercase tracking-wider block font-semibold">
                {t.modalEnroll.successTitle}
              </span>
              <h3 className="font-display text-xl font-bold text-[#021C2F] dark:text-white">
                {formData.name}
              </h3>
            </div>

            <p className="text-xs text-[#26292D]/80 dark:text-slate-300 leading-relaxed max-w-sm mx-auto">
              {t.modalEnroll.successDesc} <strong>{formData.email}</strong>.
            </p>

            <div className="p-3 bg-[#F3F3F3] dark:bg-[#001726] rounded border border-[#D5D8DC] dark:border-[#0e304b] text-[11px] font-mono text-[#26292D]/80 dark:text-slate-300">
              Protocol: <span className="text-[#508EBC] dark:text-[#80B7DF] font-semibold">CEIC-2026-SEL-{Math.floor(100000 + Math.random() * 900000)}</span>
            </div>

            <div className="pt-3">
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-[#508EBC] hover:bg-[#417fae] rounded-md transition-colors shadow-sm"
              >
                {t.common.close}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
