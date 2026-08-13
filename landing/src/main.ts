import './style.css';
import generatedProjectMetadata from './generated-projects.json';
import { getInitialLanguage, saveLanguage, t, type Lang, type TranslationKey } from './i18n';

const THEME_KEY = 'theme';
type Theme = 'dark' | 'light';

interface LandingProject {
  name: string;
  slug: string;
  href: string;
  description: string;
  image?: string;
  category?: string;
  featured?: boolean;
}

interface LandingProjectMetadata {
  schemaVersion: number;
  projects: LandingProject[];
}

const projectMetadata = generatedProjectMetadata as LandingProjectMetadata;

let language = getInitialLanguage();

function getInitialTheme(): Theme {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'dark' || saved === 'light') return saved;
  return 'dark';
}

let theme = getInitialTheme();

function applyTheme(next: Theme) {
  theme = next;
  const root = document.documentElement;
  root.classList.toggle('dark', next === 'dark');
  root.classList.toggle('light', next === 'light');
  root.setAttribute('data-theme', next);
  localStorage.setItem(THEME_KEY, next);

  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', next === 'dark' ? '#070b14' : '#f1f5f9');
  }

  const icon = document.getElementById('theme-icon');
  if (icon) {
    icon.textContent = next === 'dark' ? '☀' : '☾';
  }
}

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
        ? 'MTwebs — portfólio a osobné projekty.'
        : 'MTwebs — portfolio and personal projects.',
    );
  }
}

function createTextSpan(className: string, text: string) {
  const span = document.createElement('span');
  span.className = className;
  span.textContent = text;
  return span;
}

function createProjectCard(project: LandingProject) {
  const card = document.createElement('a');
  card.href = project.href;
  card.className = 'card card-active';

  if (project.category) {
    card.appendChild(createTextSpan('badge', project.category));
  }

  card.appendChild(createTextSpan('card-label', project.name));
  card.appendChild(createTextSpan('card-desc', project.description));

  const arrow = createTextSpan('card-arrow', '→');
  arrow.setAttribute('aria-hidden', 'true');
  card.appendChild(arrow);

  return card;
}

function renderGeneratedProjects() {
  const cards = document.querySelector<HTMLElement>('.cards');
  const projects = projectMetadata.projects.filter((project) => project.name && project.href);

  if (!cards || projects.length === 0) {
    return;
  }

  cards.replaceChildren(...projects.map(createProjectCard));
}

function setupLanguageToggle() {
  const btn = document.getElementById('lang-toggle');
  if (!btn) return;

  const updateButton = () => {
    btn.textContent = language === 'sk' ? 'SK' : 'EN';
  };

  updateButton();

  btn.addEventListener('click', () => {
    language = language === 'sk' ? 'en' : 'sk';
    saveLanguage(language);
    applyTranslations(language);
    updateButton();
  });
}

function setupThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  applyTheme(theme);

  btn.addEventListener('click', () => {
    applyTheme(theme === 'dark' ? 'light' : 'dark');
  });
}

renderGeneratedProjects();
applyTranslations(language);
setupLanguageToggle();
setupThemeToggle();
