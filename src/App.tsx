import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { useSolarStore } from './store/useSolarStore';

/**
 * Root Component Aplikasi SolarSim 3D.
 * Menyinkronkan class 'dark' pada <html> dengan state theme di Zustand.
 */
export function App() {
  const theme = useSolarStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
