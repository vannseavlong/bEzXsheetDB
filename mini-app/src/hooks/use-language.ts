import { useEffect } from 'react';
import i18next from 'i18next';

const I18N_TO_API_LANG: Record<string, string> = {
  en: 'En',
  km: 'Km',
  kh: 'Km',
  vi: 'Vi',
  cn: 'Cn',
  tw: 'Tw',
  zh: 'Cn'
};

const normalizeLang = (lang: string): string => {
  if (lang === 'kh') return 'km';
  return lang;
};

const useLanguage = () => {
  const currentLang = normalizeLang(i18next.language);

  const changeLanguage = (lang: string) => {
    const normalized = normalizeLang(lang);
    i18next.changeLanguage(normalized);
    document.documentElement.lang = normalized;
  };

  useEffect(() => {
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  const apiLang = I18N_TO_API_LANG[currentLang] || 'En';

  return {
    changeLanguage,
    currentLang,
    apiLang
  };
};

export default useLanguage;
