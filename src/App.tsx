import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/AppLayout';
import { HashScrollHandler } from './components/HashScrollHandler';
import { ROUTER_BASENAME } from './lib/assetPath';
import HomePage from './pages/HomePage';

const BuildMindPage = lazy(() => import('./pages/experiences/BuildMindPage'));
const WebastoPage = lazy(() => import('./pages/experiences/WebastoPage'));
const GameDaysPage = lazy(() => import('./pages/projects/GameDaysPage'));
const CarInsightPage = lazy(() => import('./pages/projects/CarInsightPage'));
const DiplomaThesisPage = lazy(() => import('./pages/projects/DiplomaThesisPage'));

function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes location={location}>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="experiences/BUILDMIND" element={<BuildMindPage />} />
          <Route path="experiences/WEBASTO" element={<WebastoPage />} />
          <Route path="projects/GAMEDAYS" element={<GameDaysPage />} />
          <Route path="projects/CARINSIGHT" element={<CarInsightPage />} />
          <Route path="projects/DIPLOMA_THESIS" element={<DiplomaThesisPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <AppProvider>
        <BrowserRouter basename={ROUTER_BASENAME}>
          <HashScrollHandler />
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </HelmetProvider>
  );
}
