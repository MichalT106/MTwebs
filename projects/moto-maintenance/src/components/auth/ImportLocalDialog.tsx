import { useState } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { useLocale } from '@/context/LocaleContext';
import { importLocalDataToSupabase, markImportedForUser } from '@/lib/api/import-local';

interface ImportLocalDialogProps {
  open: boolean;
  userId: string;
  onComplete: () => void;
  onDismiss: () => void;
}

export function ImportLocalDialog({ open, userId, onComplete, onDismiss }: ImportLocalDialogProps) {
  const { t } = useLocale();
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImport = async () => {
    setImporting(true);
    setError(null);
    try {
      await importLocalDataToSupabase(userId);
      onComplete();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t('import.error'));
    } finally {
      setImporting(false);
    }
  };

  const handleSkip = () => {
    markImportedForUser(userId);
    onDismiss();
  };

  return (
    <Dialog open={open} title={t('import.title')} description={t('import.body')} onClose={() => !importing && handleSkip()}>
      {error ? <p className="mb-4 text-sm text-danger">{error}</p> : null}
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" className="btn-secondary" disabled={importing} onClick={handleSkip}>
          {t('import.skip')}
        </button>
        <button type="button" className="btn-primary" disabled={importing} onClick={() => void handleImport()}>
          {t('import.confirm')}
        </button>
      </div>
    </Dialog>
  );
}
