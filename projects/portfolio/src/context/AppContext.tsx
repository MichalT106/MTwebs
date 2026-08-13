import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Language } from '../i18n/translations';

type Theme = 'dark' | 'light';

interface AppContextValue {
  language: Language;
  theme: Theme;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const LANG_KEY = 'preferredLanguage';
const THEME_KEY = 'theme';

const AppContext = createContext<AppContextValue | null>(null);

function getInitialLanguage(): Language {
  const saved = localStorage.getItem(LANG_KEY);
  if (saved === 'sk' || saved === 'en') return saved;
  return navigator.language.startsWith('sk') ? 'sk' : 'en';
}

function getInitialTheme(): Theme {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'dark' || saved === 'light') return saved;
  return 'dark';
}

function applyThemeToDocument(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.classList.toggle('light', theme === 'light');
  root.setAttribute('data-theme', theme);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    applyThemeToDocument(theme);
    document.documentElement.lang = language;
  }, [theme, language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANG_KEY, lang);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'sk' ? 'en' : 'sk');
  }, [language, setLanguage]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    localStorage.setItem(THEME_KEY, next);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  const value = useMemo(
    () => ({ language, theme, setLanguage, toggleLanguage, setTheme, toggleTheme }),
    [language, theme, setLanguage, toggleLanguage, setTheme, toggleTheme],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
