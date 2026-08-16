import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, Lock, Mail, Sparkles } from 'lucide-react'

import { VerifyEmailCard } from '@/components/auth/VerifyEmailCard'
import { PasswordRecoveryForm } from '@/components/auth/PasswordRecoveryForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { isUnverifiedError, useAuth } from '@/context/AuthContext'
import { authT, readAuthLang, writeAuthLang, type AuthLang } from '@/i18n/auth'
import { cn } from '@/lib/utils'

type AuthMode = 'login' | 'signup' | 'reset' | 'verify' | 'unverified'

export function AuthPage({ initialMode = 'login' }: { initialMode?: AuthMode }) {
  const { signIn, signUp, resetPassword, authError, clearAuthError, pendingEmail, setPendingEmail, user } =
    useAuth()
  const [lang, setLang] = useState<AuthLang>(readAuthLang)
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [email, setEmail] = useState(pendingEmail ?? user?.email ?? '')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [localMessage, setLocalMessage] = useState<string | null>(null)

  const switchLang = (next: AuthLang) => {
    setLang(next)
    writeAuthLang(next)
  }

  const switchMode = (next: AuthMode) => {
    setMode(next)
    setResetSent(false)
    setLocalMessage(null)
    clearAuthError()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalMessage(null)
    clearAuthError()

    const trimmed = email.trim()
    if (!trimmed) {
      setLocalMessage('Enter your email address.')
      return
    }

    if (mode === 'reset') {
      setSubmitting(true)
      try {
        await resetPassword(trimmed)
        setResetSent(true)
        setLocalMessage('Check your inbox for a password reset link.')
      } catch {
        // authError set in context
      } finally {
        setSubmitting(false)
      }
      return
    }

    if (password.length < 6) {
      setLocalMessage('Password must be at least 6 characters.')
      return
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setLocalMessage('Passwords do not match.')
      return
    }

    setSubmitting(true)
    try {
      if (mode === 'login') {
        await signIn(trimmed, password)
      } else {
        const result = await signUp(trimmed, password)
        if (result === 'verify') {
          setPendingEmail(trimmed)
          switchMode('verify')
        }
      }
    } catch (error) {
      if (isUnverifiedError(error)) {
        setPendingEmail(trimmed)
        switchMode('unverified')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const title =
    mode === 'login' ? 'Welcome back' : mode === 'signup' ? 'Create your account' : 'Reset password'

  const description =
    mode === 'login'
      ? 'Sign in to sync tasks across your devices.'
      : mode === 'signup'
        ? 'Start organizing with cloud sync and secure storage.'
        : 'We will email you a link to choose a new password.'

  const verifyEmail = pendingEmail ?? user?.email ?? email

  return (
    <div className="mesh-gradient relative flex min-h-dvh items-center justify-center overflow-hidden p-4 sm:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_500px_at_50%_-5%,hsl(var(--primary)/0.18),transparent)]" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-primary/30 to-accent/20 ring-1 ring-border/60 shadow-lg shadow-primary/15">
            <Sparkles className="size-7 text-primary" aria-hidden />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Flowtask</h1>
            <p className="text-sm text-muted-foreground">Tasks in flow, everywhere you are.</p>
          </div>
          <div className="flex overflow-hidden rounded-xl border border-border/60 bg-background/40" role="group" aria-label="Language">
            {(['en', 'sk'] as const).map((code) => (
              <button
                key={code}
                type="button"
                className={cn(
                  'px-2.5 py-1 text-xs font-semibold uppercase',
                  lang === code ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
                onClick={() => switchLang(code)}
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        <PasswordRecoveryForm />

        {mode === 'verify' || mode === 'unverified' ? (
          <VerifyEmailCard
            variant={mode}
            email={verifyEmail}
            lang={lang}
            onBack={() => switchMode('login')}
          />
        ) : (
          <Card className="glass-panel rounded-3xl border-border/50 shadow-2xl shadow-black/10">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              {mode !== 'reset' && (
                <div className="mb-6 flex rounded-xl bg-muted/50 p-1">
                  <button
                    type="button"
                    className={cn(
                      'flex-1 rounded-lg py-2 text-sm font-medium transition',
                      mode === 'login'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                    onClick={() => switchMode('login')}
                  >
                    Sign in
                  </button>
                  <button
                    type="button"
                    className={cn(
                      'flex-1 rounded-lg py-2 text-sm font-medium transition',
                      mode === 'signup'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                    onClick={() => switchMode('signup')}
                  >
                    Sign up
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="auth-email">Email</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="auth-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="h-11 rounded-xl pl-10"
                      disabled={submitting}
                    />
                  </div>
                </div>

                {mode !== 'reset' && (
                  <div className="grid gap-2">
                    <Label htmlFor="auth-password">Password</Label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="auth-password"
                        type="password"
                        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="h-11 rounded-xl pl-10"
                        disabled={submitting}
                      />
                    </div>
                  </div>
                )}

                {mode === 'signup' && (
                  <div className="grid gap-2">
                    <Label htmlFor="auth-confirm">Confirm password</Label>
                    <Input
                      id="auth-confirm"
                      type="password"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-11 rounded-xl"
                      disabled={submitting}
                    />
                  </div>
                )}

                <AnimatePresence mode="wait">
                  {(authError || localMessage) && (
                    <motion.p
                      key={authError ?? localMessage ?? ''}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={cn(
                        'rounded-xl px-3 py-2 text-sm',
                        authError ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-foreground',
                      )}
                      role="alert"
                    >
                      {authError ?? localMessage}
                    </motion.p>
                  )}
                </AnimatePresence>

                <Button type="submit" className="h-11 rounded-xl" disabled={submitting || resetSent}>
                  {submitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Please wait…
                    </>
                  ) : mode === 'login' ? (
                    'Sign in'
                  ) : mode === 'signup' ? (
                    'Create account'
                  ) : (
                    'Send reset link'
                  )}
                </Button>
              </form>

              <div className="mt-6 flex flex-col gap-2 text-center text-sm">
                {mode === 'login' && (
                  <button
                    type="button"
                    className="text-muted-foreground transition hover:text-primary"
                    onClick={() => switchMode('reset')}
                  >
                    Forgot your password?
                  </button>
                )}
                {mode === 'reset' && (
                  <button
                    type="button"
                    className="text-muted-foreground transition hover:text-primary"
                    onClick={() => switchMode('login')}
                  >
                    {authT(lang, 'back')}
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  )
}
