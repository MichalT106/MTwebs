import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { CustomItemDialog } from '@/components/maintenance/CustomItemDialog';
import { Dialog } from '@/components/ui/Dialog';
import { useLocale } from '@/context/LocaleContext';
import { useMaintenance } from '@/context/MaintenanceContext';
import { CATALOG_CATEGORY_ORDER, MAINTENANCE_CATALOG, isPredefinedCatalogKey } from '@/lib/catalog';
import { todayIsoDate } from '@/lib/utils';
import type {
  CatalogKey,
  CustomCatalogItem,
  DateIntervalUnit,
  MaintenanceItem,
  MaintenanceItemInput,
  TrackingMethod,
} from '@/types/maintenance';

interface MaintenanceFormDialogProps {
  open: boolean;
  item?: MaintenanceItem | null;
  currentMileage: number;
  onClose: () => void;
  onSubmit: (input: MaintenanceItemInput) => void;
}

type Selection = { type: 'predefined'; key: Exclude<CatalogKey, 'custom'> } | { type: 'custom'; id: string } | null;

interface FormState {
  selection: Selection;
  trackingMethod: TrackingMethod;
  lastMaintenanceDate: string;
  lastMaintenanceMileage: string;
  intervalValue: string;
  intervalUnit: DateIntervalUnit;
}

function selectionFromItem(item: MaintenanceItem | null | undefined): Selection {
  if (!item) return { type: 'predefined', key: 'engine_oil' };
  if (item.customCatalogId) return { type: 'custom', id: item.customCatalogId };
  if (isPredefinedCatalogKey(item.catalogKey)) return { type: 'predefined', key: item.catalogKey };
  return null;
}

function toForm(item: MaintenanceItem | null | undefined, currentMileage: number): FormState {
  if (!item) {
    return {
      selection: { type: 'predefined', key: 'engine_oil' },
      trackingMethod: 'mileage',
      lastMaintenanceDate: todayIsoDate(),
      lastMaintenanceMileage: String(currentMileage),
      intervalValue: '6000',
      intervalUnit: 'years',
    };
  }

  return {
    selection: selectionFromItem(item),
    trackingMethod: item.trackingMethod,
    lastMaintenanceDate: item.lastMaintenanceDate ?? todayIsoDate(),
    lastMaintenanceMileage: String(item.lastMaintenanceMileage ?? currentMileage),
    intervalValue: String(item.intervalValue),
    intervalUnit:
      item.intervalUnit === 'years' || item.intervalUnit === 'months' ? item.intervalUnit : 'days',
  };
}

export function MaintenanceFormDialog({
  open,
  item,
  currentMileage,
  onClose,
  onSubmit,
}: MaintenanceFormDialogProps) {
  const { t, language } = useLocale();
  const { customCatalogItems, addCustomCatalogItem, updateCustomCatalogItem, deleteCustomCatalogItem } =
    useMaintenance();
  const [form, setForm] = useState<FormState>(() => toForm(item, currentMileage));
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [customOpen, setCustomOpen] = useState(false);
  const [editingCustom, setEditingCustom] = useState<CustomCatalogItem | null>(null);
  const [deletingCustom, setDeletingCustom] = useState<CustomCatalogItem | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setQuery('');
    setForm(toForm(item, currentMileage));
  }, [open, item, currentMileage]);

  const normalizedQuery = query.trim().toLocaleLowerCase(language === 'sk' ? 'sk' : 'en');

  const groupedCatalog = useMemo(() => {
    return CATALOG_CATEGORY_ORDER.map((category) => ({
      category,
      items: MAINTENANCE_CATALOG.filter((entry) => {
        if (entry.category !== category) return false;
        if (!normalizedQuery) return true;
        return t(`catalog.${entry.key}`).toLocaleLowerCase(language === 'sk' ? 'sk' : 'en').includes(normalizedQuery);
      }),
    })).filter((group) => group.items.length > 0);
  }, [normalizedQuery, t, language]);

  const visibleCustom = useMemo(
    () =>
      customCatalogItems.filter((entry) =>
        !normalizedQuery
          ? true
          : entry.name.toLocaleLowerCase(language === 'sk' ? 'sk' : 'en').includes(normalizedQuery),
      ),
    [customCatalogItems, normalizedQuery, language],
  );

  const setMethod = (method: TrackingMethod) => {
    setForm((current) => {
      if (method === current.trackingMethod) return current;
      if (method === 'mileage') {
        return { ...current, trackingMethod: method, intervalValue: '6000' };
      }
      return { ...current, trackingMethod: method, intervalValue: '1', intervalUnit: 'years' };
    });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const intervalValue = Number(form.intervalValue);

    const selection = form.selection;
    if (!selection) {
      setError(t('form.error.select'));
      return;
    }
    if (!Number.isFinite(intervalValue) || intervalValue <= 0) {
      setError(t('form.error.interval'));
      return;
    }

    let name = '';
    let catalogKey: CatalogKey = 'custom';
    let customCatalogId: string | null = null;

    if (selection.type === 'predefined') {
      catalogKey = selection.key;
      name = t(`catalog.${selection.key}`);
    } else {
      const custom = customCatalogItems.find((entry) => entry.id === selection.id);
      if (!custom) {
        setError(t('form.error.select'));
        return;
      }
      name = custom.name;
      customCatalogId = custom.id;
    }

    if (!name) {
      setError(t('form.error.name'));
      return;
    }

    if (form.trackingMethod === 'date') {
      if (!form.lastMaintenanceDate) {
        setError(t('form.error.date'));
        return;
      }
      onSubmit({
        name,
        catalogKey,
        customCatalogId,
        trackingMethod: 'date',
        lastMaintenanceDate: form.lastMaintenanceDate,
        lastMaintenanceMileage: null,
        intervalValue: Math.round(intervalValue),
        intervalUnit: form.intervalUnit,
      });
      onClose();
      return;
    }

    const lastMileage = Number(form.lastMaintenanceMileage);
    if (!Number.isFinite(lastMileage) || lastMileage < 0) {
      setError(t('form.error.mileage'));
      return;
    }

    onSubmit({
      name,
      catalogKey,
      customCatalogId,
      trackingMethod: 'mileage',
      lastMaintenanceDate: null,
      lastMaintenanceMileage: Math.round(lastMileage),
      intervalValue: Math.round(intervalValue),
      intervalUnit: 'km',
    });
    onClose();
  };

  const isSelected = (selection: Selection) => {
    if (!form.selection || !selection) return false;
    if (form.selection.type !== selection.type) return false;
    if (selection.type === 'predefined' && form.selection.type === 'predefined') {
      return form.selection.key === selection.key;
    }
    if (selection.type === 'custom' && form.selection.type === 'custom') {
      return form.selection.id === selection.id;
    }
    return false;
  };

  return (
    <>
      <Dialog
        open={open}
        title={item ? t('form.edit.title') : t('form.add.title')}
        description={t('form.desc')}
        onClose={onClose}
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="field-label" htmlFor="itemSearch">
              {t('form.item')}
            </label>
            <input
              id="itemSearch"
              className="field-input"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('common.search')}
            />
            <div className="mt-2 max-h-52 overflow-y-auto rounded-xl border border-border">
              {groupedCatalog.map((group) => (
                <div key={group.category} className="border-b border-border last:border-b-0">
                  <p className="sticky top-0 bg-surface-raised px-3 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-wide text-fg-subtle">
                    {t(`category.${group.category}`)}
                  </p>
                  {group.items.map((entry) => (
                    <button
                      key={entry.key}
                      type="button"
                      className={`flex w-full px-3 py-2 text-left text-sm ${
                        isSelected({ type: 'predefined', key: entry.key })
                          ? 'bg-accent/15 font-medium text-accent'
                          : 'hover:bg-page'
                      }`}
                      onClick={() =>
                        setForm((current) => ({ ...current, selection: { type: 'predefined', key: entry.key } }))
                      }
                    >
                      {t(`catalog.${entry.key}`)}
                    </button>
                  ))}
                </div>
              ))}

              {visibleCustom.length > 0 ? (
                <div>
                  <p className="sticky top-0 bg-surface-raised px-3 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-wide text-fg-subtle">
                    {t('category.custom')}
                  </p>
                  {visibleCustom.map((entry) => (
                    <div
                      key={entry.id}
                      className={`flex items-center gap-1 px-1 ${
                        isSelected({ type: 'custom', id: entry.id }) ? 'bg-accent/15' : ''
                      }`}
                    >
                      <button
                        type="button"
                        className={`min-w-0 flex-1 px-2 py-2 text-left text-sm ${
                          isSelected({ type: 'custom', id: entry.id }) ? 'font-medium text-accent' : 'hover:bg-page'
                        }`}
                        onClick={() =>
                          setForm((current) => ({ ...current, selection: { type: 'custom', id: entry.id } }))
                        }
                      >
                        {entry.name}
                      </button>
                      <button
                        type="button"
                        className="btn-ghost size-8 p-0"
                        aria-label={t('common.edit')}
                        onClick={() => {
                          setEditingCustom(entry);
                          setCustomOpen(true);
                        }}
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        className="btn-ghost size-8 p-0 text-danger"
                        aria-label={t('common.delete')}
                        onClick={() => setDeletingCustom(entry)}
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            <button
              type="button"
              className="btn-ghost mt-2 px-0 text-accent hover:text-accent-hover"
              onClick={() => {
                setEditingCustom(null);
                setCustomOpen(true);
              }}
            >
              <Plus className="size-4" />
              {t('form.custom.add')}
            </button>
          </div>

          <div>
            <p className="field-label">{t('form.method')}</p>
            <div className="grid grid-cols-2 gap-2">
              {(['mileage', 'date'] as const).map((method) => (
                <button
                  key={method}
                  type="button"
                  className={form.trackingMethod === method ? 'btn-primary' : 'btn-secondary'}
                  onClick={() => setMethod(method)}
                >
                  {t(method === 'mileage' ? 'form.method.mileage' : 'form.method.date')}
                </button>
              ))}
            </div>
          </div>

          {form.trackingMethod === 'date' ? (
            <>
              <div>
                <label className="field-label" htmlFor="lastDate">
                  {t('form.lastDate')}
                </label>
                <input
                  id="lastDate"
                  type="date"
                  className="field-input"
                  value={form.lastMaintenanceDate}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, lastMaintenanceDate: event.target.value }))
                  }
                />
              </div>
              <div>
                <p className="field-label">{t('form.repeat')}</p>
                <div className="grid grid-cols-[1fr_8rem] gap-2">
                  <input
                    id="intervalValue"
                    type="number"
                    min={1}
                    step={1}
                    className="field-input"
                    value={form.intervalValue}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, intervalValue: event.target.value }))
                    }
                  />
                  <select
                    id="intervalUnit"
                    className="field-input"
                    value={form.intervalUnit}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        intervalUnit: event.target.value as DateIntervalUnit,
                      }))
                    }
                  >
                    <option value="days">{t('form.unit.days')}</option>
                    <option value="months">{t('form.unit.months')}</option>
                    <option value="years">{t('form.unit.years')}</option>
                  </select>
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="field-label" htmlFor="lastMileage">
                  {t('form.lastMileage')}
                </label>
                <input
                  id="lastMileage"
                  type="number"
                  min={0}
                  className="field-input"
                  value={form.lastMaintenanceMileage}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, lastMaintenanceMileage: event.target.value }))
                  }
                />
              </div>
              <div>
                <p className="field-label">{t('form.repeat')}</p>
                <div className="grid grid-cols-[1fr_5.5rem] gap-2">
                  <input
                    id="intervalKm"
                    type="number"
                    min={1}
                    step={1}
                    className="field-input"
                    value={form.intervalValue}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, intervalValue: event.target.value }))
                    }
                  />
                  <div className="field-input flex items-center justify-center font-medium text-fg-muted">
                    {t('form.unit.km')}
                  </div>
                </div>
              </div>
            </>
          )}

          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-secondary" onClick={onClose}>
              {t('common.cancel')}
            </button>
            <button type="submit" className="btn-primary">
              {item ? t('form.save') : t('form.add.submit')}
            </button>
          </div>
        </form>
      </Dialog>

      <CustomItemDialog
        open={customOpen}
        item={editingCustom}
        onClose={() => setCustomOpen(false)}
        onSubmit={(name) => {
          if (editingCustom) {
            updateCustomCatalogItem(editingCustom.id, name);
          } else {
            const created = addCustomCatalogItem(name);
            setForm((current) => ({ ...current, selection: { type: 'custom', id: created.id } }));
          }
        }}
      />

      <Dialog
        nested
        open={Boolean(deletingCustom)}
        title={t('custom.delete.title')}
        description={deletingCustom ? t('custom.delete.desc', { name: deletingCustom.name }) : undefined}
        onClose={() => setDeletingCustom(null)}
      >
        <div className="flex justify-end gap-2">
          <button type="button" className="btn-secondary" onClick={() => setDeletingCustom(null)}>
            {t('common.cancel')}
          </button>
          <button
            type="button"
            className="btn-danger"
            onClick={() => {
              if (!deletingCustom) return;
              if (form.selection?.type === 'custom' && form.selection.id === deletingCustom.id) {
                setForm((current) => ({ ...current, selection: { type: 'predefined', key: 'engine_oil' } }));
              }
              deleteCustomCatalogItem(deletingCustom.id);
              setDeletingCustom(null);
            }}
          >
            {t('common.delete')}
          </button>
        </div>
      </Dialog>
    </>
  );
}
