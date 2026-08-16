import { useState, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLocale } from '@/context/LocaleContext';
import type { TranslationKey } from '@/i18n/translations';

function isTranslationKey(value: string): value is TranslationKey {
  return value.startsWith('auth.');
}

export function ResetPasswordForm() {
  const { t } = useLocale();
  const { updatePassword, authError, clearAuthError } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const displayError = localError ?? (authError && isTranslationKey(authError) ? t(authError) : authError);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLocalError(null);
    setMessage(null);
    clearAuthError();
    if (password.length < 6) {
      setLocalError(t('auth.error.passwordLength'));
      return;
    }
    if (password !== confirm) {
      setLocalError(t('auth.error.passwordMatch'));
      return;
    }
    setSubmitting(true);
    try {
      await updatePassword(password);
      setMessage(t('auth.reset.updated'));
    } catch {
      // authError
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="panel mx-auto max-w-md p-6 sm:p-8">
      <h1 className="text-2xl font-bold tracking-tight">{t('auth.reset.newTitle')}</h1>
      <p className="mt-2 text-sm text-fg-muted">{t('auth.reset.newSubtitle')}</p>
      <form className="mt-6 space-y-4" onSubmit={(event) => void handleSubmit(event)}>
        <div>
          <label className="field-label" htmlFor="new-password">
            {t('auth.password')}
          </label>
          <input
            id="new-password"
            type="password"
            className="field-input"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={submitting}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="new-confirm">
            {t('auth.confirmPassword')}
          </label>
          <input
            id="new-confirm"
            type="password"
            className="field-input"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            disabled={submitting}
          />
        </div>
        {displayError ? <p className="text-sm text-danger">{displayError}</p> : null}
        {message ? <p className="text-sm text-accent-emerald">{message}</p> : null}
        <button type="submit" className="btn-primary w-full" disabled={submitting}>
          {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
          {t('auth.reset.update')}
        </button>
      </form>
    </section>
  );
}
