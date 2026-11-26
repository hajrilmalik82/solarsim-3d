import { FileText, Moon, Sun } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FACTORY_PRESET, RESIDENTIAL_PRESET } from '../../constants/presets';
import { getTranslations } from '../../i18n/translations';
import { useSolarStore } from '../../store/useSolarStore';

/**
 * Header minimalis gaya CAD (Light & Dark) + switcher bahasa ID / EN & toggle tema.
 */
export function Header() {
  const location = useLocation();
  const isSimulatorPage = location.pathname === '/';

  const lang = useSolarStore((state) => state.lang);
  const setLang = useSolarStore((state) => state.setLang);
  const theme = useSolarStore((state) => state.theme);
  const toggleTheme = useSolarStore((state) => state.toggleTheme);
  const applyGlobalPreset = useSolarStore((state) => state.applyGlobalPreset);
  const setReportModalOpen = useSolarStore((state) => state.setReportModalOpen);

  const t = getTranslations(lang).nav;

  const navItems = [
    { to: '/', label: t.simulator },
    { to: '/panduan', label: t.guide },
    { to: '/guide', label: t.formulas },
    { to: '/about', label: t.about },
  ];

  return (
    <header className="no-print bg-white dark:bg-[#111114] border-b border-zinc-200 dark:border-zinc-800/90 px-4 h-12 flex items-center justify-between gap-3 z-20 shrink-0">
      {/* Kiri: Brand & Navigasi */}
      <div className="flex items-center gap-5">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="w-2.5 h-2.5 bg-amber-500 rounded-[2px] inline-block" />
          <span className="font-semibold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">
            SolarSim <span className="font-mono text-xs text-zinc-400 dark:text-zinc-500">3D</span>
          </span>
        </Link>

        <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />

        <nav aria-label="Main Navigation" className="flex items-center gap-1">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `px-2.5 py-1 rounded text-xs font-medium transition ${
                  isActive
                    ? 'text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800/90'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Kanan: Preset Cepat, Ringkasan, Tema & Bahasa */}
      <div className="flex items-center gap-2">
        {isSimulatorPage && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => applyGlobalPreset(RESIDENTIAL_PRESET)}
              className="hidden md:inline-flex px-2.5 py-1 rounded text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200/80 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition cursor-pointer"
            >
              {t.presetHome}
            </button>

            <button
              type="button"
              onClick={() => applyGlobalPreset(FACTORY_PRESET)}
              className="hidden md:inline-flex px-2.5 py-1 rounded text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200/80 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition cursor-pointer"
            >
              {t.presetFactory}
            </button>

            <button
              type="button"
              onClick={() => setReportModalOpen(true)}
              className="px-3 py-1 rounded text-xs font-semibold bg-amber-500 hover:bg-amber-600 dark:hover:bg-amber-400 text-white dark:text-zinc-950 transition flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{t.summary}</span>
            </button>
          </div>
        )}

        {/* Toggle Tema Terang / Gelap */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
          title={theme === 'light' ? 'Mode Gelap / Dark Mode' : 'Mode Terang / Light Mode'}
          className="p-1.5 rounded bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200/80 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 transition cursor-pointer"
        >
          {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
        </button>

        {/* Switcher Bahasa ID / EN */}
        <div
          role="group"
          aria-label="Language switcher"
          className="inline-flex bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded p-0.5 text-[11px] font-mono"
        >
          <button
            type="button"
            onClick={() => setLang('id')}
            className={`px-1.5 py-0.5 rounded-[2px] font-semibold transition cursor-pointer ${
              lang === 'id'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            ID
          </button>
          <button
            type="button"
            onClick={() => setLang('en')}
            className={`px-1.5 py-0.5 rounded-[2px] font-semibold transition cursor-pointer ${
              lang === 'en'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            EN
          </button>
        </div>
      </div>
    </header>
  );
}
