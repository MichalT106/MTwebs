import { Link } from 'react-router-dom';
import { ArrowUpRight, Briefcase } from 'lucide-react';
import { StaggerContainer, StaggerItem } from './ui/Motion';
import { SectionHeader } from './layout/SectionHeader';
import { experiences } from '../data/experiences';
import { useTranslation } from '../hooks/useTranslation';

export function Experience() {
  const { t } = useTranslation();

  return (
    <section id="experience" className="scroll-mt-nav border-t border-border bg-surface-raised py-20 sm:py-28">
      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <SectionHeader title={t('experience.title')} label={t('nav.experience')} />

        <StaggerContainer className="space-y-5">
          {experiences.map((exp) => (
            <StaggerItem key={exp.id}>
              <Link to={exp.href} className="group block">
                <article
                  className={`panel-interactive relative overflow-hidden p-6 sm:p-8 ${
                    exp.isCurrent ? 'border-[color:var(--color-accent-emerald)]' : ''
                  }`}
                >
                  {exp.isCurrent && (
                    <div
                      className="absolute inset-y-0 left-0 w-1 bg-accent-emerald"
                      aria-hidden="true"
                    />
                  )}

                  <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-5 sm:gap-8">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-border bg-surface text-lg font-bold text-fg-subtle">
                        {exp.marker}
                      </div>
                      <div className="min-w-0">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <span className={exp.isCurrent ? 'badge-current' : 'badge-past'}>
                            {exp.isCurrent ? t('experience.current') : t('experience.previous')}
                          </span>
                          <time className="text-sm font-semibold text-accent">{t(exp.periodKey)}</time>
                        </div>
                        <h3 className="text-xl font-bold text-fg sm:text-2xl">{t(exp.titleKey)}</h3>
                        <p className="mt-2 flex items-center gap-2 text-fg-muted">
                          <Briefcase size={16} className="shrink-0 text-fg-subtle" aria-hidden="true" />
                          {t(exp.companyKey)}
                        </p>
                        <p className="mt-1 text-sm text-fg-subtle">{t(exp.locationKey)}</p>
                      </div>
                    </div>

                    <span className="inline-flex shrink-0 items-center gap-1.5 self-start text-sm font-semibold text-accent transition-colors duration-150 group-hover:text-accent-hover">
                      {t('experience.viewDetails')}
                      <ArrowUpRight
                        size={16}
                        className="transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </article>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
