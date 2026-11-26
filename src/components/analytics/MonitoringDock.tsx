import { BarChart3, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { getTranslations } from '../../i18n/translations';
import { useSolarStore } from '../../store/useSolarStore';
import { EnergyProfileChart } from './EnergyProfileChart';
import { ScheduleConfigPanel } from './ScheduleConfigPanel';

/**
 * Panel bawah di bawah Viewport 3D (Light & Dark).
 */
export function MonitoringDock() {
  const [isOpen, setIsOpen] = useState(true);
  const chartMode = useSolarStore((state) => state.chartMode);
  const lang = useSolarStore((state) => state.lang);
  const setChartMode = useSolarStore((state) => state.setChartMode);

  const t = getTranslations(lang).analytics;

  return (
    <section className="bg-white dark:bg-[#111114] border-t border-zinc-200 dark:border-zinc-800/90 shrink-0">
      <div className="px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-100 transition cursor-pointer"
        >
          <BarChart3 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500" />
          <span>{t.title}</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="inline-flex bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded p-0.5 text-[11px]">
            <button
              type="button"
              onClick={() => setChartMode('live')}
              className={`px-2 py-0.5 rounded-[3px] font-medium transition cursor-pointer ${
                chartMode === 'live'
                  ? 'bg-amber-500 text-white dark:text-zinc-950'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              {t.modeLive}
            </button>
            <button
              type="button"
              onClick={() => setChartMode('manual')}
              className={`px-2 py-0.5 rounded-[3px] font-medium transition cursor-pointer ${
                chartMode === 'manual'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              {t.modeManual}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 transition cursor-pointer"
          >
            {isOpen ? t.hide : t.show}
            {isOpen ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronUp className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-zinc-200 dark:border-zinc-800/80 px-4 py-3 grid grid-cols-1 xl:grid-cols-12 gap-4 xl:h-[216px]">
          <div className="xl:col-span-5 min-h-[150px] xl:min-h-0">
            <ScheduleConfigPanel />
          </div>
          <div className="xl:col-span-7 min-h-[175px] xl:min-h-0">
            <EnergyProfileChart />
          </div>
        </div>
      )}
    </section>
  );
}
