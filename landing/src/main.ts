import './style.css';
import { getInitialLanguage, saveLanguage, t, type Lang, type TranslationKey } from './i18n';

let language = getInitialLanguage();

function applyTranslations(lang: Lang) {
  document.documentElement.lang = lang;
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n as TranslationKey;
    el.textContent = t(lang, key);
  });

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute(
      'content',
      lang === 'sk'
        ? 'Ing. Michal Tkáč — Data Engineer. Portfólio, projekty a experimenty.'
        : 'Ing. Michal Tkáč — Data Engineer. Portfolio, projects, and experiments.',
    );
  }
}

function setupLanguageToggle() {
  const btn = document.getElementById('lang-toggle');
  if (!btn) return;

  const updateButton = () => {
    btn.textContent = language === 'sk' ? 'SK' : 'EN';
  };

  updateButton();
  applyTranslations(language);

  btn.addEventListener('click', () => {
    language = language === 'sk' ? 'en' : 'sk';
    saveLanguage(language);
    applyTranslations(language);
    updateButton();
  });
}

setupLanguageToggle();
