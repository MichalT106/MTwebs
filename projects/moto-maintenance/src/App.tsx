import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthPage } from '@/components/auth/AuthPage';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { AppHeader } from '@/components/layout/AppHeader';
import { SyncBanner } from '@/components/layout/SyncBanner';
import { AuthLoading } from '@/components/loading/AuthLoading';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { LocaleProvider } from '@/context/LocaleContext';
import { MaintenanceProvider } from '@/context/MaintenanceContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { DashboardPage } from '@/pages/DashboardPage';
import { HomePage } from '@/pages/HomePage';

function AppFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh">
      <div className="hero-glow pointer-events-none absolute inset-0" />
      <AppHeader />
      <main className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
    </div>
  );
}

function AppShell() {
  return (
    <AppFrame>
      <SyncBanner />
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="motorcycle/:id" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppFrame>
  );
}

function AppGate() {
  const { loading, user, emailConfirmed, recovery, verificationMode } = useAuth();

  if (loading) {
    return (
      <AppFrame>
        <AuthLoading />
      </AppFrame>
    );
  }

  if (recovery) {
    return (
      <AppFrame>
        <ResetPasswordForm />
      </AppFrame>
    );
  }

  if (!user) {
    return (
      <AppFrame>
        <AuthPage key={verificationMode ?? 'login'} initialMode={verificationMode ?? 'login'} />
      </AppFrame>
    );
  }

  if (!emailConfirmed) {
    return (
      <AppFrame>
        <AuthPage key="unverified" initialMode="unverified" />
      </AppFrame>
    );
  }

  return (
    <MaintenanceProvider>
      <AppShell />
    </MaintenanceProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <AuthProvider>
          <BrowserRouter basename="/moto-maintenance">
            <AppGate />
          </BrowserRouter>
        </AuthProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}
