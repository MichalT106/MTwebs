import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { t, type Language, type TranslationKey, type TranslationVars } from '@/i18n/translations';

const LANG_KEY = 'preferredLanguage';

interface LocaleContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, vars?: TranslationVars) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function getInitialLanguage(): Language {
  const saved = localStorage.getItem(LANG_KEY);
  if (saved === 'sk' || saved === 'en') return saved;
  return navigator.language.startsWith('sk') ? 'sk' : 'en';
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = t(language, 'app.title');
  }, [language]);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    localStorage.setItem(LANG_KEY, next);
  }, []);

  const translate = useCallback(
    (key: TranslationKey, vars?: TranslationVars) => t(language, key, vars),
    [language],
  );

  const value = useMemo(
    () => ({ language, setLanguage, t: translate }),
    [language, setLanguage, translate],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('useLocale must be used within LocaleProvider');
  return context;
}
