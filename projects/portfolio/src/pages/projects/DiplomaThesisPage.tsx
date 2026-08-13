import { SEO } from '../../components/SEO';
import { ContentBlock, BlockTitle, DetailPageLayout } from '../../components/layout/DetailPageLayout';
import { ImageGallery } from '../../components/ui/ImageGallery';
import { Tag } from '../../components/ui/GlassCard';
import { useTranslation } from '../../hooks/useTranslation';

const galleryImages = [
  { src: 'projects/DIPLOMA_THESIS_images/Snímka obrazovky 2026-04-13 185852.png', alt: 'Diploma thesis project image 1' },
  { src: 'projects/DIPLOMA_THESIS_images/Snímka obrazovky 2026-04-13 185927.png', alt: 'Diploma thesis project image 2' },
  { src: 'projects/DIPLOMA_THESIS_images/Snímka obrazovky 2026-04-13 190005.png', alt: 'Diploma thesis project image 3' },
  { src: 'projects/DIPLOMA_THESIS_images/Snímka obrazovky 2026-04-13 190030.png', alt: 'Diploma thesis project image 4' },
  { src: 'projects/DIPLOMA_THESIS_images/Snímka obrazovky 2026-04-13 190122.png', alt: 'Diploma thesis project image 5' },
];

const techTags = ['Perl', 'LaTeXML', 'Python 3', 'SaxonC (XPath 3.1)', 'XML + XPath', 'Docker + Compose', 'GitLab CI/CD', 'GitLab Pages', 'TeX Live'];

export default function DiplomaThesisPage() {
  const { t } = useTranslation();

  return (
    <>
      <SEO title="Portfolio | Diploma Thesis Project" path="/projects/DIPLOMA_THESIS" />
      <DetailPageLayout
        title={t('project3.title')}
        sidebar={
          <ContentBlock>
            <BlockTitle>{t('project3.media.gallery')}</BlockTitle>
            <ImageGallery images={galleryImages} title={t('project3.media.gallery')} />
          </ContentBlock>
        }
      >
        <ContentBlock>
          <div className="flex items-start gap-4">
            <span className="text-2xl" aria-hidden="true">🎓</span>
            <div className="space-y-3">
              <p className="prose-body">
                {t('project3.eventPrefix')}
                <span className="font-semibold text-fg">{t('project3.eventTitle')}</span>
                {t('project3.eventSuffix')}
              </p>
              <p className="prose-body">{t('project3.eventIntro')}</p>
            </div>
          </div>
        </ContentBlock>

        <ContentBlock>
          <BlockTitle>{t('project3.overview.h')}</BlockTitle>
          <div className="space-y-3">
            <p className="prose-body">{t('project3.overview.p1')}</p>
            <p className="prose-body">{t('project3.overview.p2')}</p>
          </div>
        </ContentBlock>

        <ContentBlock>
          <BlockTitle>{t('project3.architecture.h')}</BlockTitle>
          <ul className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <li key={i} className="list-item-custom">{t(`project3.architecture.li${i}` as 'project3.architecture.li1')}</li>
            ))}
          </ul>
        </ContentBlock>

        <ContentBlock>
          <BlockTitle>{t('project3.workflow.h')}</BlockTitle>
          <ul className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <li key={i} className="list-item-custom">{t(`project3.workflow.li${i}` as 'project3.workflow.li1')}</li>
            ))}
          </ul>
        </ContentBlock>

        <ContentBlock>
          <BlockTitle>{t('project3.features.h')}</BlockTitle>
          <ul className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <li key={i} className="list-item-custom">{t(`project3.features.li${i}` as 'project3.features.li1')}</li>
            ))}
          </ul>
        </ContentBlock>

        <ContentBlock>
          <BlockTitle>{t('project3.rules.h')}</BlockTitle>
          <p className="mb-4 prose-body">{t('project3.rules.p1')}</p>
          <ul className="space-y-2">
            {[1, 2, 3].map((i) => (
              <li key={i} className="list-item-custom">{t(`project3.rules.li${i}` as 'project3.rules.li1')}</li>
            ))}
          </ul>
        </ContentBlock>

        <ContentBlock>
          <BlockTitle>{t('project3.outputs.h')}</BlockTitle>
          <div className="space-y-3">
            <p className="prose-body">{t('project3.outputs.p1')}</p>
            <p className="prose-body">{t('project3.outputs.p2')}</p>
          </div>
        </ContentBlock>

        <ContentBlock>
          <BlockTitle>{t('project3.reporting.h')}</BlockTitle>
          <ul className="space-y-2">
            {[1, 2, 3].map((i) => (
              <li key={i} className="list-item-custom">{t(`project3.reporting.li${i}` as 'project3.reporting.li1')}</li>
            ))}
          </ul>
        </ContentBlock>

        <ContentBlock>
          <BlockTitle>{t('project3.cicd.h')}</BlockTitle>
          <div className="space-y-3">
            <p className="prose-body">{t('project3.cicd.p1')}</p>
            <p className="prose-body">{t('project3.cicd.p2')}</p>
          </div>
        </ContentBlock>

        <ContentBlock>
          <BlockTitle>{t('project3.image.h')}</BlockTitle>
          <p className="prose-body">{t('project3.image.p1')}</p>
        </ContentBlock>

        <ContentBlock>
          <BlockTitle>{t('project3.local.h')}</BlockTitle>
          <p className="prose-body">{t('project3.local.p1')}</p>
        </ContentBlock>

        <ContentBlock>
          <BlockTitle>{t('project3.extensibility.h')}</BlockTitle>
          <p className="prose-body">{t('project3.extensibility.p1')}</p>
        </ContentBlock>

        <ContentBlock>
          <BlockTitle>{t('project3.meta.stackLabel')}</BlockTitle>
          <div className="flex flex-wrap gap-2">
            {techTags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
          </div>
        </ContentBlock>
      </DetailPageLayout>
    </>
  );
}
