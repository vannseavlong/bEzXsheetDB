import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import km from './km.json';
import en from './en.json';
import vi from './vi.json';
import tw from './tw.json';
import cn from './cn.json';
import kh from './kh.json';
import zh from './zh.json';

const getSavedLanguage = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('i18nextLng');
    if (saved === 'kh') return 'km'; // Map kh to km
    return saved || 'en';
  }
  return 'en';
};

export const localesInitializer = () => {
  if (i18next.isInitialized) {
    return;
  }

  i18next
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
      resources: {
        en: {
          translation: en
        },
        km: {
          translation: km
        },
        vi: {
          translation: vi
        },
        tw: {
          translation: tw
        },
        cn: {
          translation: cn
        },
        kh: {
          translation: kh
        },
        zh: {
          translation: zh
        }
      },
      lng: getSavedLanguage(),
      fallbackLng: 'en',
      initImmediate: false,
      interpolation: {
        escapeValue: false
      }
    });
};
