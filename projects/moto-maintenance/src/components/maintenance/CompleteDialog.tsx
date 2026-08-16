import { useEffect, useState, type FormEvent } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { useLocale } from '@/context/LocaleContext';
import { useMaintenance } from '@/context/MaintenanceContext';
import { formatKm, itemDisplayName } from '@/lib/format';
import { todayIsoDate } from '@/lib/utils';
import type { MaintenanceItem } from '@/types/maintenance';

interface CompleteDialogProps {
  open: boolean;
  item: MaintenanceItem | null;
  currentMileage: number;
  onClose: () => void;
  onConfirm: (override: { lastMaintenanceDate?: string; lastMaintenanceMileage?: number }) => void;
}

export function CompleteDialog({
  open,
  item,
  currentMileage,
  onClose,
  onConfirm,
}: CompleteDialogProps) {
  const { t, language } = useLocale();
  const { customCatalogItems } = useMaintenance();
  const [lastDate, setLastDate] = useState(todayIsoDate());
  const [lastMileage, setLastMileage] = useState(String(currentMileage));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setLastDate(todayIsoDate());
    setLastMileage(String(currentMileage));
  }, [open, currentMileage]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!item) return;

    if (item.trackingMethod === 'date') {
      if (!lastDate) {
        setError(t('complete.error.date'));
        return;
      }
      onConfirm({ lastMaintenanceDate: lastDate });
      onClose();
      return;
    }

    const mileage = Number(lastMileage);
    if (!Number.isFinite(mileage) || mileage < 0) {
      setError(t('complete.error.mileage'));
      return;
    }
    onConfirm({ lastMaintenanceMileage: Math.round(mileage) });
    onClose();
  };

  const customName = item?.customCatalogId
    ? customCatalogItems.find((entry) => entry.id === item.customCatalogId)?.name
    : undefined;
  const displayName = item ? itemDisplayName(item, language, customName) : '';

  return (
    <Dialog
      open={open}
      title={item ? t('complete.title', { name: displayName }) : t('complete.titleFallback')}
      description={t('complete.desc')}
      onClose={onClose}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {item?.trackingMethod === 'date' ? (
          <div>
            <label className="field-label" htmlFor="completeDate">
              {t('complete.date')}
            </label>
            <input
              id="completeDate"
              type="date"
              className="field-input"
              value={lastDate}
              onChange={(event) => setLastDate(event.target.value)}
            />
          </div>
        ) : (
          <div>
            <label className="field-label" htmlFor="completeMileage">
              {t('complete.mileage')}
            </label>
            <input
              id="completeMileage"
              type="number"
              min={0}
              className="field-input"
              value={lastMileage}
              onChange={(event) => setLastMileage(event.target.value)}
            />
            <p className="mt-1 text-xs text-fg-muted">
              {t('complete.current', { value: formatKm(currentMileage, language) })}
            </p>
          </div>
        )}
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button type="submit" className="btn-primary">
            {t('complete.submit')}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
