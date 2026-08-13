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

import { supabase } from '@/lib/supabase'

interface AuthContextValue {
  user: User | null
  session: Session | null
  loading: boolean
  authError: string | null
  clearAuthError: () => void
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function formatAuthError(error: AuthError | Error): string {
  const message = error.message
  if (message.includes('Invalid login credentials')) {
    return 'Email or password is incorrect.'
  }
  if (message.includes('User already registered')) {
    return 'An account with this email already exists. Try signing in.'
  }
  if (message.includes('Password should be at least')) {
    return 'Password must be at least 6 characters.'
  }
  return message
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setSession(data.session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const clearAuthError = useCallback(() => setAuthError(null), [])

  const signIn = useCallback(async (email: string, password: string) => {
    setAuthError(null)
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    if (error) {
      setAuthError(formatAuthError(error))
      throw error
    }
  }, [])

  const signUp = useCallback(async (email: string, password: string) => {
    setAuthError(null)
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    })
    if (error) {
      setAuthError(formatAuthError(error))
      throw error
    }
  }, [])

  const signOut = useCallback(async () => {
    setAuthError(null)
    const { error } = await supabase.auth.signOut()
    if (error) {
      setAuthError(formatAuthError(error))
      throw error
    }
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    setAuthError(null)
    const redirectTo = `${window.location.origin}${window.location.pathname}`
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo,
    })
    if (error) {
      setAuthError(formatAuthError(error))
      throw error
    }
  }, [])

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      session,
      loading,
      authError,
      clearAuthError,
      signIn,
      signUp,
      signOut,
      resetPassword,
    }),
    [session, loading, authError, clearAuthError, signIn, signUp, signOut, resetPassword],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
