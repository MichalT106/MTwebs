import { Link } from 'react-router-dom';
import { LogOut, Moon, Sun } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLocale } from '@/context/LocaleContext';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

export function AppHeader() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLocale();
  const { user, emailConfirmed, signOut } = useAuth();
  const showAccount = Boolean(user && emailConfirmed);

  return (
    <header className="nav-glass sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link to="/" className="min-w-0">
          <p className="truncate text-sm font-bold tracking-tight sm:text-base">
            {language === 'sk' ? (
              <>
                Údržba <span className="text-accent">motorky</span>
              </>
            ) : (
              <>
                Motorcycle <span className="text-accent">Maintenance</span>
              </>
            )}
          </p>
          <p className="hidden text-xs text-fg-muted sm:block">{t('app.tagline')}</p>
        </Link>
        <div className="flex items-center gap-2">
          {showAccount ? (
            <div className="hidden min-w-0 text-right sm:block">
              <p className="truncate text-xs font-medium">{user?.email}</p>
              <p className="text-[0.6875rem] text-fg-muted">{t('auth.signedIn')}</p>
            </div>
          ) : null}
          {showAccount ? (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => void signOut()}
              aria-label={t('auth.logout')}
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">{t('auth.logout')}</span>
            </button>
          ) : (
            <a href="/" className="btn-ghost hidden text-xs sm:inline-flex">
              {t('app.mtwebs')}
            </a>
          )}
          <div
            className="flex overflow-hidden rounded-xl border border-border bg-surface-raised"
            role="group"
            aria-label={t('lang.switch')}
          >
            {(['en', 'sk'] as const).map((code) => (
              <button
                key={code}
                type="button"
                className={cn(
                  'px-2.5 py-1.5 text-xs font-semibold',
                  language === code ? 'bg-accent text-white' : 'text-fg-muted hover:text-fg',
                )}
                onClick={() => setLanguage(code)}
                aria-pressed={language === code}
              >
                {t(code === 'en' ? 'lang.en' : 'lang.sk')}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="btn-secondary size-10 p-0"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? t('theme.toLight') : t('theme.toDark')}
          >
            {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
