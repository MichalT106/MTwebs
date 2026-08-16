import {
  localeFor,
  pluralKey,
  t,
  type Language,
} from '@/i18n/translations';
import type { IntervalUnit, MaintenanceItem } from '@/types/maintenance';
import { isPredefinedCatalogKey } from '@/lib/catalog';
import { parseIsoDate } from '@/lib/utils';

export function formatNumber(value: number, language: Language): string {
  return new Intl.NumberFormat(localeFor(language)).format(Math.round(value));
}

export function formatKm(value: number, language: Language): string {
  return t(language, 'unit.km', { n: formatNumber(value, language) });
}

export function formatDays(value: number, language: Language): string {
  const abs = Math.abs(value);
  return t(language, pluralKey(language, abs, 'unit.days'), { n: abs });
}

export function formatDisplayDate(iso: string, language: Language): string {
  return new Intl.DateTimeFormat(localeFor(language), {
    day: 'numeric',
    month: language === 'sk' ? 'numeric' : 'short',
    year: 'numeric',
  }).format(parseIsoDate(iso));
}

export function formatInterval(value: number, unit: IntervalUnit, language: Language): string {
  if (unit === 'km') {
    return t(language, 'interval.every.km', { n: formatNumber(value, language) });
  }
  const base =
    unit === 'years' ? 'interval.every.years' : unit === 'months' ? 'interval.every.months' : 'interval.every.days';
  return t(language, pluralKey(language, value, base), { n: value });
}

export function itemDisplayName(
  item: Pick<MaintenanceItem, 'name' | 'catalogKey' | 'customCatalogId'>,
  language: Language,
  customName?: string,
): string {
  if (customName) return customName;
  if (isPredefinedCatalogKey(item.catalogKey)) {
    return t(language, `catalog.${item.catalogKey}`);
  }
  return item.name;
}
