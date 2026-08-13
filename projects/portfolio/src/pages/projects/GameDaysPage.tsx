import { SEO } from '../../components/SEO';
import { ContentBlock, BlockTitle, DetailPageLayout } from '../../components/layout/DetailPageLayout';
import { ImageGallery } from '../../components/ui/ImageGallery';
import { Tag } from '../../components/ui/GlassCard';
import { useTranslation } from '../../hooks/useTranslation';

const galleryImages = [
  { src: 'projects/GAMEDAYS_images/gamejam.png', alt: 'Call For Justice screenshot 1' },
  { src: 'projects/GAMEDAYS_images/gamejam2.png', alt: 'Call For Justice screenshot 2' },
  { src: 'projects/GAMEDAYS_images/gamejam3.png', alt: 'Call For Justice screenshot 3' },
  { src: 'projects/GAMEDAYS_images/gamejam4.png', alt: 'Call For Justice screenshot 4' },
  { src: 'projects/GAMEDAYS_images/gamejam5.png', alt: 'Call For Justice screenshot 5' },
  { src: 'projects/GAMEDAYS_images/gamejam6.png', alt: 'Call For Justice screenshot 6' },
  { src: 'projects/GAMEDAYS_images/gamejam7.png', alt: 'Call For Justice screenshot 7' },
];

export default function GameDaysPage() {
  const { t } = useTranslation();

  return (
    <>
      <SEO title="Portfolio | Call For Justice Project" path="/projects/GAMEDAYS" />
      <DetailPageLayout
        title={t('project1.title')}
        sidebar={
          <>
            <ContentBlock>
              <BlockTitle>{t('project1.media.video')}</BlockTitle>
              <div className="aspect-video overflow-hidden rounded-xl border border-border">
                <iframe
                  className="h-full w-full"
                  src="https://www.youtube.com/embed/aYKTL7I1Rew"
                  title="Call For Justice - gameplay"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </ContentBlock>
            <ContentBlock>
              <BlockTitle>{t('project1.media.gallery')}</BlockTitle>
              <ImageGallery images={galleryImages} title={t('project1.media.gallery')} />
            </ContentBlock>
          </>
        }
      >
        <ContentBlock>
          <div className="flex items-start gap-4">
            <span className="text-2xl" aria-hidden="true">🎮</span>
            <div className="space-y-3">
              <p className="prose-body">
                {t('project1.eventPrefix')}
                <a href="https://gamedays.sk/" target="_blank" rel="noopener" className="link-primary">{t('project1.eventLink')}</a>
                {t('project1.eventSuffix')}
              </p>
              <p className="prose-body">{t('project1.eventIntro')}</p>
            </div>
          </div>
        </ContentBlock>

        <ContentBlock>
          <BlockTitle>{t('project1.overview.h')}</BlockTitle>
          <div className="space-y-3">
            <p className="prose-body">{t('project1.overview.p1')}</p>
            <p className="prose-body">{t('project1.overview.p2')}</p>
          </div>
        </ContentBlock>

        <ContentBlock>
          <BlockTitle>{t('project1.contribution.h')}</BlockTitle>
          <ul className="space-y-2">
            {[1, 2, 3].map((i) => (
              <li key={i} className="list-item-custom">{t(`project1.contribution.li${i}` as 'project1.contribution.li1')}</li>
            ))}
          </ul>
        </ContentBlock>

        <ContentBlock>
          <BlockTitle>{t('project1.learned.h')}</BlockTitle>
          <ul className="space-y-2">
            {[1, 2, 3].map((i) => (
              <li key={i} className="list-item-custom">{t(`project1.learned.li${i}` as 'project1.learned.li1')}</li>
            ))}
          </ul>
        </ContentBlock>

        <ContentBlock>
          <BlockTitle>{t('project1.meta.stackLabel')}</BlockTitle>
          <div className="flex flex-wrap gap-2">
            {['Unity', 'C#', '2D Game Development', 'Rapid Prototyping'].map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        </ContentBlock>

        <ContentBlock>
          <BlockTitle>{t('project1.links.h')}</BlockTitle>
          <div className="flex flex-col gap-3">
            <a href="https://slavomirstucka.itch.io/call-for-justice" target="_blank" rel="noopener" className="link-primary">{t('project1.links.itch')}</a>
            <a href="https://www.youtube.com/watch?v=aYKTL7I1Rew" target="_blank" rel="noopener" className="link-primary">{t('project1.links.youtube')}</a>
            <a href="https://gamedays.sk/about" target="_blank" rel="noopener" className="link-primary">{t('project1.links.gamedays')}</a>
          </div>
        </ContentBlock>
      </DetailPageLayout>
    </>
  );
}
