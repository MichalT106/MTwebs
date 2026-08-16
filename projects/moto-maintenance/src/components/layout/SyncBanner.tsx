import { Loader2, WifiOff, Check } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';
import { useMaintenance } from '@/context/MaintenanceContext';

export function SyncBanner() {
  const { t } = useLocale();
  const { syncStatus, syncError } = useMaintenance();

  if (syncStatus === 'synced' && !syncError) {
    return (
      <p className="mb-4 flex items-center gap-2 text-xs text-fg-muted">
        <Check className="size-3.5 text-accent-emerald" />
        {t('sync.ok')}
      </p>
    );
  }

  if (syncStatus === 'syncing') {
    return (
      <p className="mb-4 flex items-center gap-2 text-xs text-fg-muted">
        <Loader2 className="size-3.5 animate-spin" />
        {t('sync.syncing')}
      </p>
    );
  }

  return (
    <p className="mb-4 flex items-center gap-2 text-xs text-warning">
      <WifiOff className="size-3.5" />
      {syncError ?? t('sync.offline')}
    </p>
  );
}
