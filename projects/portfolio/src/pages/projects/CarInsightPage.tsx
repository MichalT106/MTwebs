import { SEO } from '../../components/SEO';
import { ContentBlock, BlockTitle, DetailPageLayout } from '../../components/layout/DetailPageLayout';
import { ImageGallery } from '../../components/ui/ImageGallery';
import { Tag } from '../../components/ui/GlassCard';
import { useTranslation } from '../../hooks/useTranslation';

const version1Tags = ['React Native (Expo)', 'FastAPI', 'SQLAlchemy', 'PostgreSQL', 'JWT', 'APScheduler', 'Expo Push', 'NHTSA VPIC API'];
const version2Tags = ['FastAPI microservices', 'AWS Cognito', 'DynamoDB', 'Amazon S3', 'Redis (ElastiCache)', 'boto3', 'httpx', 'Docker'];
const stackTags = ['React Native (Expo)', 'FastAPI', 'Python', 'PostgreSQL (SQLAlchemy)', 'APScheduler', 'AWS Cognito', 'DynamoDB', 'Amazon S3', 'Redis', 'Docker'];

export default function CarInsightPage() {
  const { t } = useTranslation();

  return (
    <>
      <SEO title="Portfolio | CarInsight Project" path="/projects/CARINSIGHT" />
      <DetailPageLayout
        title="CarInsight"
        sidebar={
          <>
            <ContentBlock>
              <BlockTitle>{t('project2.media.video')}</BlockTitle>
              <div className="aspect-video overflow-hidden rounded-xl border border-border">
                <iframe
                  className="h-full w-full"
                  src="https://www.youtube.com/embed/vCEhlFzj2b8"
                  title="CarInsight - video presentation"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </ContentBlock>
            <ContentBlock>
              <BlockTitle>Poster</BlockTitle>
              <ImageGallery images={[{ src: 'images/poster.png', alt: 'CarInsight poster' }]} title="Poster" />
            </ContentBlock>
          </>
        }
      >
        <ContentBlock>
          <div className="flex items-start gap-4">
            <span className="text-2xl" aria-hidden="true">🚗</span>
            <div className="space-y-3">
              <p className="prose-body">
                {t('project2.eventPrefix')}
                <a href="https://kpi.fei.tuke.sk/sk/zaverecna-prezentacia-timovych-projektov-2025" target="_blank" rel="noopener" className="link-primary">{t('project2.eventLink')}</a>
                {t('project2.eventSuffix')}
              </p>
              <p className="prose-body">{t('project2.eventIntro')}</p>
            </div>
          </div>
        </ContentBlock>

        <ContentBlock>
          <BlockTitle>{t('project2.overview.h')}</BlockTitle>
          <div className="space-y-3">
            <p className="prose-body">{t('project2.overview.p1')}</p>
            <p className="prose-body">{t('project2.overview.p2')}</p>
          </div>
        </ContentBlock>

        <ContentBlock>
          <BlockTitle>{t('project2.version1.h')}</BlockTitle>
          <ul className="mb-4 space-y-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <li key={i} className="list-item-custom">{t(`project2.version1.li${i}` as 'project2.version1.li1')}</li>
            ))}
          </ul>
          <p className="mb-3 prose-body">{t('project2.version1.tech')}</p>
          <div className="flex flex-wrap gap-2">
            {version1Tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
          </div>
        </ContentBlock>

        <ContentBlock>
          <BlockTitle>{t('project2.version2.h')}</BlockTitle>
          <ul className="mb-4 space-y-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <li key={i} className="list-item-custom">{t(`project2.version2.li${i}` as 'project2.version2.li1')}</li>
            ))}
          </ul>
          <p className="mb-3 prose-body">{t('project2.version2.tech')}</p>
          <div className="flex flex-wrap gap-2">
            {version2Tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
          </div>
        </ContentBlock>

        <ContentBlock>
          <BlockTitle>{t('project2.learned.h')}</BlockTitle>
          <ul className="space-y-2">
            {[1, 2, 3].map((i) => (
              <li key={i} className="list-item-custom">{t(`project2.learned.li${i}` as 'project2.learned.li1')}</li>
            ))}
          </ul>
        </ContentBlock>

        <ContentBlock>
          <BlockTitle>{t('project2.meta.stackLabel')}</BlockTitle>
          <div className="flex flex-wrap gap-2">
            {stackTags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
          </div>
        </ContentBlock>

        <ContentBlock>
          <BlockTitle>{t('project1.links.h')}</BlockTitle>
          <div className="flex flex-col gap-3">
            <a href="https://kpi.fei.tuke.sk/sk/zaverecna-prezentacia-timovych-projektov-2025" target="_blank" rel="noopener" className="link-primary">{t('project2.links.event')}</a>
            <a href="https://www.youtube.com/watch?v=vCEhlFzj2b8" target="_blank" rel="noopener" className="link-primary">{t('project2.links.youtube')}</a>
            <a href="https://github.com/MichalT106/CARINSIGHT-Team-project" target="_blank" rel="noopener" className="link-primary">{t('project2.links.repo1')}</a>
            <a href="https://github.com/MichalT106/CARINSIGHT-cloud-systems" target="_blank" rel="noopener" className="link-primary">{t('project2.links.repo2')}</a>
          </div>
        </ContentBlock>
      </DetailPageLayout>
    </>
  );
}
