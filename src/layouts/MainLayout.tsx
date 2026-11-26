import { Outlet, useLocation } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';

/**
 * MainLayout membungkus seluruh halaman dengan Header dan Footer (Light & Dark).
 */
export function MainLayout() {
  const location = useLocation();
  const isSimulator = location.pathname === '/';

  return (
    <div
      className={
        isSimulator
          ? 'min-h-screen lg:h-screen flex flex-col lg:overflow-hidden bg-zinc-50 dark:bg-[#0c0c0e]'
          : 'min-h-screen flex flex-col bg-zinc-50 dark:bg-[#0c0c0e]'
      }
    >
      <Header />
      <div className={isSimulator ? 'flex-1 flex flex-col lg:overflow-hidden' : 'flex-1'}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
