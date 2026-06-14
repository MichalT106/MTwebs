import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, Phone } from 'lucide-react';
import { SectionLink } from './SectionLink';
import { useTranslation } from '../hooks/useTranslation';
import { useSectionNavigation } from '../hooks/useSectionNavigation';

export function Footer() {
  const { t } = useTranslation();
  const { goHomeTop } = useSectionNavigation();

  return (
    <footer className="border-t border-border bg-surface-raised">
      <div className="mx-auto grid max-w-8xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.2fr_1fr] lg:px-8">
        <div>
          <p className="text-2xl font-bold text-fg">
            Port<span className="text-accent">folio</span>
          </p>
          <p className="mt-3 max-w-sm text-fg-muted">Ing. Michal Tkáč</p>
        </div>

        <div className="grid gap-10 sm:grid-cols-2">
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-fg-subtle">
              {t('footer.links')}
            </h3>
            <nav className="flex flex-col gap-2" aria-label="Footer navigation">
              <Link
                to="/"
                onClick={goHomeTop}
                className="text-fg-muted transition-colors duration-150 hover:text-fg"
              >
                {t('nav.home')}
              </Link>
              <SectionLink sectionId="experience" className="text-fg-muted transition-colors duration-150 hover:text-fg">
                {t('nav.experience')}
              </SectionLink>
              <SectionLink sectionId="projects" className="text-fg-muted transition-colors duration-150 hover:text-fg">
                {t('nav.school')}
              </SectionLink>
            </nav>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-fg-subtle">
              {t('footer.contact')}
            </h3>
            <div className="flex flex-col gap-2">
              <a
                href="mailto:michaltkac106@gmail.com"
                className="inline-flex items-center gap-2 text-fg-muted transition-colors duration-150 hover:text-fg"
              >
                <Mail size={16} aria-hidden="true" />
                michaltkac106@gmail.com
              </a>
              <p className="inline-flex items-center gap-2 text-fg-muted">
                <Phone size={16} aria-hidden="true" />
                +421 902 583 717
              </p>
            </div>
            <div className="mt-5 flex gap-3">
              <a
                href="https://github.com/MichalT106"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-fg-muted transition-colors duration-150 hover:border-border-strong hover:text-accent"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href="https://www.linkedin.com/in/michal-tk%C3%A1%C4%8D-267603411/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-fg-muted transition-colors duration-150 hover:border-border-strong hover:text-accent"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
