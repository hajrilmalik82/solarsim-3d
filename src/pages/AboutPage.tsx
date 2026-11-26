import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSolarStore } from '../store/useSolarStore';

/**
 * Halaman Tentang Proyek ('/about') — Light & Dark, Bilingual ID/EN.
 */
export function AboutPage() {
  const lang = useSolarStore((state) => state.lang);
  const isEn = lang === 'en';

  return (
    <main className="max-w-3xl mx-auto px-5 py-12 space-y-10">
      <header className="space-y-3 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {isEn ? 'Back to Simulator' : 'Kembali ke Simulator'}
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          {isEn ? 'About SolarSim 3D' : 'Tentang SolarSim 3D'}
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {isEn
            ? 'SolarSim 3D is a web-based rooftop solar PV installation simulator designed to help visualize solar panel layouts across roof types in 3D and calculate the impact of ambient temperature on power output.'
            : 'SolarSim 3D adalah alat bantu simulasi pemasangan panel surya (PLTS) atap berbasis web untuk mempermudah tahap pre-survey: mulai dari memvisualisasikan susunan panel di berbagai bentuk atap secara 3D, menghitung dampak suhu lingkungan terhadap output daya.'}
        </p>
      </header>

      <section className="space-y-1.5 text-xs text-zinc-500">
        <div>
          {isEn ? 'Created by ' : 'Dibuat oleh '}
          <strong className="text-zinc-900 dark:text-zinc-200 font-medium">hajrilmalik</strong>
        </div>
        <div>
          {isEn ? 'Contact: ' : 'Kontak: '}
          <a
            href="mailto:hajrilmalik82@gmail.com"
            className="text-zinc-700 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-400 transition underline underline-offset-4"
          >
            hajrilmalik82@gmail.com
          </a>
        </div>
      </section>
    </main>
  );
}
