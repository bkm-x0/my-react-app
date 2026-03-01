import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import translations from '../../i18n/translations';

const useLangStore = create(
  persist(
    (set, get) => ({
      lang: 'en', // 'en' | 'ar'

      setLang: (lang) => {
        set({ lang });
        // Apply RTL direction to the document
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
      },

      t: (key) => {
        const { lang } = get();
        const keys = key.split('.');
        let val = translations[lang];
        for (const k of keys) {
          val = val?.[k];
        }
        return val ?? key;
      },
    }),
    {
      name: 'lang-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Re-apply dir after page reload
          document.documentElement.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
          document.documentElement.lang = state.lang;
        }
      },
    }
  )
);

export default useLangStore;
