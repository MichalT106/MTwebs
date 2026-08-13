import { FileText } from 'lucide-react';
import { FadeIn } from './ui/Motion';
import { SectionLink } from './SectionLink';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../context/AppContext';
import { assetPath } from '../lib/assetPath';

export function Hero() {
  const { t } = useTranslation();
  const { language } = useApp();

  const openCv = () => {
    const fileName = language === 'sk' ? 'CV_SK.pdf' : 'CV_EN.pdf';
    window.open(assetPath(`biography/${fileName}`), '_blank', 'noopener');
  };

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 hero-glow" aria-hidden="true" />

      <div className="relative mx-auto grid min-h-[100svh] max-w-9xl items-center gap-12 px-4 pt-24 pb-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20 lg:px-8 lg:pt-28">
        <div className="flex flex-col justify-center">
          <FadeIn delay={0.05}>
            <h1 className="text-[clamp(2.25rem,6vw,4.5rem)] font-extrabold leading-[1.05] tracking-tight text-fg">
              {t('hero.title')}
            </h1>
          </FadeIn>

          <FadeIn delay={0.15}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg-muted sm:text-xl">
              {t('hero.subtitlePrefix')}{' '}
              <SectionLink sectionId="experience" className="link-primary font-semibold">
                {t('hero.experience')}
              </SectionLink>
              {t('hero.subtitleMiddle')}
              <SectionLink sectionId="projects" className="link-primary font-semibold">
                {t('hero.projects')}
              </SectionLink>
            </p>
          </FadeIn>

          <FadeIn delay={0.2} className="mt-10">
            <button type="button" onClick={openCv} className="btn-primary">
              <FileText size={18} aria-hidden="true" />
              {t('hero.cv')}
            </button>
          </FadeIn>
        </div>

        <FadeIn direction="left" delay={0.15} className="relative mx-auto w-full max-w-sm lg:max-w-md">
          <div className="relative">
            <div
              className="absolute -inset-3 rounded-[2rem] border border-border bg-surface-raised sm:-inset-4"
              aria-hidden="true"
            />
            <div
              className="absolute -right-4 top-8 h-24 w-24 rounded-2xl border border-accent bg-surface-raised sm:-right-6 sm:h-32 sm:w-32"
              style={{ borderColor: 'color-mix(in srgb, var(--color-accent) 25%, transparent)' }}
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-4 -left-4 h-20 w-20 rounded-2xl border border-border bg-surface-raised sm:h-28 sm:w-28"
              aria-hidden="true"
            />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-border-strong bg-surface shadow-card">
              <img
                src={assetPath('images/profile_picture.jfif')}
                alt="Profile"
                width={480}
                height={480}
                loading="eager"
                fetchPriority="high"
                className="aspect-square w-full object-cover object-[center_30%]"
              />
            </div>
          </div>
          <p className="mt-6 text-center text-2xl font-semibold tracking-tight text-fg sm:text-3xl lg:text-[2rem]">
            Ing. Michal Tkáč
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
