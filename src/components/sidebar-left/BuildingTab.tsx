import { ROOF_TYPE_OPTIONS } from '../../constants/presets';
import { getTranslations } from '../../i18n/translations';
import { useSolarStore } from '../../store/useSolarStore';
import { RangeSlider } from '../ui/RangeSlider';

/**
 * Tab 1 (Inspector Kiri): Bentuk bangunan, tipe atap, opsi spesifik, & dimensi (Light & Dark).
 */
export function BuildingTab() {
  const config = useSolarStore((state) => state.config);
  const lang = useSolarStore((state) => state.lang);
  const updateConfig = useSolarStore((state) => state.updateConfig);
  const t = getTranslations(lang).left;

  return (
    <div className="divide-y divide-zinc-200 dark:divide-zinc-800/80">
      {/* Pilihan Bentuk Bangunan & Atap */}
      <section className="p-4 space-y-2.5">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          {t.roofShape}
        </h3>
        <div className="grid grid-cols-1 gap-1.5">
          {ROOF_TYPE_OPTIONS.map((opt) => {
            const active = config.roofType === opt.value;
            const copy = t.roofs[opt.value];
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => updateConfig({ roofType: opt.value })}
                className={`px-2.5 py-2 rounded border text-left transition cursor-pointer flex items-center justify-between gap-2 ${
                  active
                    ? 'bg-amber-50/70 dark:bg-zinc-900 border-amber-500 text-zinc-900 dark:text-zinc-100'
                    : 'bg-white dark:bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:text-zinc-200'
                }`}
              >
                <span className="text-xs font-medium">{copy.title}</span>
                <span className="text-[10px] text-zinc-500">{copy.subtitle}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Opsi Spesifik Tiap Tipe Atap */}
      <section className="p-4 space-y-3">
        {config.roofType === 'flat' && (
          <RangeSlider
            id="inp-flat-tilt"
            label={t.flatTilt}
            value={config.flatTilt}
            displayValue={`${config.flatTilt}°`}
            min={0}
            max={30}
            step={1}
            helperText={t.flatTiltHelp}
            onChange={(flatTilt) => updateConfig({ flatTilt })}
          />
        )}

        {config.roofType === 'gable' && (
          <div className="space-y-3">
            <RangeSlider
              id="inp-gable-pitch"
              label={t.gablePitch}
              value={config.gablePitch}
              displayValue={`${config.gablePitch}°`}
              min={10}
              max={40}
              step={1}
              onChange={(gablePitch) => updateConfig({ gablePitch })}
            />
            <div>
              <span className="block text-xs text-zinc-600 dark:text-zinc-400 mb-1.5">
                {t.installSide}
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => updateConfig({ gableSide: 'both' })}
                  className={`py-1.5 px-2 rounded text-xs font-medium border transition cursor-pointer ${
                    config.gableSide === 'both'
                      ? 'bg-zinc-900 dark:bg-zinc-800 border-zinc-900 dark:border-zinc-600 text-white dark:text-zinc-100'
                      : 'bg-white dark:bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:text-zinc-200'
                  }`}
                >
                  {t.bothSides}
                </button>
                <button
                  type="button"
                  onClick={() => updateConfig({ gableSide: 'single' })}
                  className={`py-1.5 px-2 rounded text-xs font-medium border transition cursor-pointer ${
                    config.gableSide === 'single'
                      ? 'bg-zinc-900 dark:bg-zinc-800 border-zinc-900 dark:border-zinc-600 text-white dark:text-zinc-100'
                      : 'bg-white dark:bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:text-zinc-200'
                  }`}
                >
                  {t.singleSide}
                </button>
              </div>
            </div>
          </div>
        )}

        {config.roofType === 'industrial' && (
          <RangeSlider
            id="inp-ind-pitch"
            label={t.indPitch}
            value={config.indPitch}
            displayValue={`${config.indPitch}°`}
            min={5}
            max={20}
            step={1}
            helperText={t.indPitchHelp}
            onChange={(indPitch) => updateConfig({ indPitch })}
          />
        )}
      </section>

      {/* Dimensi Bangunan */}
      <section className="p-4 space-y-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          {t.dimensions}
        </h3>

        <RangeSlider
          id="inp-bldg-length"
          label={t.length}
          value={config.bldgLength}
          displayValue={`${config.bldgLength} m`}
          min={8}
          max={60}
          step={1}
          onChange={(bldgLength) => updateConfig({ bldgLength })}
        />

        <RangeSlider
          id="inp-bldg-width"
          label={t.width}
          value={config.bldgWidth}
          displayValue={`${config.bldgWidth} m`}
          min={6}
          max={40}
          step={1}
          onChange={(bldgWidth) => updateConfig({ bldgWidth })}
        />

        <RangeSlider
          id="inp-bldg-height"
          label={t.height}
          value={config.bldgHeight}
          displayValue={`${config.bldgHeight} m`}
          min={3}
          max={15}
          step={0.5}
          onChange={(bldgHeight) => updateConfig({ bldgHeight })}
        />

        <RangeSlider
          id="inp-setback"
          label={t.setback}
          value={config.setback}
          displayValue={`${config.setback} m`}
          min={0.2}
          max={1.5}
          step={0.1}
          onChange={(setback) => updateConfig({ setback })}
        />
      </section>
    </div>
  );
}
