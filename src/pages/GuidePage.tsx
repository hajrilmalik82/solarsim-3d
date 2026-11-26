import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSolarStore } from '../store/useSolarStore';

/**
 * Halaman Dokumentasi Rumus Fisika PLTS ('/guide') — Light & Dark, Bilingual ID/EN.
 */
export function GuidePage() {
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
            Formulas & Calculation Methodology
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Summary of the engineering equations used in SolarSim 3D to estimate nominal capacity,
            thermal derating, inverter DC/AC ratio, and battery backup duration.
          </p>
        </header>

        <div className="space-y-8 text-sm">
          <section className="space-y-2.5">
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
              1. Nominal Capacity (STC)
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Peak system capacity rated under <em>Standard Test Conditions</em> (1000 W/m²
              irradiance, 25°C cell temperature).
            </p>
            <pre className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded p-3.5 font-mono text-xs text-zinc-800 dark:text-zinc-200 overflow-x-auto">
              kWp = (Panel Count × Wp per Panel) / 1000
            </pre>
          </section>

          <section className="space-y-2.5">
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
              2. Cell Thermal Derating & Energy Yield
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Under operating irradiance, PV cell temperature rises roughly +20°C above ambient air.
              Each 1°C above 25°C reduces output power by the temperature coefficient (default
              -0.35%/°C). Daily energy includes a 94% system efficiency factor (cabling & light
              soiling losses).
            </p>
            <pre className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded p-3.5 font-mono text-xs text-zinc-800 dark:text-zinc-200 overflow-x-auto leading-relaxed">
{`T_cell    = T_ambient + 20°C
P_actual  = kWp × (1 + (temp_coeff / 100) × (T_cell - 25))
E_daily   = P_actual × PSH × 0.94
E_monthly = E_daily × 30`}
            </pre>
          </section>

          <section className="space-y-2.5">
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
              3. Inverter DC/AC Ratio
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              The optimal DC-to-AC ratio typically lies between{' '}
              <span className="font-mono text-zinc-900 dark:text-zinc-200">0.85 – 1.25</span>.
              Values above 1.25 may experience peak midday clipping.
            </p>
            <pre className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded p-3.5 font-mono text-xs text-zinc-800 dark:text-zinc-200 overflow-x-auto">
              DC/AC Ratio = Total kWp (DC) / Inverter Capacity (kW AC)
            </pre>
          </section>

          <section className="space-y-2.5">
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
              4. Battery Storage & Backup Duration
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Usable capacity is limited by <em>Depth of Discharge (DoD)</em> depending on battery
              chemistry (80–90% for LiFePO4, 50% for Lead-Acid).
            </p>
            <pre className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded p-3.5 font-mono text-xs text-zinc-800 dark:text-zinc-200 overflow-x-auto leading-relaxed">
{`E_usable     = Battery Capacity (kWh) × DoD
Backup Hours = E_usable / Critical Load (kW)`}
            </pre>
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
          Rumus & Asumsi Perhitungan
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Ringkasan persamaan fisika yang digunakan di balik kalkulator SolarSim 3D untuk
          memperkirakan kapasitas terpasang, derating suhu, rasio inverter, dan durasi cadangan
          baterai.
        </p>
      </header>

      <div className="space-y-8 text-sm">
        <section className="space-y-2.5">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
            1. Kapasitas Nominal (STC)
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Daya puncak sistem dihitung pada kondisi pengujian standar laboratorium (
            <em>Standard Test Conditions</em>: radiasi 1000 W/m², suhu sel 25°C).
          </p>
          <pre className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded p-3.5 font-mono text-xs text-zinc-800 dark:text-zinc-200 overflow-x-auto">
            kWp = (Jumlah Panel × Wp per Panel) / 1000
          </pre>
        </section>

        <section className="space-y-2.5">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
            2. Derating Suhu Sel & Produksi Energi
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Saat beroperasi di lapangan, suhu sel surya berada sekitar +20°C di atas suhu udara
            sekitar. Kenaikan suhu di atas 25°C menurunkan efisiensi output sesuai koefisien suhu
            panel (default -0.35%/°C). Estimasi energi harian juga memperhitungkan faktor efisiensi
            sistem sebesar 94% (rugi kabel DC/AC dan debu ringan).
          </p>
          <pre className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded p-3.5 font-mono text-xs text-zinc-800 dark:text-zinc-200 overflow-x-auto leading-relaxed">
{`T_sel     = T_lingkungan + 20°C
P_aktual  = kWp × (1 + (koef_suhu / 100) × (T_sel - 25))
E_harian  = P_aktual × PSH × 0.94
E_bulanan = E_harian × 30`}
          </pre>
        </section>

        <section className="space-y-2.5">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
            3. Rasio DC/AC Inverter
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Rasio DC terhadap AC yang ideal umumnya berada di kisaran{' '}
            <span className="font-mono text-zinc-900 dark:text-zinc-200">0.85 – 1.25</span>. Di
            bawah 0.85 kapasitas inverter masih longgar (oversized), sedangkan di atas 1.25 berisiko
            mengalami <em>clipping</em> saat puncak radiasi siang hari.
          </p>
          <pre className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded p-3.5 font-mono text-xs text-zinc-800 dark:text-zinc-200 overflow-x-auto">
            DC/AC Ratio = Total kWp (DC) / Kapasitas Inverter (kW AC)
          </pre>
        </section>

        <section className="space-y-2.5">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
            4. Penyimpanan Baterai & Durasi Backup
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Energi yang aman dipakai dibatasi oleh <em>Depth of Discharge (DoD)</em> sesuai jenis
            kimia baterai (80–90% untuk LiFePO4, 50% untuk Lead-Acid).
          </p>
          <pre className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded p-3.5 font-mono text-xs text-zinc-800 dark:text-zinc-200 overflow-x-auto leading-relaxed">
{`E_efektif     = Kapasitas Baterai (kWh) × DoD
Durasi Backup = E_efektif / Beban Prioritas (kW)`}
          </pre>
        </section>
      </div>
    </main>
  );
}
