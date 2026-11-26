import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getTranslations } from '../i18n/translations';
import { useSolarStore } from '../store/useSolarStore';

/**
 * Halaman 404 Not Found (Light & Dark, Bilingual ID/EN).
 */
export function NotFoundPage() {
  const lang = useSolarStore((state) => state.lang);
  const t = getTranslations(lang).notFound;

  return (
    <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 space-y-3">
      <div className="font-mono text-5xl font-semibold text-zinc-300 dark:text-zinc-700">404</div>
      <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{t.title}</h1>
      <p className="text-sm text-zinc-500 max-w-md">{t.desc}</p>
      <Link
        to="/"
        className="mt-2 px-3.5 py-1.5 rounded text-xs font-semibold bg-amber-500 hover:bg-amber-600 dark:hover:bg-amber-400 text-white dark:text-zinc-950 transition inline-flex items-center gap-1.5"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        {t.back}
      </Link>
    </main>
  );
}
