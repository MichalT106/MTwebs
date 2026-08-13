import type { TranslationKey } from '../i18n/translations';

export interface ExperienceEntry {
  id: string;
  slug: string;
  marker: string;
  isCurrent: boolean;
  href: string;
  periodKey: TranslationKey;
  titleKey: TranslationKey;
  companyKey: TranslationKey;
  locationKey: TranslationKey;
}

export const experiences: ExperienceEntry[] = [
  {
    id: 'buildmind',
    slug: 'BUILDMIND',
    marker: '02',
    isCurrent: true,
    href: '/experiences/BUILDMIND',
    periodKey: 'experience.job2.period',
    titleKey: 'experience.job2.title',
    companyKey: 'experience.job2.company',
    locationKey: 'experience.job2.location',
  },
  {
    id: 'webasto',
    slug: 'WEBASTO',
    marker: '01',
    isCurrent: false,
    href: '/experiences/WEBASTO',
    periodKey: 'experience.job1.period',
    titleKey: 'experience.job1.title',
    companyKey: 'experience.job1.company',
    locationKey: 'experience.job1.location',
  },
];
