import { getTranslations } from '../../i18n/translations';
import { useSolarStore } from '../../store/useSolarStore';
import { RangeSlider } from '../ui/RangeSlider';

/**
 * Bagian Inspector Kanan (Light & Dark): Simulasi Suhu Lingkungan, Suhu Sel, Koefisien, & PSH.
 */
export function TempRadiationCard() {
  const config = useSolarStore((state) => state.config);
  const results = useSolarStore((state) => state.results);
  const lang = useSolarStore((state) => state.lang);
  const updateConfig = useSolarStore((state) => state.updateConfig);
  const t = getTranslations(lang).right;

  const impactSign =
    results.tempLossPct >= 0
      ? `-${results.tempLossPct.toFixed(1)}%`
      : `+${Math.abs(results.tempLossPct).toFixed(1)}%`;

  const locale = lang === 'en' ? 'en-US' : 'id-ID';

  return (
    <section className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          {t.tempRadiation}
        </h2>
        <span
          className={`text-[11px] font-mono font-medium tabular-nums ${
            results.tempLossPct > 0
              ? 'text-rose-600 dark:text-rose-400'
              : 'text-emerald-600 dark:text-emerald-400'
          }`}
        >
          {impactSign} {t.derating}
        </span>
      </div>

      <RangeSlider
        id="inp-ambient-temp"
        label={t.ambientTemp}
        value={config.ambientTemp}
        displayValue={`${config.ambientTemp.toFixed(1)} °C`}
        valueClassName="text-amber-600 dark:text-amber-400"
        min={20}
        max={45}
        step={0.5}
        ticks={['20°C', '25°C STC', '45°C']}
        onChange={(ambientTemp) => updateConfig({ ambientTemp })}
      />

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/90 rounded p-2">
          <div className="text-[10px] text-zinc-500">{t.estCellTemp}</div>
          <div className="font-mono text-xs font-medium text-zinc-800 dark:text-zinc-200 tabular-nums mt-0.5">
            {results.cellTemp.toFixed(1)} °C
          </div>
        </div>
        <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/90 rounded p-2">
          <label htmlFor="inp-temp-coeff" className="block text-[10px] text-zinc-500">
            {t.tempCoeff}
          </label>
          <input
            id="inp-temp-coeff"
            type="number"
            min={-0.6}
            max={-0.15}
            step={0.01}
            value={config.tempCoeff}
            onChange={(e) => updateConfig({ tempCoeff: parseFloat(e.target.value) || -0.35 })}
            className="w-full bg-transparent font-mono text-xs font-medium text-zinc-800 dark:text-zinc-200 tabular-nums mt-0.5 focus:outline-none"
          />
        </div>
      </div>

      <RangeSlider
        id="inp-psh"
        label={t.psh}
        value={config.psh}
        displayValue={`${config.psh} ${t.hoursPerDay}`}
        min={3.0}
        max={6.0}
        step={0.1}
        onChange={(psh) => updateConfig({ psh })}
      />

      {/* Readout Produksi */}
      <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800/70 space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="text-zinc-500">
            {t.actualOutput} ({config.ambientTemp.toFixed(1)}°C)
          </span>
          <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
            {results.actualPowerKw.toFixed(2)} kW
          </span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-zinc-500">{t.dailyProd}</span>
          <span className="font-mono text-zinc-800 dark:text-zinc-200 tabular-nums">
            {results.dailyEnergyKwh.toFixed(1)} kWh
          </span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-zinc-500">{t.monthlyEst}</span>
          <span className="font-mono font-semibold text-amber-600 dark:text-amber-400 tabular-nums">
            {Math.round(results.monthlyEnergyKwh).toLocaleString(locale)} kWh
          </span>
        </div>
      </div>
    </section>
  );
}
