import { SEO } from '../../components/SEO';
import { ContentBlock, BlockTitle, DetailPageLayout } from '../../components/layout/DetailPageLayout';
import { TechTag } from '../../components/ui/GlassCard';
import { useTranslation } from '../../hooks/useTranslation';

export default function BuildMindPage() {
  const { t } = useTranslation();

  const responsibilities = [
    'experience.job2.details.keyResponsibilities.item1',
    'experience.job2.details.keyResponsibilities.item2',
    'experience.job2.details.keyResponsibilities.item3',
    'experience.job2.details.keyResponsibilities.item4',
    'experience.job2.details.keyResponsibilities.item5',
    'experience.job2.details.keyResponsibilities.item6',
  ] as const;

  const tech = ['UiPath', 'UiPath Orchestrator', 'Python', 'Requests', 'BeautifulSoup', 'AWS Lambda', 'AWS S3'];

  return (
    <>
      <SEO title="Portfolio | BuiltMind Experience" path="/experiences/BUILDMIND" />
      <DetailPageLayout title={t('experience.job2.title')}>
        <ContentBlock>
          <dl className="grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-semibold uppercase tracking-wider text-fg-subtle">{t('experience.details.period')}</dt>
              <dd className="mt-1 text-fg">{t('experience.job2.period')}</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold uppercase tracking-wider text-fg-subtle">{t('experience.job2.position')}</dt>
              <dd className="mt-1 text-fg">{t('experience.job2.title')}</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold uppercase tracking-wider text-fg-subtle">{t('experience.details.company')}</dt>
              <dd className="mt-1 text-fg">{t('experience.job2.company')}</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold uppercase tracking-wider text-fg-subtle">{t('experience.details.location')}</dt>
              <dd className="mt-1 text-fg">{t('experience.job2.location')}</dd>
            </div>
          </dl>
        </ContentBlock>

        <ContentBlock>
          <BlockTitle>{t('experience.job2.details.intro.title')}</BlockTitle>
          <p className="prose-body">{t('experience.job2.details.intro.text')}</p>
        </ContentBlock>

        <ContentBlock>
          <BlockTitle>{t('experience.job2.details.keyResponsibilities.title')}</BlockTitle>
          <ul className="space-y-2">
            {responsibilities.map((key) => (
              <li key={key} className="list-item-custom">{t(key)}</li>
            ))}
          </ul>
        </ContentBlock>

        <ContentBlock>
          <BlockTitle>{t('experience.job2.details.tech.title')}</BlockTitle>
          <p className="mb-4 prose-body">{t('experience.job2.details.tech.subtitle')}</p>
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
