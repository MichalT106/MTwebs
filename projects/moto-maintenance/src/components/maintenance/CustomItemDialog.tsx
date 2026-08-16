import { useEffect, useState, type FormEvent } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { useLocale } from '@/context/LocaleContext';
import type { CustomCatalogItem } from '@/types/maintenance';

interface CustomItemDialogProps {
  open: boolean;
  item?: CustomCatalogItem | null;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

export function CustomItemDialog({ open, item, onClose, onSubmit }: CustomItemDialogProps) {
  const { t } = useLocale();
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setName(item?.name ?? '');
  }, [open, item]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError(t('custom.error.name'));
      return;
    }
    onSubmit(trimmed);
    onClose();
  };

  return (
    <Dialog
      nested
      open={open}
      title={item ? t('custom.title.edit') : t('custom.title.add')}
      onClose={onClose}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="field-label" htmlFor="customItemName">
            {t('custom.name')}
          </label>
          <input
            id="customItemName"
            className="field-input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={t('custom.placeholder')}
            autoFocus
          />
        </div>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button type="submit" className="btn-primary">
            {item ? t('custom.save') : t('custom.add')}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
