import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSolarStore } from '../store/useSolarStore';

/**
 * Halaman Panduan Tata Penggunaan ('/panduan') — Light & Dark, Bilingual ID/EN.
 */
export function UsageGuidePage() {
  const lang = useSolarStore((state) => state.lang);

  if (lang === 'en') {
    return (
      <main className="max-w-3xl mx-auto px-5 py-12 space-y-10">
        <header className="space-y-3 border-b border-zinc-200 dark:border-zinc-800 pb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Simulator
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            SolarSim 3D User Guide
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            A complete walkthrough of every panel, parameter, and workflow to simulate rooftop solar
            PV installations and export technical reports.
          </p>
        </header>

        <div className="space-y-10 text-sm">
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Quick Workflow
            </h2>
            <ol className="space-y-2 text-zinc-600 dark:text-zinc-400 list-decimal pl-5 leading-relaxed">
              <li>
                Select the{' '}
                <strong className="text-zinc-900 dark:text-zinc-200 font-medium">
                  roof type & building dimensions
                </strong>{' '}
                in the Left Panel (or use the{' '}
                <span className="font-mono text-xs text-zinc-900 dark:text-zinc-200">House</span> /{' '}
                <span className="font-mono text-xs text-zinc-900 dark:text-zinc-200">Factory</span>{' '}
                presets in the top bar).
              </li>
              <li>
                Configure{' '}
                <strong className="text-zinc-900 dark:text-zinc-200 font-medium">
                  solar module size & orientation
                </strong>{' '}
                to automatically calculate how many panels fit on the 3D roof.
              </li>
              <li>
                Adjust{' '}
                <strong className="text-zinc-900 dark:text-zinc-200 font-medium">
                  ambient temperature, inverter & battery
                </strong>{' '}
                in the Right Panel (click{' '}
                <span className="font-mono text-xs text-zinc-900 dark:text-zinc-200">Auto Size</span>{' '}
                for instant sizing recommendations).
              </li>
              <li>
                Edit the{' '}
                <strong className="text-zinc-900 dark:text-zinc-200 font-medium">
                  time & temperature schedule
                </strong>{' '}
                in the bottom dock to monitor hourly panel output and battery charging.
              </li>
              <li>
                Click{' '}
                <strong className="text-amber-600 dark:text-amber-400 font-medium">Report</strong>{' '}
                in the top-right header to copy the summary text or print/save as PDF.
              </li>
            </ol>
          </section>

          <section className="space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800/80">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              1. Left Panel — Building, Roof & Solar Panel
            </h2>
            <ul className="space-y-2 text-zinc-600 dark:text-zinc-400 list-disc pl-5 leading-relaxed">
              <li>
                <strong className="text-zinc-900 dark:text-zinc-200 font-medium">Roof Type</strong>{' '}
                — Choose between <em>Flat Roof</em> (concrete slab with tilted mounting rack),{' '}
                <em>Gable Roof</em> (1 or 2 sloped sides), or <em>Warehouse / Factory</em>{' '}
                (wide-span roof with a central maintenance walkway).
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-zinc-200 font-medium">
                  Tilt / Pitch & Setback
                </strong>{' '}
                — Adjusts roof/mounting angles and safety edge margins (setback) to protect
                installers and reduce wind uplift along roof edges.
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-zinc-200 font-medium">
                  Module Presets & Orientation
                </strong>{' '}
                — Switch between 450Wp, 550Wp, and 660Wp modules or enter custom dimensions. Compare{' '}
                <em>Portrait</em> vs <em>Landscape</em> to maximize installed kWp.
              </li>
            </ul>
          </section>

          <section className="space-y-3 pt-6 border-t border-zinc-200 dark:border-zinc-800/80">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              2. 3D Viewport, Compass & Live Clock
            </h2>
            <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400 list-disc pl-5 leading-relaxed">
              <li>
                <strong className="text-zinc-900 dark:text-zinc-200 font-medium">
                  Camera Controls
                </strong>{' '}
                — Drag to orbit 360°, scroll to zoom, right-click drag to pan, or use the quick{' '}
                <span className="font-mono text-xs text-zinc-900 dark:text-zinc-200">
                  Iso / Top / Inverter
                </span>{' '}
                buttons.
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-zinc-200 font-medium">
                  Real-Time Compass (N/E/S/W)
                </strong>{' '}
                — Rotates live with your 3D camera so you always know East (sunrise) and West
                (sunset).
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-zinc-200 font-medium">
                  Live Clock & Temperature (06:00 – 18:00)
                </strong>{' '}
                — Moves the 3D sun from East to West while dynamically updating sky lighting,
                ambient temperature, and shadows throughout the day.
              </li>
            </ul>
          </section>

          <section className="space-y-3 pt-6 border-t border-zinc-200 dark:border-zinc-800/80">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              3. Right Panel — Temperature, Inverter & Battery
            </h2>
            <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400 list-disc pl-5 leading-relaxed">
              <li>
                <strong className="text-zinc-900 dark:text-zinc-200 font-medium">
                  Thermal Derating
                </strong>{' '}
                — Solar panels generate power from light, not heat. Higher cell temperatures above
                25°C (STC) reduce output voltage according to the temperature coefficient (default
                -0.35%/°C).
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-zinc-200 font-medium">
                  Inverter DC : AC Ratio
                </strong>{' '}
                — Ideal range is{' '}
                <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400">
                  0.85 – 1.25
                </span>
                . Above 1.25 indicates potential clipping during peak noon irradiance.
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-zinc-200 font-medium">
                  Battery Bank & DoD
                </strong>{' '}
                — Calculates usable energy based on Depth of Discharge (80–90% LiFePO4, 50%
                Lead-Acid) and estimates backup duration for your critical load.
              </li>
            </ul>
          </section>

          <section className="space-y-3 pt-6 border-t border-zinc-200 dark:border-zinc-800/80">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              4. Live Yield & Battery Chart (Bottom Dock)
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Customize multiple time slots with different temperatures (morning, noon, afternoon).
              In{' '}
              <strong className="text-zinc-900 dark:text-zinc-200 font-medium">Live Clock</strong>{' '}
              mode, amber bars (hourly panel yield) and the green line (battery storage) animate in
              sync with the running clock. Switch to{' '}
              <strong className="text-zinc-900 dark:text-zinc-200 font-medium">Manual</strong> mode
              to inspect the full day at once, and hover any bar for hourly details.
            </p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-5 py-12 space-y-10">
      <header className="space-y-3 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Kembali ke Simulator
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Panduan Penggunaan SolarSim 3D
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Panduan lengkap fungsi setiap panel, parameter, dan langkah kerja untuk mensimulasikan
          pemasangan PLTS atap dari awal hingga mencetak laporan.
        </p>
      </header>

      <div className="space-y-10 text-sm">
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Alur Kerja Singkat
          </h2>
          <ol className="space-y-2 text-zinc-600 dark:text-zinc-400 list-decimal pl-5 leading-relaxed">
            <li>
              Tentukan{' '}
              <strong className="text-zinc-900 dark:text-zinc-200 font-medium">
                bentuk atap & ukuran bangunan
              </strong>{' '}
              di Panel Kiri (atau pakai tombol preset{' '}
              <span className="font-mono text-xs text-zinc-900 dark:text-zinc-200">Rumah</span> /{' '}
              <span className="font-mono text-xs text-zinc-900 dark:text-zinc-200">Pabrik</span> di
              header atas).
            </li>
            <li>
              Pilih{' '}
              <strong className="text-zinc-900 dark:text-zinc-200 font-medium">
                ukuran & orientasi panel surya
              </strong>{' '}
              untuk melihat berapa banyak modul yang muat secara otomatis di atap 3D.
            </li>
            <li>
              Atur{' '}
              <strong className="text-zinc-900 dark:text-zinc-200 font-medium">
                suhu lingkungan, inverter, & baterai
              </strong>{' '}
              di Panel Kanan (bisa klik{' '}
              <span className="font-mono text-xs text-zinc-900 dark:text-zinc-200">
                Auto Ukuran
              </span>{' '}
              untuk rekomendasi cepat).
            </li>
            <li>
              Sesuaikan{' '}
              <strong className="text-zinc-900 dark:text-zinc-200 font-medium">
                jadwal waktu & suhu harian
              </strong>{' '}
              di panel bawah untuk memantau grafik produksi panel dan pengisian baterai per jam.
            </li>
            <li>
              Klik{' '}
              <strong className="text-amber-600 dark:text-amber-400 font-medium">Ringkasan</strong>{' '}
              di pojok kanan atas untuk menyalin teks laporan atau mencetaknya ke PDF.
            </li>
          </ol>
        </section>

        <section className="space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800/80">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            1. Panel Kiri — Bangunan, Atap & Panel Surya
          </h2>
          <ul className="space-y-2 text-zinc-600 dark:text-zinc-400 list-disc pl-5 leading-relaxed">
            <li>
              <strong className="text-zinc-900 dark:text-zinc-200 font-medium">Bentuk Atap</strong>{' '}
              — Pilih antara <em>1 Atap Datar</em> (dak beton + tilt rack), <em>2 Atap Pelana</em>{' '}
              (1 atau 2 sisi), atau <em>Gudang / Pabrik</em> (bentang lebar lengkap dengan jalur
              perawatan/walkway).
            </li>
            <li>
              <strong className="text-zinc-900 dark:text-zinc-200 font-medium">
                Dimensi & Margin Tepi (Setback)
              </strong>{' '}
              — Mengatur panjang, lebar, tinggi dinding, serta jarak kosong aman di tepi atap untuk
              keamanan instalasi dan terpaan angin.
            </li>
            <li>
              <strong className="text-zinc-900 dark:text-zinc-200 font-medium">
                Preset Modul & Orientasi
              </strong>{' '}
              — Pilih 450Wp / 550Wp / 660Wp atau isi manual, lalu bandingkan posisi{' '}
              <em>Portrait</em> vs <em>Landscape</em> untuk kapasitas kWp optimal.
            </li>
          </ul>
        </section>

        <section className="space-y-3 pt-6 border-t border-zinc-200 dark:border-zinc-800/80">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            2. Viewport 3D, Kompas & Waktu Berjalan
          </h2>
          <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400 list-disc pl-5 leading-relaxed">
            <li>
              <strong className="text-zinc-900 dark:text-zinc-200 font-medium">
                Navigasi Kamera
              </strong>{' '}
              — Seret untuk putar 360°, scroll untuk zoom, klik kanan untuk geser, atau klik tombol{' '}
              <span className="font-mono text-xs text-zinc-900 dark:text-zinc-200">
                Iso / Atas / Inverter
              </span>
              .
            </li>
            <li>
              <strong className="text-zinc-900 dark:text-zinc-200 font-medium">
                Kompas Real-time (U/T/S/B)
              </strong>{' '}
              — Berputar mengikuti arah kamera 3D sehingga kamu selalu tahu arah Timur (matahari
              terbit) dan Barat (matahari terbenam).
            </li>
            <li>
              <strong className="text-zinc-900 dark:text-zinc-200 font-medium">
                Waktu & Suhu Berjalan (06:00 – 18:00)
              </strong>{' '}
              — Matahari 3D, warna langit (pagi cerah → siang terik → sore redup), dan suhu
              lingkungan bergerak otomatis mengikuti jadwal harian.
            </li>
          </ul>
        </section>

        <section className="space-y-3 pt-6 border-t border-zinc-200 dark:border-zinc-800/80">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            3. Panel Kanan — Suhu, Inverter & Baterai
          </h2>
          <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400 list-disc pl-5 leading-relaxed">
            <li>
              <strong className="text-zinc-900 dark:text-zinc-200 font-medium">
                Suhu & Thermal Derating
              </strong>{' '}
              — Panel surya menghasilkan listrik dari cahaya, bukan panas. Kenaikan suhu sel di atas
              25°C menurunkan efisiensi output sesuai koefisien suhu (default -0.35%/°C).
            </li>
            <li>
              <strong className="text-zinc-900 dark:text-zinc-200 font-medium">
                Inverter & Rasio DC : AC
              </strong>{' '}
              — Rentang ideal{' '}
              <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400">
                0.85 – 1.25
              </span>
              . Klik{' '}
              <span className="font-mono text-xs text-zinc-900 dark:text-zinc-200">
                Auto Ukuran
              </span>{' '}
              untuk rekomendasi inverter & baterai otomatis.
            </li>
            <li>
              <strong className="text-zinc-900 dark:text-zinc-200 font-medium">
                Bank Baterai & DoD
              </strong>{' '}
              — Menghitung energi efektif sesuai <em>Depth of Discharge</em> (80–90% LiFePO4, 50%
              Lead-Acid) serta durasi cadangan saat listrik padam.
            </li>
          </ul>
        </section>

        <section className="space-y-3 pt-6 border-t border-zinc-200 dark:border-zinc-800/80">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            4. Grafik Produksi & Jadwal Waktu-Suhu (Panel Bawah)
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Atur rentang jam dan suhu harian (pagi, siang, sore). Pada mode{' '}
            <strong className="text-zinc-900 dark:text-zinc-200 font-medium">Waktu Berjalan</strong>
            , batang kuning (produksi panel per jam) dan garis hijau (energi di baterai) ikut
            bergerak mengikuti jam. Pindah ke{' '}
            <strong className="text-zinc-900 dark:text-zinc-200 font-medium">Atur Manual</strong>{' '}
            untuk melihat grafik penuh sekaligus, dan arahkan kursor ke batang untuk detail per jam.
          </p>
        </section>
      </div>
    </main>
  );
}
