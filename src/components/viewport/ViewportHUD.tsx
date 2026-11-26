import { getTranslations } from '../../i18n/translations';
import { useSolarStore } from '../../store/useSolarStore';

/**
 * HUD Atas Viewport 3D (Light & Dark): Metrik ringkas & tombol kamera cepat.
 */
export function ViewportHUD() {
  const ambientTemp = useSolarStore((state) => state.config.ambientTemp);
  const results = useSolarStore((state) => state.results);
  const lang = useSolarStore((state) => state.lang);
  const triggerCameraPreset = useSolarStore((state) => state.triggerCameraPreset);
  const t = getTranslations(lang).hud;

  return (
    <div className="absolute top-3 left-3 right-3 flex flex-wrap items-start justify-between gap-2 pointer-events-none">
      {/* Metrik Ringkas */}
      <div className="bg-white/92 dark:bg-[#111114]/90 border border-zinc-200 dark:border-zinc-800 shadow-xs rounded px-3 py-2 pointer-events-auto flex flex-wrap items-center gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-zinc-500">{t.panel}</div>
          <div className="font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
            {results.panelCount}{' '}
            <span className="text-[11px] font-normal text-zinc-500">{t.unit}</span>
          </div>
        </div>

        <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800" />

        <div>
          <div className="text-[10px] uppercase tracking-wider text-zinc-500">
            {t.output} ({ambientTemp.toFixed(1)}°C)
          </div>
          <div className="font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
            {results.actualPowerKw.toFixed(2)}{' '}
            <span className="text-[11px] font-normal text-zinc-500">kW</span>
          </div>
        </div>

        <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />

        <div className="hidden sm:block">
          <div className="text-[10px] uppercase tracking-wider text-zinc-500">{t.production}</div>
          <div className="font-mono text-sm font-semibold text-amber-600 dark:text-amber-400 tabular-nums">
            {results.dailyEnergyKwh.toFixed(1)}{' '}
            <span className="text-[11px] font-normal text-zinc-500">{t.kwhPerDay}</span>
          </div>
        </div>
      </div>

      {/* Kontrol Kamera */}
      <div className="bg-white/92 dark:bg-[#111114]/90 border border-zinc-200 dark:border-zinc-800 shadow-xs rounded p-1 pointer-events-auto flex items-center gap-0.5">
        <button
          type="button"
          onClick={() => triggerCameraPreset('iso')}
          className="px-2.5 py-1 rounded text-[11px] font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
        >
          {t.iso}
        </button>
        <button
          type="button"
          onClick={() => triggerCameraPreset('top')}
          className="px-2.5 py-1 rounded text-[11px] font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
        >
          {t.top}
        </button>
        <button
          type="button"
          onClick={() => triggerCameraPreset('inverter')}
          className="px-2.5 py-1 rounded text-[11px] font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
        >
          {t.inverter}
        </button>
      </div>
    </div>
  );
}
