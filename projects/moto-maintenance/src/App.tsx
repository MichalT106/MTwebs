import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppHeader } from '@/components/layout/AppHeader';
import { LocaleProvider } from '@/context/LocaleContext';
import { MaintenanceProvider } from '@/context/MaintenanceContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { DashboardPage } from '@/pages/DashboardPage';
import { HomePage } from '@/pages/HomePage';

function AppShell() {
  return (
    <div className="relative min-h-dvh">
      <div className="hero-glow pointer-events-none absolute inset-0" />
      <AppHeader />
      <main className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="motorcycle/:id" element={<DashboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <MaintenanceProvider>
          <BrowserRouter basename="/moto-maintenance">
            <AppShell />
          </BrowserRouter>
        </MaintenanceProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}
