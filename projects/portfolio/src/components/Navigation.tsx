import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import { useSectionNavigation, type SectionId } from '../hooks/useSectionNavigation';
import { assetPath } from '../lib/assetPath';

export function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme, toggleLanguage, language } = useApp();
  const { t } = useTranslation();
  const { scrollToSection, goHomeTop } = useSectionNavigation();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  const openCv = () => {
    const fileName = language === 'sk' ? 'CV_SK.pdf' : 'CV_EN.pdf';
    window.open(assetPath(`biography/${fileName}`), '_blank', 'noopener');
  };

  const navLinks: { sectionId: SectionId; label: string }[] = [
    { sectionId: 'experience', label: t('nav.bar.experience') },
    { sectionId: 'projects', label: t('nav.school') },
  ];

  const navLinksFull: { sectionId: SectionId; label: string }[] = [
    { sectionId: 'experience', label: t('nav.experience') },
    { sectionId: 'projects', label: t('nav.school') },
  ];

  const navItemClass =
    'inline-flex shrink-0 items-center justify-center rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap text-fg-muted transition-colors duration-150 hover:bg-surface-raised hover:text-fg xl:px-4 xl:text-sm';

  const handleSectionClick = (sectionId: SectionId) => {
    setOpen(false);
    scrollToSection(sectionId);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,padding] duration-200 ${
        scrolled ? 'nav-glass py-3 shadow-sm' : 'bg-transparent py-4'
      }`}
    >
      <nav
        className="mx-auto flex max-w-9xl items-center gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <Link
          to="/"
          onClick={goHomeTop}
          className="shrink-0 text-lg font-bold tracking-tight text-fg transition-colors duration-150 hover:text-accent"
        >
          Port<span className="text-accent">folio</span>
        </Link>

        <div className="hidden min-w-0 flex-1 justify-center lg:flex">
          <div className="flex items-center gap-0.5 rounded-full border border-border bg-surface/80 p-1">
            <Link to="/" onClick={goHomeTop} className={navItemClass}>
              {t('nav.home')}
            </Link>
            {navLinks.map((link) => (
              <button
                key={link.sectionId}
                type="button"
                onClick={() => handleSectionClick(link.sectionId)}
                className={navItemClass}
              >
                {link.label}
              </button>
            ))}
            <button type="button" onClick={openCv} className={navItemClass}>
              {t('nav.bar.cv')}
            </button>
          </div>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex h-9 min-w-[2.75rem] items-center justify-center rounded-lg border border-border bg-surface px-2.5 text-xs font-bold text-fg-muted transition-colors duration-150 hover:text-fg"
            aria-label="Toggle language"
          >
            {language === 'sk' ? 'SK' : 'EN'}
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-fg-muted transition-colors duration-150 hover:text-fg"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-fg lg:hidden"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="nav-glass overflow-hidden border-t border-border lg:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              <Link
                to="/"
                onClick={(e) => {
                  setOpen(false);
                  goHomeTop(e);
                }}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-fg-muted hover:bg-surface-raised hover:text-fg"
              >
                {t('nav.home')}
              </Link>
              {navLinksFull.map((link) => (
                <button
                  key={link.sectionId}
                  type="button"
                  onClick={() => handleSectionClick(link.sectionId)}
                  className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-fg-muted hover:bg-surface-raised hover:text-fg"
                >
                  {link.label}
                </button>
              ))}
              <button
                type="button"
                onClick={openCv}
                className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-fg-muted hover:bg-surface-raised hover:text-fg"
              >
                {t('nav.cv')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
