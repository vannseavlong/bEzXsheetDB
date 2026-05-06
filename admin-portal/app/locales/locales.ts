import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import km from './km.json';
import en from './en.json';

export const localesInitializer = () => {
  i18next
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
      resources: {
        en: {
          translation: en
        },
        km: {
          translation: km
        }
      },
      lng: 'en',
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false
      }
    });
};

export const getLanguage = (lang: string) => {
  const language = lang.toLowerCase();
  if (language === 'en') return 'English';
  if (language === 'km') return 'Khmer';
  if (language === 'vn') return 'Vietnamese';
  if (language === 'zh') return 'Chinese (Traditional)';
  if (language === 'cn') return 'Chinese (Simplified)';
  return '-';
};
