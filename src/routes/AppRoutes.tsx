import { Route, Routes } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { AboutPage } from '../pages/AboutPage';
import { GuidePage } from '../pages/GuidePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { SimulatorPage } from '../pages/SimulatorPage';
import { UsageGuidePage } from '../pages/UsageGuidePage';

/**
 * Definisi terpusat seluruh rute aplikasi SolarSim 3D.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<SimulatorPage />} />
        <Route path="/panduan" element={<UsageGuidePage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
