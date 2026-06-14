import { SEO } from '../../components/SEO';
import { ContentBlock, BlockTitle, DetailPageLayout } from '../../components/layout/DetailPageLayout';
import { ImageGallery } from '../../components/ui/ImageGallery';
import { TechTag } from '../../components/ui/GlassCard';
import { useTranslation } from '../../hooks/useTranslation';

const galleryImages = [
  { src: 'experiences/WEBASTO_images/last_successful_artifacts.png', alt: 'Webasto screenshot 1' },
  { src: 'experiences/WEBASTO_images/results_summary_comment.png', alt: 'Webasto screenshot 2' },
  { src: 'experiences/WEBASTO_images/sarif_file_results_preview.png', alt: 'Webasto screenshot 3' },
  { src: 'experiences/WEBASTO_images/sidebar.png', alt: 'Webasto screenshot 6' },
  { src: 'experiences/WEBASTO_images/sidebar1.png', alt: 'Webasto screenshot 7' },
  { src: 'experiences/WEBASTO_images/sidebar2.png', alt: 'Webasto screenshot 8' },
  { src: 'experiences/WEBASTO_images/specific_build.png', alt: 'Webasto screenshot 9' },
];

const tech = [
  'Jenkins', 'GitLab', 'GitLab Wiki', 'Groovy Pipelines', 'CMake',
  'Polyspace Bug Finder', 'Polyspace Code Prover', 'Polyspace Access',
  'Python scripting', 'VS Code (SARIF)',
];

export default function WebastoPage() {
  const { t } = useTranslation();

  return (
    <>
      <SEO title="Portfolio | Webasto Experience" path="/experiences/WEBASTO" />
      <DetailPageLayout
        title={t('experience.job1.title')}
        sidebar={
          <ContentBlock>
            <BlockTitle>{t('project1.media.gallery')}</BlockTitle>
            <ImageGallery images={galleryImages} title={t('project1.media.gallery')} />
          </ContentBlock>
        }
      >
        <ContentBlock>
          <dl className="grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-semibold uppercase tracking-wider text-fg-subtle">{t('experience.details.period')}</dt>
              <dd className="mt-1 text-fg">{t('experience.job1.period')}</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold uppercase tracking-wider text-fg-subtle">{t('experience.job1.position')}</dt>
              <dd className="mt-1 text-fg">{t('experience.job1.title')}</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold uppercase tracking-wider text-fg-subtle">{t('experience.details.company')}</dt>
              <dd className="mt-1 text-fg">{t('experience.job1.company')}</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold uppercase tracking-wider text-fg-subtle">{t('experience.details.location')}</dt>
              <dd className="mt-1 text-fg">{t('experience.job1.location')}</dd>
            </div>
          </dl>
        </ContentBlock>

        <ContentBlock>
          <BlockTitle>{t('experience.details.intro.title')}</BlockTitle>
          <p className="prose-body">{t('experience.details.intro.text')}</p>
        </ContentBlock>

        <ContentBlock>
          <BlockTitle>{t('experience.details.keyResponsibilities.title')}</BlockTitle>
          <ul className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <li key={i} className="list-item-custom">
                {t(`experience.details.keyResponsibilities.item${i}` as 'experience.details.keyResponsibilities.item1')}
              </li>
            ))}
          </ul>
        </ContentBlock>

        <ContentBlock>
          <BlockTitle>{t('experience.details.polyspace.title')}</BlockTitle>
          <p className="mb-6 prose-body">{t('experience.details.polyspace.intro')}</p>
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="mb-3 text-base font-semibold text-fg">{t('experience.details.polyspace.continuous.title')}</h3>
              <ul className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <li key={i} className="list-item-custom text-sm">{t(`experience.details.polyspace.continuous.item${i}` as 'experience.details.polyspace.continuous.item1')}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-base font-semibold text-fg">{t('experience.details.polyspace.nightly.title')}</h3>
              <ul className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <li key={i} className="list-item-custom text-sm">{t(`experience.details.polyspace.nightly.item${i}` as 'experience.details.polyspace.nightly.item1')}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8">
            <h3 className="mb-3 text-base font-semibold text-fg">{t('experience.details.polyspace.implementation.title')}</h3>
            <ul className="space-y-2">
              {[2, 3, 4, 5, 6].map((i) => (
                <li key={i} className="list-item-custom text-sm">{t(`experience.details.polyspace.implementation.item${i}` as 'experience.details.polyspace.implementation.item2')}</li>
              ))}
            </ul>
          </div>
        </ContentBlock>

        <ContentBlock>
          <BlockTitle>{t('experience.details.support.title')}</BlockTitle>
          <ul className="space-y-2">
            {[1, 2, 3].map((i) => (
              <li key={i} className="list-item-custom">{t(`experience.details.support.item${i}` as 'experience.details.support.item1')}</li>
            ))}
          </ul>
        </ContentBlock>

        <ContentBlock>
          <BlockTitle>{t('experience.details.tech.title')}</BlockTitle>
          <p className="mb-4 prose-body">{t('experience.details.tech.subtitle')}</p>
          <div className="flex flex-wrap gap-2">
            {tech.map((item) => (
              <TechTag key={item}>{item}</TechTag>
            ))}
          </div>
        </ContentBlock>
      </DetailPageLayout>
    </>
  );
}
