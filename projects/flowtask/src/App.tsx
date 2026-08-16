import { AuthPage } from '@/components/auth/AuthPage'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { AuthLoadingScreen } from '@/components/loading/AppLoading'
import { AppShell } from '@/components/layout/AppShell'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { TodoProvider } from '@/context/TodoContext'

function AuthenticatedApp() {
  return (
    <TodoProvider>
      <AppShell />
    </TodoProvider>
  )
}

function AppGate() {
  const { user, loading, emailConfirmed, recovery, verificationMode } = useAuth()

  if (loading) {
    return <AuthLoadingScreen />
  }

  if (recovery) {
    return <AuthPage />
  }

  if (!user) {
    return <AuthPage key={verificationMode ?? 'login'} initialMode={verificationMode ?? 'login'} />
  }

  if (!emailConfirmed) {
    return <AuthPage key="unverified" initialMode="unverified" />
  }

  return <AuthenticatedApp />
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppGate />
      </AuthProvider>
    </ErrorBoundary>
  )
}
