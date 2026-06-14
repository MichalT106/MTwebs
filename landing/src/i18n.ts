export type Lang = 'en' | 'sk';

const LANG_KEY = 'preferredLanguage';

export const translations = {
  en: {
    'portfolio.label': 'Portfolio',
    'portfolio.desc': 'Work experience, projects, and CV',
    'valentinka.label': 'Valentínka',
    'valentinka.desc': 'Interactive valentine mini web',
  },
  sk: {
    'portfolio.label': 'Portfólio',
    'portfolio.desc': 'Pracovné skúsenosti, projekty a životopis',
    'valentinka.label': 'Valentínka',
    'valentinka.desc': 'Interaktívna valentínka',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export function getInitialLanguage(): Lang {
  const saved = localStorage.getItem(LANG_KEY);
  if (saved === 'sk' || saved === 'en') return saved;
  return navigator.language.startsWith('sk') ? 'sk' : 'en';
}

export function saveLanguage(lang: Lang) {
  localStorage.setItem(LANG_KEY, lang);
}

export function t(lang: Lang, key: TranslationKey): string {
  return translations[lang][key];
}
