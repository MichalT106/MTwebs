import { useMemo, useState, type FormEvent } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, Gauge, Pencil, Plus } from 'lucide-react';
import { CompleteDialog } from '@/components/maintenance/CompleteDialog';
import { MaintenanceCard } from '@/components/maintenance/MaintenanceCard';
import { MaintenanceFormDialog } from '@/components/maintenance/MaintenanceFormDialog';
import { MotorcycleFormDialog } from '@/components/motorcycles/MotorcycleFormDialog';
import { CountBadge } from '@/components/ui/Badge';
import { Dialog } from '@/components/ui/Dialog';
import { useLocale } from '@/context/LocaleContext';
import { useMaintenance } from '@/context/MaintenanceContext';
import { sortByUrgency, summarizeStatuses } from '@/lib/calc';
import { formatKm, itemDisplayName } from '@/lib/format';
import type { MaintenanceItem } from '@/types/maintenance';

export function DashboardPage() {
  const { id } = useParams();
  const { t, language } = useLocale();
  const {
    getMotorcycle,
    customCatalogItems,
    updateMotorcycle,
    updateMileage,
    addMaintenanceItem,
    updateMaintenanceItem,
    deleteMaintenanceItem,
    completeMaintenanceItem,
    loading,
  } = useMaintenance();

  const motorcycle = id ? getMotorcycle(id) : undefined;
  const [mileageDraft, setMileageDraft] = useState('');
  const [mileageError, setMileageError] = useState<string | null>(null);
  const [editBikeOpen, setEditBikeOpen] = useState(false);
  const [itemFormOpen, setItemFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MaintenanceItem | null>(null);
  const [completingItem, setCompletingItem] = useState<MaintenanceItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<MaintenanceItem | null>(null);

  const items = useMemo(
    () => (motorcycle ? sortByUrgency(motorcycle.maintenanceItems, motorcycle.currentMileage) : []),
    [motorcycle],
  );
  const summary = useMemo(
    () => (motorcycle ? summarizeStatuses(motorcycle.maintenanceItems, motorcycle.currentMileage) : null),
    [motorcycle],
  );

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!id || !motorcycle) {
    return <Navigate to="/" replace />;
  }

  const displayedDraft = mileageDraft === '' ? String(motorcycle.currentMileage) : mileageDraft;

  const submitMileage = (event: FormEvent) => {
    event.preventDefault();
    const next = Number(displayedDraft);
    if (!Number.isFinite(next) || next < 0) {
      setMileageError(t('bike.error.mileage'));
      return;
    }
    setMileageError(null);
    updateMileage(motorcycle.id, Math.round(next));
    setMileageDraft('');
  };

  const deletingName = deletingItem
    ? itemDisplayName(
        deletingItem,
        language,
        deletingItem.customCatalogId
          ? customCatalogItems.find((entry) => entry.id === deletingItem.customCatalogId)?.name
          : undefined,
      )
    : '';

  return (
    <div className="space-y-6">
      <Link to="/" className="btn-ghost -ml-3 self-start">
        <ArrowLeft className="size-4" />
        {t('dash.back')}
      </Link>

      <section className="panel overflow-hidden">
        <div className="hero-glow px-5 py-6 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{t('dash.kicker')}</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight">
                {motorcycle.manufacturer} {motorcycle.model}
              </h1>
              <p className="mt-1 text-sm text-fg-muted">{motorcycle.year}</p>
            </div>
            <button type="button" className="btn-secondary self-start" onClick={() => setEditBikeOpen(true)}>
              <Pencil className="size-4" />
              {t('common.edit')}
            </button>
          </div>

          <form className="mt-6 rounded-2xl border border-border bg-surface/80 p-4 sm:p-5" onSubmit={submitMileage}>
            <div className="flex items-center gap-2 text-fg-muted">
              <Gauge className="size-4" />
              <p className="text-xs font-semibold uppercase tracking-wide">{t('dash.mileage')}</p>
            </div>
            <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              {formatKm(motorcycle.currentMileage, language)}
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                className="field-input sm:max-w-xs"
                type="number"
                min={0}
                inputMode="numeric"
                value={displayedDraft}
                onChange={(event) => {
                  setMileageDraft(event.target.value);
                  setMileageError(null);
                }}
                aria-label={t('dash.mileage.aria')}
              />
              <button type="submit" className="btn-primary">
                {t('dash.mileage.update')}
              </button>
            </div>
            {mileageError ? <p className="mt-2 text-sm text-danger">{mileageError}</p> : null}
            <p className="mt-2 text-xs text-fg-muted">{t('dash.mileage.hint')}</p>
          </form>
        </div>
      </section>

      {summary ? (
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <CountBadge label={t('status.ok')} count={summary.ok} tone="ok" />
          <CountBadge label={t('status.dueSoon')} count={summary.dueSoon} tone="dueSoon" />
          <CountBadge label={t('status.due')} count={summary.due} tone="due" />
          <CountBadge label={t('status.overdue')} count={summary.overdue} tone="overdue" />
        </section>
      ) : null}

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">{t('dash.maintenance')}</h2>
            <p className="text-sm text-fg-muted">{t('dash.maintenance.sub')}</p>
          </div>
          <button
            type="button"
            className="btn-primary self-start"
            onClick={() => {
              setEditingItem(null);
              setItemFormOpen(true);
            }}
          >
            <Plus className="size-4" />
            {t('dash.add')}
          </button>
        </div>

        {items.length === 0 ? (
          <div className="panel px-6 py-12 text-center">
            <p className="font-semibold">{t('dash.empty.title')}</p>
            <p className="mt-2 text-sm text-fg-muted">{t('dash.empty.body')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {items.map((entry) => (
              <MaintenanceCard
                key={entry.id}
                item={entry}
                currentMileage={motorcycle.currentMileage}
                onEdit={() => {
                  setEditingItem(entry);
                  setItemFormOpen(true);
                }}
                onComplete={() => setCompletingItem(entry)}
                onDelete={() => setDeletingItem(entry)}
              />
            ))}
          </div>
        )}
      </section>

      <MotorcycleFormDialog
        open={editBikeOpen}
        motorcycle={motorcycle}
        onClose={() => setEditBikeOpen(false)}
        onSubmit={(input) => updateMotorcycle(motorcycle.id, input)}
      />

      <MaintenanceFormDialog
        open={itemFormOpen}
        item={editingItem}
        currentMileage={motorcycle.currentMileage}
        onClose={() => setItemFormOpen(false)}
        onSubmit={(input) => {
          if (editingItem) updateMaintenanceItem(motorcycle.id, editingItem.id, input);
          else addMaintenanceItem(motorcycle.id, input);
        }}
      />

      <CompleteDialog
        open={Boolean(completingItem)}
        item={completingItem}
        currentMileage={motorcycle.currentMileage}
        onClose={() => setCompletingItem(null)}
        onConfirm={(override) => {
          if (completingItem) completeMaintenanceItem(motorcycle.id, completingItem.id, override);
        }}
      />

      <Dialog
        open={Boolean(deletingItem)}
        title={t('item.delete.title')}
        description={deletingItem ? t('item.delete.desc', { name: deletingName }) : undefined}
        onClose={() => setDeletingItem(null)}
      >
        <div className="flex justify-end gap-2">
          <button type="button" className="btn-secondary" onClick={() => setDeletingItem(null)}>
            {t('common.cancel')}
          </button>
          <button
            type="button"
            className="btn-danger"
            onClick={() => {
              if (deletingItem) deleteMaintenanceItem(motorcycle.id, deletingItem.id);
              setDeletingItem(null);
            }}
          >
            {t('common.delete')}
          </button>
        </div>
      </Dialog>
    </div>
  );
}
