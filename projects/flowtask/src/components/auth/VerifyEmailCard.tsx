import { useEffect, useState } from 'react'
import { Loader2, Mail } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'
import { authT, type AuthLang } from '@/i18n/auth'

const RESEND_COOLDOWN_MS = 45_000

function localizeAuthError(lang: AuthLang, message: string | null): string | null {
  if (!message) return null
  if (message.includes('wait a moment') || message.includes('rate limit')) return authT(lang, 'errorRate')
  if (message.includes('already verified') || message.includes('already confirmed')) {
    return authT(lang, 'errorAlreadyVerified')
  }
  if (message.includes('Network error') || message.includes('Failed to fetch')) return authT(lang, 'errorNetwork')
  if (message.includes('already exists')) return authT(lang, 'errorExists')
  if (message.includes('verify your email')) return authT(lang, 'errorUnverified')
  return message
}

interface VerifyEmailCardProps {
  variant: 'verify' | 'unverified'
  email: string
  lang: AuthLang
  onBack: () => void
}

export function VerifyEmailCard({ variant, email, lang, onBack }: VerifyEmailCardProps) {
  const { resendVerification, authError, clearAuthError, signOut, user, clearEmailGate } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [cooldownUntil, setCooldownUntil] = useState(0)
  const [remaining, setRemaining] = useState(0)

  useEffect(() => {
    if (cooldownUntil <= 0) return
    const timer = window.setInterval(() => {
      setRemaining(Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000)))
    }, 250)
    return () => window.clearInterval(timer)
  }, [cooldownUntil])

  const canResend = remaining === 0 && !submitting

  const handleResend = async () => {
    if (!canResend || !email) return
    setMessage(null)
    clearAuthError()
    setSubmitting(true)
    try {
      await resendVerification(email)
      setMessage(authT(lang, 'resent'))
      setCooldownUntil(Date.now() + RESEND_COOLDOWN_MS)
      setRemaining(Math.ceil(RESEND_COOLDOWN_MS / 1000))
    } catch {
      // authError
    } finally {
      setSubmitting(false)
    }
  }

  const handleBack = async () => {
    if (user) await signOut()
    clearEmailGate()
    onBack()
  }

  return (
    <Card className="glass-panel rounded-3xl border-border/50 shadow-2xl shadow-black/10">
      <CardHeader className="space-y-1 pb-4">
        <div className="mb-2 grid size-12 place-items-center rounded-2xl bg-primary/15 text-primary">
          <Mail className="size-5" aria-hidden />
        </div>
        <CardTitle className="text-xl">
          {variant === 'verify' ? authT(lang, 'checkTitle') : authT(lang, 'unverifiedTitle')}
        </CardTitle>
        <CardDescription>
          {variant === 'verify'
            ? authT(lang, 'checkBody', { email: email || '—' })
            : authT(lang, 'unverifiedBody')}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {email ? <p className="text-sm text-muted-foreground">{authT(lang, 'sentTo', { email })}</p> : null}
        {localizeAuthError(lang, authError) ? (
          <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
            {localizeAuthError(lang, authError)}
          </p>
        ) : null}
        {message ? (
          <p className="rounded-xl bg-primary/10 px-3 py-2 text-sm" role="status">
            {message}
          </p>
        ) : null}
        <Button type="button" className="h-11 rounded-xl" disabled={!canResend} onClick={() => void handleResend()}>
          {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
          {remaining > 0 ? authT(lang, 'resendWait', { seconds: remaining }) : authT(lang, 'resend')}
        </Button>
        <Button type="button" variant="ghost" className="h-11 rounded-xl" onClick={() => void handleBack()}>
          {authT(lang, 'back')}
        </Button>
      </CardContent>
    </Card>
  )
}
