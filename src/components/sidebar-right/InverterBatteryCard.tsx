import { BATTERY_DOD_OPTIONS } from '../../constants/presets';
import { getTranslations } from '../../i18n/translations';
import { useSolarStore } from '../../store/useSolarStore';
import { getInverterStatus } from '../../utils/solarCalculator';
import { DualNumberSlider } from '../ui/DualNumberSlider';

/**
 * Bagian Inspector Kanan (Light & Dark): Kapasitas Inverter (DC/AC Ratio) & Bank Baterai.
 */
export function InverterBatteryCard() {
  const config = useSolarStore((state) => state.config);
  const results = useSolarStore((state) => state.results);
  const lang = useSolarStore((state) => state.lang);
  const updateConfig = useSolarStore((state) => state.updateConfig);
  const autoSizeSystem = useSolarStore((state) => state.autoSizeSystem);

  const t = getTranslations(lang).right;
  const invStatus = getInverterStatus(results.dcAcRatio, lang);

  return (
    <section className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          {t.inverterBattery}
        </h2>
        <button
          type="button"
          onClick={autoSizeSystem}
          className="text-[11px] font-medium px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200/80 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/80 transition cursor-pointer"
        >
          {t.autoSize}
        </button>
      </div>

      {/* Inverter */}
      <DualNumberSlider
        id="num-inverter-kw"
        label={t.inverterCap}
        value={config.inverterKw}
        min={1}
        max={300}
        numberMax={1000}
        step={1}
        onChange={(inverterKw) => updateConfig({ inverterKw })}
      />

      <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/90 rounded p-2.5 space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="text-zinc-500">{t.dcAcRatio}</span>
          <span className={`font-mono font-semibold tabular-nums ${invStatus.ratioClass}`}>
            {results.dcAcRatio.toFixed(2)}
          </span>
        </div>
        <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-[1px] overflow-hidden">
          <div
            className={`h-full transition-all duration-200 ${invStatus.barClass}`}
            style={{ width: `${invStatus.loadPct}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[11px] gap-2">
          <span className={`font-medium ${invStatus.statusClass}`}>{invStatus.label}</span>
          <span className="text-zinc-500 font-mono shrink-0">
            {config.inverterKw.toFixed(0)} kW
          </span>
        </div>
      </div>

      {/* Baterai */}
      <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800/70 space-y-2.5">
        <DualNumberSlider
          id="num-battery-kwh"
          label={t.batteryBank}
          value={config.batteryKwh}
          min={0}
          max={500}
          numberMax={2000}
          step={5}
          onChange={(batteryKwh) => updateConfig({ batteryKwh })}
        />

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="inp-battery-dod" className="block text-[11px] text-zinc-500 mb-1">
              {t.dod}
            </label>
            <select
              id="inp-battery-dod"
              value={config.batteryDod}
              onChange={(e) => updateConfig({ batteryDod: parseFloat(e.target.value) })}
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded px-2 py-1.5 text-xs font-mono text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-zinc-950"
            >
              {BATTERY_DOD_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="inp-backup-load" className="block text-[11px] text-zinc-500 mb-1">
              {t.backupLoad}
            </label>
            <input
              id="inp-backup-load"
              type="number"
              min={0.5}
              max={200}
              step={0.5}
              value={config.backupLoadKw}
              onChange={(e) =>
                updateConfig({ backupLoadKw: Math.max(0.1, parseFloat(e.target.value) || 1) })
              }
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded px-2 py-1.5 text-xs font-mono text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-zinc-950"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800/70 space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-500">{t.usableEnergy}</span>
            <span className="font-mono text-zinc-800 dark:text-zinc-200 tabular-nums">
              {results.usableBatteryKwh.toFixed(1)} kWh
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-500">{t.dailyCharge}</span>
            <span className="font-mono text-zinc-700 dark:text-zinc-300 tabular-nums">
              {config.batteryKwh > 0
                ? `${results.batteryFillPct.toFixed(0)}% ${t.perDay}`
                : t.onGrid}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-500">{t.backupDuration}</span>
            <span className="font-mono font-semibold text-amber-600 dark:text-amber-400 tabular-nums">
              {config.batteryKwh > 0
                ? `${results.backupHours.toFixed(1)} ${t.hours} (@ ${config.backupLoadKw} kW)`
                : `0 ${t.hours}`}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
