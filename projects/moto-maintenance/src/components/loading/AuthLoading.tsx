import { useLocale } from '@/context/LocaleContext';

export function AuthLoading() {
  const { t } = useLocale();
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      <p className="text-sm text-fg-muted">{t('auth.loading')}</p>
    </div>
  );
}
