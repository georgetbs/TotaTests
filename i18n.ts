import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en/common.json';
import ru from './locales/ru/common.json';
import ka from './locales/ka/common.json';

// Custom language detector
const languageDetector = {
  type: 'languageDetector' as const,
  async: true,
  detect: (callback: (lang: string) => void) => {
    AsyncStorage.getItem('language')
      .then((language) => {
        if (language) {
          callback(language);
        } else {
          callback('en');
        }
      })
      .catch((error) => {
        console.error('Error detecting language:', error);
        callback('en');
      });
  },
  init: () => {},
  cacheUserLanguage: (language: string) => {
    AsyncStorage.setItem('language', language);
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: true,
    compatibilityJSON: 'v3', // Add this line to ensure compatibility with older versions
    resources: {
      en: { common: en },
      ru: { common: ru },
      ka: { common: ka },
    },
    ns: ['common'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
