import { Pause, Play, RotateCcw } from 'lucide-react';
import { getTranslations } from '../../i18n/translations';
import { useSolarStore } from '../../store/useSolarStore';
import { formatSunHour } from '../../utils/reportFormatter';
import { getTemperatureAtHour } from '../../utils/solarCalculator';

/**
 * Kontrol bawah Viewport 3D (Light & Dark): Waktu & suhu berjalan (06:00 - 18:00).
 */
export function SunControlBar() {
  const sunHour = useSolarStore((state) => state.config.sunHour);
  const ambientTemp = useSolarStore((state) => state.config.ambientTemp);
  const tempSchedule = useSolarStore((state) => state.config.tempSchedule);
  const chartMode = useSolarStore((state) => state.chartMode);
  const isSunPlaying = useSolarStore((state) => state.isSunPlaying);
  const lang = useSolarStore((state) => state.lang);
  const updateConfig = useSolarStore((state) => state.updateConfig);
  const setSunPlaying = useSolarStore((state) => state.setSunPlaying);
  const toggleSunPlaying = useSolarStore((state) => state.toggleSunPlaying);
  const resetSunClock = useSolarStore((state) => state.resetSunClock);

  const t = getTranslations(lang).hud;

  const handleSliderChange = (nextHour: number) => {
    setSunPlaying(false);
    if (chartMode === 'live') {
      const liveTemp = getTemperatureAtHour(tempSchedule, nextHour, ambientTemp);
      updateConfig({ sunHour: nextHour, ambientTemp: liveTemp });
    } else {
      updateConfig({ sunHour: nextHour });
    }
  };

  return (
    <div className="absolute bottom-3 left-3 right-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pointer-events-none">
      <div className="bg-white/92 dark:bg-[#111114]/90 border border-zinc-200 dark:border-zinc-800 shadow-xs rounded px-2.5 py-1.5 pointer-events-auto flex items-center gap-2 flex-1 max-w-lg">
        <button
          type="button"
          onClick={toggleSunPlaying}
          title={isSunPlaying ? t.pauseTitle : t.playTitle}
          className="p-1 rounded bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-amber-600 dark:text-amber-400 border border-zinc-200 dark:border-zinc-800 transition cursor-pointer shrink-0"
        >
          {isSunPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        <button
          type="button"
          onClick={resetSunClock}
          title={t.resetTitle}
          className="p-1 rounded bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 border border-zinc-200 dark:border-zinc-800 transition cursor-pointer shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <label
          htmlFor="inp-sun-hour"
          className="text-[11px] text-zinc-600 dark:text-zinc-400 shrink-0 hidden sm:inline"
        >
          {t.time}
        </label>

        <input
          id="inp-sun-hour"
          type="range"
          min={6}
          max={18}
          step={0.1}
          value={sunHour}
          onChange={(e) => handleSliderChange(parseFloat(e.target.value))}
          className="flex-1"
        />

        <span className="font-mono text-[11px] font-semibold text-amber-600 dark:text-amber-400 tabular-nums w-11 text-right shrink-0">
          {formatSunHour(sunHour)}
        </span>

        <span className="h-3.5 w-px bg-zinc-200 dark:bg-zinc-800 shrink-0" />

        <span
          title={t.tempTooltip}
          className="font-mono text-[11px] font-semibold text-zinc-800 dark:text-zinc-200 tabular-nums w-12 text-right shrink-0"
        >
          {ambientTemp.toFixed(1)}°C
        </span>
      </div>

      <div className="bg-white/85 dark:bg-[#111114]/85 border border-zinc-200 dark:border-zinc-800/80 rounded px-2.5 py-1 text-[10px] font-mono text-zinc-500 text-center sm:text-right">
        {t.navHint}
      </div>
    </div>
  );
}
