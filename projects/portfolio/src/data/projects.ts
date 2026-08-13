import type { TranslationKey } from '../i18n/translations';

export interface ProjectEntry {
  id: string;
  slug: string;
  href: string;
  image: string;
  imageAltKey: TranslationKey;
  titleKey: TranslationKey;
  descKey: TranslationKey;
  ctaKey: TranslationKey;
  tagKeys: TranslationKey[];
}

export const projects: ProjectEntry[] = [
  {
    id: 'diploma',
    slug: 'DIPLOMA_THESIS',
    href: '/projects/DIPLOMA_THESIS',
    image: 'images/diploma_thesis.png',
    imageAltKey: 'school.project3.imageAlt',
    titleKey: 'school.project3.title',
    descKey: 'school.project3.desc',
    ctaKey: 'school.project3.cta',
    tagKeys: [
      'school.project3.tag1',
      'school.project3.tag2',
      'school.project3.tag3',
      'school.project3.tag4',
      'school.project3.tag5',
      'school.project3.tag6',
    ],
  },
  {
    id: 'carinsight',
    slug: 'CARINSIGHT',
    href: '/projects/CARINSIGHT',
    image: 'images/poster.png',
    imageAltKey: 'school.project2.imageAlt',
    titleKey: 'school.project2.title',
    descKey: 'school.project2.desc',
    ctaKey: 'school.project2.cta',
    tagKeys: [
      'school.project2.tag1',
      'school.project2.tag2',
      'school.project2.tag3',
      'school.project2.tag4',
      'school.project2.tag5',
      'school.project2.tag6',
    ],
  },
  {
    id: 'gamedays',
    slug: 'GAMEDAYS',
    href: '/projects/GAMEDAYS',
    image: 'images/gamedays_project.jpg',
    imageAltKey: 'school.project1.imageAlt',
    titleKey: 'school.project1.title',
    descKey: 'school.project1.desc',
    ctaKey: 'school.project1.cta',
    tagKeys: [
      'school.project1.tag1',
      'school.project1.tag2',
      'school.project1.tag3',
      'school.project1.tag4',
    ],
  },
];
