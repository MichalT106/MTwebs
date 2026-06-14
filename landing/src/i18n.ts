export type Lang = 'en' | 'sk';

const LANG_KEY = 'preferredLanguage';

export const translations = {
  en: {
    eyebrow: 'Data Engineer',
    intro:
      'I build data pipelines, cloud systems, and software with a focus on reliability and clarity.',
    'portfolio.label': 'Portfolio',
    'portfolio.desc': 'Work experience, projects, and CV',
    'projects.label': 'Projects',
    'projects.desc': 'Standalone project showcase',
    'blog.label': 'Blog',
    'blog.desc': 'Notes on data engineering and software',
    'experiments.label': 'Experiments',
    'experiments.desc': 'Small tools and prototypes',
    comingSoon: 'Coming soon',
    footer: '© 2026 Ing. Michal Tkáč',
  },
  sk: {
    eyebrow: 'Data Engineer',
    intro:
      'Vytváram dátové pipeline, cloudové systémy a softvér so zameraním na spoľahlivosť a prehľadnosť.',
    'portfolio.label': 'Portfólio',
    'portfolio.desc': 'Pracovné skúsenosti, projekty a životopis',
    'projects.label': 'Projekty',
    'projects.desc': 'Samostatná prezentácia projektov',
    'blog.label': 'Blog',
    'blog.desc': 'Poznámky o dátovom inžinierstve a softvéri',
    'experiments.label': 'Experimenty',
    'experiments.desc': 'Malé nástroje a prototypy',
    comingSoon: 'Už čoskoro',
    footer: '© 2026 Ing. Michal Tkáč',
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
