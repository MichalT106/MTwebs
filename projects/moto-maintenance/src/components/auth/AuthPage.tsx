import { useEffect, useState, type FormEvent } from 'react';
import { Loader2, Mail } from 'lucide-react';
import { isUnverifiedError, useAuth } from '@/context/AuthContext';
import { useLocale } from '@/context/LocaleContext';
import type { TranslationKey } from '@/i18n/translations';

type AuthMode = 'login' | 'register' | 'reset' | 'verify' | 'unverified';

const RESEND_COOLDOWN_MS = 45_000;

function isTranslationKey(value: string): value is TranslationKey {
  return value.startsWith('auth.');
}

export function AuthPage({ initialMode = 'login' }: { initialMode?: AuthMode }) {
  const { t } = useLocale();
  const {
    signIn,
    signUp,
    resetPassword,
    resendVerification,
    authError,
    clearAuthError,
    pendingEmail,
    setPendingEmail,
    clearEmailGate,
    signOut,
    user,
  } = useAuth();

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState(pendingEmail ?? '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localMessage, setLocalMessage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (cooldownUntil <= 0) return;
    const timer = window.setInterval(() => {
      setRemaining(Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000)));
    }, 250);
    return () => window.clearInterval(timer);
  }, [cooldownUntil]);

  const switchMode = (next: AuthMode) => {
    setMode(next);
    setLocalMessage(null);
    setLocalError(null);
    clearAuthError();
  };

  const displayError = localError ?? (authError && isTranslationKey(authError) ? t(authError) : authError);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLocalMessage(null);
    setLocalError(null);
    clearAuthError();

    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setLocalError(t('auth.error.invalidEmail'));
      return;
    }

    if (mode === 'reset') {
      setSubmitting(true);
      try {
        await resetPassword(trimmed);
        setLocalMessage(t('auth.reset.sent'));
      } catch {
        // authError
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (password.length < 6) {
      setLocalError(t('auth.error.passwordLength'));
      return;
    }

    if (mode === 'register' && password !== confirmPassword) {
      setLocalError(t('auth.error.passwordMatch'));
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'login') {
        await signIn(trimmed, password);
      } else {
        const result = await signUp(trimmed, password);
        if (result === 'verify') {
          setPendingEmail(trimmed);
          switchMode('verify');
        }
      }
    } catch (error) {
      if (isUnverifiedError(error)) {
        setPendingEmail(trimmed);
        switchMode('unverified');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    const target = (pendingEmail ?? user?.email ?? email).trim();
    if (!target || remaining > 0) return;
    setSubmitting(true);
    setLocalMessage(null);
    clearAuthError();
    try {
      await resendVerification(target);
      setLocalMessage(t('auth.verify.resent'));
      setCooldownUntil(Date.now() + RESEND_COOLDOWN_MS);
      setRemaining(Math.ceil(RESEND_COOLDOWN_MS / 1000));
    } catch {
      // authError
    } finally {
      setSubmitting(false);
    }
  };

  if (mode === 'verify' || mode === 'unverified') {
    const target = pendingEmail ?? user?.email ?? email;
    return (
      <section className="panel mx-auto max-w-md p-6 sm:p-8">
        <div className="mb-4 grid size-12 place-items-center rounded-2xl bg-accent/15 text-accent">
          <Mail className="size-5" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          {mode === 'verify' ? t('auth.verify.title') : t('auth.unverified.title')}
        </h1>
        <p className="mt-2 text-sm text-fg-muted">
          {mode === 'verify' ? t('auth.verify.body', { email: target || '—' }) : t('auth.unverified.body')}
        </p>
        {target ? <p className="mt-2 text-sm font-medium text-fg">{target}</p> : null}
        {displayError ? <p className="mt-4 text-sm text-danger">{displayError}</p> : null}
        {localMessage ? <p className="mt-4 text-sm text-accent-emerald">{localMessage}</p> : null}
        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            className="btn-primary"
            onClick={() => void handleResend()}
            disabled={submitting || remaining > 0}
          >
            {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
            {remaining > 0 ? t('auth.verify.wait', { seconds: remaining }) : t('auth.verify.resend')}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              void (async () => {
                if (user) await signOut();
                clearEmailGate();
                switchMode('login');
              })();
            }}
          >
            {t('auth.verify.back')}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="panel mx-auto max-w-md p-6 sm:p-8">
      <h1 className="text-2xl font-bold tracking-tight">
        {mode === 'login' ? t('auth.login.title') : mode === 'register' ? t('auth.register.title') : t('auth.reset.title')}
      </h1>
      <p className="mt-2 text-sm text-fg-muted">
        {mode === 'login'
          ? t('auth.login.subtitle')
          : mode === 'register'
            ? t('auth.register.subtitle')
            : t('auth.reset.subtitle')}
      </p>

      {mode !== 'reset' ? (
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            className={mode === 'login' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => switchMode('login')}
          >
            {t('auth.login.submit')}
          </button>
          <button
            type="button"
            className={mode === 'register' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => switchMode('register')}
          >
            {t('auth.register.submit')}
          </button>
        </div>
      ) : null}

      <form className="mt-6 space-y-4" onSubmit={(event) => void handleSubmit(event)}>
        <div>
          <label className="field-label" htmlFor="auth-email">
            {t('auth.email')}
          </label>
          <input
            id="auth-email"
            type="email"
            autoComplete="email"
            className="field-input"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={submitting}
          />
        </div>

        {mode !== 'reset' ? (
          <div>
            <label className="field-label" htmlFor="auth-password">
              {t('auth.password')}
            </label>
            <input
              id="auth-password"
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              className="field-input"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={submitting}
            />
          </div>
        ) : null}

        {mode === 'register' ? (
          <div>
            <label className="field-label" htmlFor="auth-confirm">
              {t('auth.confirmPassword')}
            </label>
            <input
              id="auth-confirm"
              type="password"
              autoComplete="new-password"
              className="field-input"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              disabled={submitting}
            />
          </div>
        ) : null}

        {displayError ? <p className="text-sm text-danger">{displayError}</p> : null}
        {localMessage ? <p className="text-sm text-accent-emerald">{localMessage}</p> : null}

        <button type="submit" className="btn-primary w-full" disabled={submitting}>
          {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
          {mode === 'login'
            ? t('auth.login.submit')
            : mode === 'register'
              ? t('auth.register.submit')
              : t('auth.reset.submit')}
        </button>
      </form>

      <div className="mt-5 text-center text-sm">
        {mode === 'login' ? (
          <button type="button" className="text-fg-muted hover:text-accent" onClick={() => switchMode('reset')}>
            {t('auth.forgot')}
          </button>
        ) : (
          <button type="button" className="text-fg-muted hover:text-accent" onClick={() => switchMode('login')}>
            {t('auth.verify.back')}
          </button>
        )}
      </div>
    </section>
  );
}
