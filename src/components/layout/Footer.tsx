import { Link } from 'react-router-dom';
import { getTranslations } from '../../i18n/translations';
import { useSolarStore } from '../../store/useSolarStore';

/**
 * Footer minimalis (Light & Dark).
 */
export function Footer() {
  const year = new Date().getFullYear();
  const lang = useSolarStore((state) => state.lang);
  const t = getTranslations(lang).footer;

  return (
    <footer className="no-print bg-white dark:bg-[#111114] border-t border-zinc-200 dark:border-zinc-800/90 px-4 py-2 text-[11px] text-zinc-500 shrink-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span>
          &copy; {year}{' '}
          <strong className="text-zinc-800 dark:text-zinc-300 font-medium">SolarSim</strong>
        </span>

        <div className="flex items-center gap-4">
          <Link to="/panduan" className="hover:text-zinc-900 dark:hover:text-zinc-200 transition">
            {t.guide}
          </Link>
          <Link to="/guide" className="hover:text-zinc-900 dark:hover:text-zinc-200 transition">
            {t.formulas}
          </Link>
          <Link to="/about" className="hover:text-zinc-900 dark:hover:text-zinc-200 transition">
            {t.about}
          </Link>
        </div>
      </div>
    </footer>
  );
}
