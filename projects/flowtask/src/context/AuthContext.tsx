import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AuthError, Session, User } from '@supabase/supabase-js'

import { appUrl, supabase } from '@/lib/supabase'

export type SignUpResult = 'verify' | 'signed-in'
export type VerificationMode = 'verify' | 'unverified'

interface AuthContextValue {
  user: User | null
  session: Session | null
  loading: boolean
  emailConfirmed: boolean
  recovery: boolean
  pendingEmail: string | null
  verificationMode: VerificationMode | null
  authError: string | null
  clearAuthError: () => void
  setPendingEmail: (email: string | null) => void
  clearEmailGate: () => void
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<SignUpResult>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  resendVerification: (email: string) => Promise<void>
  clearRecovery: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function isUnverifiedError(error: unknown): boolean {
  return error instanceof Error && error.message.includes('Email not confirmed')
}

function formatAuthError(error: AuthError | Error): string {
  const message = error.message
  if (message.includes('Invalid login credentials')) {
    return 'Email or password is incorrect.'
  }
  if (message.includes('Email not confirmed')) {
    return 'Please verify your email before signing in.'
  }
  if (message.includes('User already registered')) {
    return 'An account with this email already exists. Try signing in.'
  }
  if (message.includes('Password should be at least')) {
    return 'Password must be at least 6 characters.'
  }
  if (message.includes('For security purposes') || message.includes('only request this after') || message.includes('rate limit')) {
    return 'Please wait a moment before requesting another email.'
  }
  if (message.includes('already been confirmed') || message.includes('already confirmed')) {
    return 'This email is already verified. Try signing in.'
  }
  if (message.includes('Failed to fetch') || message.includes('NetworkError')) {
    return 'Network error. Check your connection and try again.'
  }
  return message
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)
  const [pendingEmail, setPendingEmail] = useState<string | null>(null)
  const [verificationMode, setVerificationMode] = useState<VerificationMode | null>(null)
  const [recovery, setRecovery] = useState(() => window.location.hash.includes('type=recovery'))

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setSession(data.session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession)
      setLoading(false)
      if (event === 'PASSWORD_RECOVERY') setRecovery(true)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const clearAuthError = useCallback(() => setAuthError(null), [])
  const clearEmailGate = useCallback(() => {
    setPendingEmail(null)
    setVerificationMode(null)
  }, [])
  const clearRecovery = useCallback(() => {
    setRecovery(false)
    window.history.replaceState({}, '', `${window.location.pathname}${window.location.search}`)
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    setAuthError(null)
    const trimmed = email.trim()
    const { error } = await supabase.auth.signInWithPassword({ email: trimmed, password })
    if (error) {
      if (error.message.includes('Email not confirmed')) {
        setPendingEmail(trimmed)
        setVerificationMode('unverified')
      }
      setAuthError(formatAuthError(error))
      throw error
    }
  }, [])

  const signUp = useCallback(async (email: string, password: string): Promise<SignUpResult> => {
    setAuthError(null)
    const trimmed = email.trim()
    const { data, error } = await supabase.auth.signUp({
      email: trimmed,
      password,
      options: { emailRedirectTo: appUrl() },
    })
    if (error) {
      setAuthError(formatAuthError(error))
      throw error
    }
    if (data.user && data.user.identities && data.user.identities.length === 0) {
      const exists = new Error('User already registered')
      setAuthError(formatAuthError(exists))
      throw exists
    }
    setPendingEmail(trimmed)
    setVerificationMode('verify')
    if (data.session && !data.user?.email_confirmed_at) {
      await supabase.auth.signOut()
    }
    if (!data.user?.email_confirmed_at) return 'verify'
    return 'signed-in'
  }, [])

  const signOut = useCallback(async () => {
    setAuthError(null)
    const { error } = await supabase.auth.signOut()
    if (error) {
      setAuthError(formatAuthError(error))
      throw error
    }
    setPendingEmail(null)
    setVerificationMode(null)
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    setAuthError(null)
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: appUrl(),
    })
    if (error) {
      setAuthError(formatAuthError(error))
      throw error
    }
  }, [])

  const resendVerification = useCallback(async (email: string) => {
    setAuthError(null)
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email.trim(),
      options: { emailRedirectTo: appUrl() },
    })
    if (error) {
      setAuthError(formatAuthError(error))
      throw error
    }
  }, [])

  const user = session?.user ?? null
  const emailConfirmed = Boolean(user?.email_confirmed_at)

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      emailConfirmed,
      recovery,
      pendingEmail,
      verificationMode,
      authError,
      clearAuthError,
      setPendingEmail,
      clearEmailGate,
      signIn,
      signUp,
      signOut,
      resetPassword,
      resendVerification,
      clearRecovery,
    }),
    [
      user,
      session,
      loading,
      emailConfirmed,
      recovery,
      pendingEmail,
      verificationMode,
      authError,
      clearAuthError,
      clearEmailGate,
      signIn,
      signUp,
      signOut,
      resetPassword,
      resendVerification,
      clearRecovery,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
