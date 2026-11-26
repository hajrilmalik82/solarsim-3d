import { PANEL_PRESETS } from '../../constants/presets';
import { getTranslations } from '../../i18n/translations';
import { useSolarStore } from '../../store/useSolarStore';
import { DualNumberSlider } from '../ui/DualNumberSlider';
import { RangeSlider } from '../ui/RangeSlider';

/**
 * Tab 2 (Inspector Kiri): Spesifikasi fisik modul surya, Wp, gap, & orientasi (Light & Dark).
 */
export function PanelTab() {
  const config = useSolarStore((state) => state.config);
  const lang = useSolarStore((state) => state.lang);
  const updateConfig = useSolarStore((state) => state.updateConfig);
  const t = getTranslations(lang).left;

  const singlePanelArea = config.panelLength * config.panelWidth;

  return (
    <div className="divide-y divide-zinc-200 dark:divide-zinc-800/80">
      <section className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            {t.moduleSpec}
          </h3>
          <span className="text-[11px] font-mono text-zinc-600 dark:text-zinc-300 tabular-nums">
            {singlePanelArea.toFixed(2)} {t.perUnit}
          </span>
        </div>

        {/* Preset Ukuran Panel Umum */}
        <div className="grid grid-cols-3 gap-1.5">
          {PANEL_PRESETS.map((preset) => {
            const isActive =
              config.panelLength === preset.length &&
              config.panelWidth === preset.width &&
              config.panelWp === preset.wp;

            const presetLabel =
              t.panelPresets[preset.id as keyof typeof t.panelPresets] ?? preset.label;

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() =>
                  updateConfig({
                    panelLength: preset.length,
                    panelWidth: preset.width,
                    panelWp: preset.wp,
                  })
                }
                className={`py-1.5 px-1.5 rounded text-[11px] font-medium border transition cursor-pointer ${
                  isActive
                    ? 'bg-amber-50/80 dark:bg-zinc-900 border-amber-500 text-zinc-900 dark:text-zinc-100'
                    : 'bg-white dark:bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:text-zinc-200'
                }`}
              >
                {presetLabel}
              </button>
            );
          })}
        </div>

        <DualNumberSlider
          id="num-panel-length"
          label={t.panelLength}
          value={config.panelLength}
          min={1.2}
          max={2.6}
          step={0.02}
          numberStep={0.01}
          onChange={(panelLength) => updateConfig({ panelLength })}
        />

        <DualNumberSlider
          id="num-panel-width"
          label={t.panelWidth}
          value={config.panelWidth}
          min={0.8}
          max={1.5}
          step={0.01}
          onChange={(panelWidth) => updateConfig({ panelWidth })}
        />

        <DualNumberSlider
          id="num-panel-wp"
          label={t.panelWp}
          value={config.panelWp}
          min={300}
          max={800}
          step={10}
          numberStep={5}
          onChange={(panelWp) => updateConfig({ panelWp })}
        />

        <RangeSlider
          id="inp-panel-gap"
          label={t.panelGap}
          value={config.panelGap}
          displayValue={`${config.panelGap.toFixed(2)} m`}
          min={0.02}
          max={0.3}
          step={0.01}
          onChange={(panelGap) => updateConfig({ panelGap })}
        />
      </section>

      {/* Orientasi Panel */}
      <section className="p-4 space-y-2.5">
        <span className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          {t.orientation}
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => updateConfig({ orientation: 'portrait' })}
            className={`py-2 px-3 rounded text-xs font-medium border flex items-center justify-center gap-1.5 transition cursor-pointer ${
              config.orientation === 'portrait'
                ? 'bg-amber-50/80 dark:bg-zinc-900 border-amber-500 text-zinc-900 dark:text-zinc-100'
                : 'bg-white dark:bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:text-zinc-200'
            }`}
          >
            <span className="w-2 h-3 border border-current rounded-[1px] inline-block" />
            {t.portrait}
          </button>
          <button
            type="button"
            onClick={() => updateConfig({ orientation: 'landscape' })}
            className={`py-2 px-3 rounded text-xs font-medium border flex items-center justify-center gap-1.5 transition cursor-pointer ${
              config.orientation === 'landscape'
                ? 'bg-amber-50/80 dark:bg-zinc-900 border-amber-500 text-zinc-900 dark:text-zinc-100'
                : 'bg-white dark:bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:text-zinc-200'
            }`}
          >
            <span className="w-3 h-2 border border-current rounded-[1px] inline-block" />
            {t.landscape}
          </button>
        </div>
      </section>
    </div>
  );
}
