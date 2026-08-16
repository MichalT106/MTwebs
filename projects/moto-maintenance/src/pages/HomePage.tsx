import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { MotorcycleFormDialog } from '@/components/motorcycles/MotorcycleFormDialog';
import { Dialog } from '@/components/ui/Dialog';
import { useLocale } from '@/context/LocaleContext';
import { useMaintenance } from '@/context/MaintenanceContext';
import { summarizeStatuses } from '@/lib/calc';
import { formatKm } from '@/lib/format';
import type { Motorcycle } from '@/types/maintenance';

export function HomePage() {
  const { t, language } = useLocale();
  const { motorcycles, addMotorcycle, updateMotorcycle, deleteMotorcycle, loading } = useMaintenance();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Motorcycle | null>(null);
  const [deleting, setDeleting] = useState<Motorcycle | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (motorcycle: Motorcycle) => {
    setEditing(motorcycle);
    setFormOpen(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{t('home.kicker')}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">{t('home.title')}</h1>
          <p className="mt-2 max-w-2xl text-sm text-fg-muted">{t('home.subtitle')}</p>
        </div>
        <button type="button" className="btn-primary self-start" onClick={openCreate}>
          <Plus className="size-4" />
          {t('home.add')}
        </button>
      </div>

      {motorcycles.length === 0 ? (
        <div className="panel px-6 py-16 text-center">
          <p className="text-lg font-semibold">{t('home.empty.title')}</p>
          <p className="mt-2 text-sm text-fg-muted">{t('home.empty.body')}</p>
          <button type="button" className="btn-primary mt-6" onClick={openCreate}>
            <Plus className="size-4" />
            {t('home.empty.cta')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {motorcycles.map((motorcycle) => {
            const summary = summarizeStatuses(motorcycle.maintenanceItems, motorcycle.currentMileage);
            const attention = summary.overdue + summary.due + summary.dueSoon;
            const tracked = motorcycle.maintenanceItems.filter((entry) => entry.enabled).length;

            return (
              <article key={motorcycle.id} className="panel flex flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight">
                      {motorcycle.manufacturer} {motorcycle.model}
                    </h2>
                    <p className="mt-1 text-sm text-fg-muted">{motorcycle.year}</p>
                  </div>
                  <p className="text-right text-sm font-semibold text-accent">
                    {formatKm(motorcycle.currentMileage, language)}
                  </p>
                </div>
                <p className="mt-4 text-sm text-fg-muted">
                  {t('home.tracked', { count: tracked })}
                  {attention > 0 ? ` · ${t('home.attention', { count: attention })}` : ''}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link to={`/motorcycle/${motorcycle.id}`} className="btn-primary">
                    {t('home.open')}
                  </Link>
                  <button type="button" className="btn-secondary" onClick={() => openEdit(motorcycle)}>
                    <Pencil className="size-4" />
                    {t('common.edit')}
                  </button>
                  <button
                    type="button"
                    className="btn-ghost text-danger hover:text-danger"
                    onClick={() => setDeleting(motorcycle)}
                  >
                    <Trash2 className="size-4" />
                    {t('common.delete')}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <MotorcycleFormDialog
        open={formOpen}
        motorcycle={editing}
        onClose={() => setFormOpen(false)}
        onSubmit={(input) => {
          if (editing) updateMotorcycle(editing.id, input);
          else addMotorcycle(input);
        }}
      />

      <Dialog
        open={Boolean(deleting)}
        title={t('bike.delete.title')}
        description={
          deleting
            ? t('bike.delete.desc', { name: `${deleting.manufacturer} ${deleting.model}` })
            : undefined
        }
        onClose={() => setDeleting(null)}
      >
        <div className="flex justify-end gap-2">
          <button type="button" className="btn-secondary" onClick={() => setDeleting(null)}>
            {t('common.cancel')}
          </button>
          <button
            type="button"
            className="btn-danger"
            onClick={() => {
              if (deleting) deleteMotorcycle(deleting.id);
              setDeleting(null);
            }}
          >
            {t('common.delete')}
          </button>
        </div>
      </Dialog>
    </div>
  );
}
