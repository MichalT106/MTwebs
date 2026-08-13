import { useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { t, type TranslationKey } from '../i18n/translations';

export function useTranslation() {
  const { language } = useApp();

  const translate = useCallback(
    (key: TranslationKey, fallback?: string) => {
      const value = t(language, key);
      if (value === key && fallback) return fallback;
      return value;
    },
    [language],
  );

  return { language, t: translate };
}
