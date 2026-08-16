import { Check, Pencil, Trash2 } from 'lucide-react';
import { StatusBadge } from '@/components/ui/Badge';
import { useLocale } from '@/context/LocaleContext';
import { useMaintenance } from '@/context/MaintenanceContext';
import { projectMaintenance } from '@/lib/calc';
import { formatDays, formatDisplayDate, formatInterval, formatKm, itemDisplayName } from '@/lib/format';
import type { MaintenanceItem } from '@/types/maintenance';

interface MaintenanceCardProps {
  item: MaintenanceItem;
  currentMileage: number;
  onEdit: () => void;
  onComplete: () => void;
  onDelete: () => void;
}

export function MaintenanceCard({
  item,
  currentMileage,
  onEdit,
  onComplete,
  onDelete,
}: MaintenanceCardProps) {
  const { t, language } = useLocale();
  const { customCatalogItems } = useMaintenance();
  const projection = projectMaintenance(item, currentMileage);
  const customName = item.customCatalogId
    ? customCatalogItems.find((entry) => entry.id === item.customCatalogId)?.name
    : undefined;

  let remaining = t('card.missing');
  if (projection?.trackingMethod === 'date') {
    if (projection.remainingDays < 0) remaining = t('card.overdueDays', { value: formatDays(projection.remainingDays, language) });
    else if (projection.remainingDays === 0) remaining = t('card.dueToday');
    else remaining = t('card.remainingDays', { value: formatDays(projection.remainingDays, language) });
  } else if (projection?.trackingMethod === 'mileage') {
    if (projection.remainingKm < 0) remaining = t('card.overdueKm', { value: formatKm(Math.abs(projection.remainingKm), language) });
    else if (projection.remainingKm === 0) remaining = t('card.dueNow');
    else remaining = t('card.remainingKm', { value: formatKm(projection.remainingKm, language) });
  }

  return (
    <article className="panel flex flex-col gap-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold tracking-tight">
            {itemDisplayName(item, language, customName)}
          </h3>
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-fg-subtle">
            {t('card.tracking')}: {t(item.trackingMethod === 'date' ? 'card.tracking.date' : 'card.tracking.mileage')}
          </p>
        </div>
        {projection ? <StatusBadge status={projection.status} /> : null}
      </div>

      <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-fg-subtle">{t('card.last')}</dt>
          <dd className="mt-0.5 font-medium">
            {projection?.trackingMethod === 'date'
              ? formatDisplayDate(projection.lastDate, language)
              : projection
                ? formatKm(projection.lastMileage, language)
                : '—'}
          </dd>
        </div>
        <div>
          <dt className="text-fg-subtle">{t('card.interval')}</dt>
          <dd className="mt-0.5 font-medium">
            {projection ? formatInterval(projection.intervalValue, projection.intervalUnit, language) : '—'}
          </dd>
        </div>
        <div>
          <dt className="text-fg-subtle">{t('card.next')}</dt>
          <dd className="mt-0.5 font-medium">
            {projection?.trackingMethod === 'date'
              ? formatDisplayDate(projection.nextDate, language)
              : projection
                ? formatKm(projection.nextMileage, language)
                : '—'}
          </dd>
        </div>
        <div>
          <dt className="text-fg-subtle">{t('card.remaining')}</dt>
          <dd className="mt-0.5 font-medium">{remaining}</dd>
        </div>
      </dl>

      <div className="mt-auto flex flex-wrap gap-2">
        <button type="button" className="btn-primary" onClick={onComplete}>
          <Check className="size-4" />
          {t('card.complete')}
        </button>
        <button type="button" className="btn-secondary" onClick={onEdit}>
          <Pencil className="size-4" />
          {t('common.edit')}
        </button>
        <button type="button" className="btn-ghost text-danger hover:text-danger" onClick={onDelete}>
          <Trash2 className="size-4" />
          {t('common.delete')}
        </button>
      </div>
    </article>
  );
}
