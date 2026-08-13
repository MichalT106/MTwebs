import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { StaggerContainer, StaggerItem } from './ui/Motion';
import { SectionHeader } from './layout/SectionHeader';
import { projects } from '../data/projects';
import { useTranslation } from '../hooks/useTranslation';
import { assetPath } from '../lib/assetPath';

const bentoLayout: Record<string, string> = {
  diploma: 'lg:col-span-7 lg:row-span-2',
  carinsight: 'lg:col-span-5',
  gamedays: 'lg:col-span-5',
};

export function Projects() {
  const { t } = useTranslation();

  return (
    <section id="projects" className="scroll-mt-nav py-20 sm:py-28">
      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <SectionHeader title={t('school.title')} label={t('nav.school')} />

        <StaggerContainer className="grid gap-4 sm:gap-5 lg:grid-cols-12 lg:auto-rows-[minmax(180px,auto)]">
          {projects.map((project) => {
            const isFeatured = project.id === 'diploma';

            return (
              <StaggerItem key={project.id} className={bentoLayout[project.id] ?? ''}>
                <Link to={project.href} className="group block h-full">
                  <article className="panel-interactive flex h-full flex-col overflow-hidden">
                    <div
                      className={`relative overflow-hidden ${isFeatured ? 'aspect-[16/9] lg:aspect-auto lg:min-h-[220px] lg:flex-1' : 'aspect-[16/10]'}`}
                    >
                      <img
                        src={assetPath(project.image)}
                        alt={t(project.imageAltKey)}
                        loading="lazy"
                        decoding="async"
                        className="img-hover h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent opacity-90" />
                      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                        <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                          {t(project.descKey)}
                        </p>
                        <h3
                          className={`mt-1 font-bold text-fg ${isFeatured ? 'text-xl sm:text-2xl lg:text-3xl' : 'text-lg sm:text-xl'}`}
                        >
                          {t(project.titleKey)}
                        </h3>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col justify-between gap-4 p-5 sm:p-6">
                      <div className="flex flex-wrap gap-1.5">
                        {project.tagKeys.slice(0, isFeatured ? 6 : 4).map((key) => (
                          <span key={key} className="tag-pill">
                            {t(key)}
                          </span>
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors duration-150 group-hover:text-accent-hover">
                        {t(project.ctaKey)}
                        <ArrowUpRight size={16} aria-hidden="true" />
                      </span>
                    </div>
                  </article>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
