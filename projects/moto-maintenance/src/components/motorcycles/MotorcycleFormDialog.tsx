import { useEffect, useState, type FormEvent } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { useLocale } from '@/context/LocaleContext';
import type { Motorcycle, MotorcycleInput } from '@/types/maintenance';

interface MotorcycleFormDialogProps {
  open: boolean;
  motorcycle?: Motorcycle | null;
  onClose: () => void;
  onSubmit: (input: MotorcycleInput) => void;
}

const emptyForm = {
  manufacturer: '',
  model: '',
  year: String(new Date().getFullYear()),
  currentMileage: '0',
};

export function MotorcycleFormDialog({
  open,
  motorcycle,
  onClose,
  onSubmit,
}: MotorcycleFormDialogProps) {
  const { t } = useLocale();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    if (motorcycle) {
      setForm({
        manufacturer: motorcycle.manufacturer,
        model: motorcycle.model,
        year: String(motorcycle.year),
        currentMileage: String(motorcycle.currentMileage),
      });
    } else {
      setForm(emptyForm);
    }
  }, [open, motorcycle]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const manufacturer = form.manufacturer.trim();
    const model = form.model.trim();
    const year = Number(form.year);
    const currentMileage = Number(form.currentMileage);
    const maxYear = new Date().getFullYear() + 1;

    if (!manufacturer || !model) {
      setError(t('bike.error.required'));
      return;
    }
    if (!Number.isInteger(year) || year < 1900 || year > maxYear) {
      setError(t('bike.error.year', { max: maxYear }));
      return;
    }
    if (!Number.isFinite(currentMileage) || currentMileage < 0) {
      setError(t('bike.error.mileage'));
      return;
    }

    onSubmit({
      manufacturer,
      model,
      year,
      currentMileage: Math.round(currentMileage),
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      title={motorcycle ? t('bike.edit.title') : t('bike.add.title')}
      description={t('bike.form.desc')}
      onClose={onClose}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="field-label" htmlFor="manufacturer">
            {t('bike.manufacturer')}
          </label>
          <input
            id="manufacturer"
            className="field-input"
            value={form.manufacturer}
            onChange={(event) => setForm((current) => ({ ...current, manufacturer: event.target.value }))}
            placeholder="Honda"
            autoFocus
          />
        </div>
        <div>
          <label className="field-label" htmlFor="model">
            {t('bike.model')}
          </label>
          <input
            id="model"
            className="field-input"
            value={form.model}
            onChange={(event) => setForm((current) => ({ ...current, model: event.target.value }))}
            placeholder="Shadow VT600C"
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="year">
              {t('bike.year')}
            </label>
            <input
              id="year"
              className="field-input"
              type="number"
              inputMode="numeric"
              value={form.year}
              onChange={(event) => setForm((current) => ({ ...current, year: event.target.value }))}
            />
          </div>
          <div>
            <label className="field-label" htmlFor="currentMileage">
              {t('bike.mileage')}
            </label>
            <input
              id="currentMileage"
              className="field-input"
              type="number"
              inputMode="numeric"
              min={0}
              value={form.currentMileage}
              onChange={(event) => setForm((current) => ({ ...current, currentMileage: event.target.value }))}
            />
          </div>
        </div>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button type="submit" className="btn-primary">
            {motorcycle ? t('bike.save') : t('bike.add.submit')}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
