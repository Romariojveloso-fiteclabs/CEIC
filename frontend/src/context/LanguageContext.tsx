import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language, translations, languages, LanguageOption } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['pt'];
  languages: LanguageOption[];
  currentLanguageOption: LanguageOption;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('ceic_language') as Language | null;
      if (savedLang === 'pt' || savedLang === 'en' || savedLang === 'es') {
        return savedLang;
      }
      // Check browser language preferences
      const browserLang = navigator.language?.toLowerCase();
      if (browserLang.startsWith('en')) return 'en';
      if (browserLang.startsWith('es')) return 'es';
    }
    return 'pt'; // Default to Portuguese (UFPE home institution)
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ceic_language', language);
      document.documentElement.lang = language;
    }
  }, [language]);

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
  };

  const currentLanguageOption = languages.find((l) => l.code === language) || languages[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
        languages,
        currentLanguageOption,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
