import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';
import { cn } from '@/lib/utils';

interface DialogProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  nested?: boolean;
}

export function Dialog({ open, title, description, onClose, children, nested = false }: DialogProps) {
  const { t } = useLocale();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 flex items-end justify-center p-0 sm:items-center sm:p-4',
        nested ? 'z-[60]' : 'z-50',
      )}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-label={t('common.close')}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className="panel relative z-10 flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl sm:max-w-lg sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h2 id="dialog-title" className="text-lg font-semibold tracking-tight">
              {title}
            </h2>
            {description ? <p className="mt-1 text-sm text-fg-muted">{description}</p> : null}
          </div>
          <button type="button" className="btn-ghost size-9 p-0" aria-label={t('common.close')} onClick={onClose}>
            <X className="size-4" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>
  );
}
