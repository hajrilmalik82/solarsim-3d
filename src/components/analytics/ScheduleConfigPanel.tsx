import { Plus, Trash2 } from 'lucide-react';
import { getTranslations } from '../../i18n/translations';
import { useSolarStore } from '../../store/useSolarStore';

const HOUR_OPTIONS = Array.from({ length: 25 }, (_, i) => i);

/**
 * Panel konfigurasi rentang waktu & suhu harian (Light & Dark).
 */
export function ScheduleConfigPanel() {
  const tempSchedule = useSolarStore((state) => state.config.tempSchedule);
  const lang = useSolarStore((state) => state.lang);
  const addTempSlot = useSolarStore((state) => state.addTempSlot);
  const updateTempSlot = useSolarStore((state) => state.updateTempSlot);
  const removeTempSlot = useSolarStore((state) => state.removeTempSlot);

  const t = getTranslations(lang).analytics;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          {t.scheduleTitle}
        </span>
        <button
          type="button"
          onClick={addTempSlot}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200/80 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 transition cursor-pointer"
        >
          <Plus className="w-3 h-3" />
          {t.add}
        </button>
      </div>

      <div className="space-y-1.5 overflow-y-auto pr-1 flex-1 max-h-[168px]">
        {tempSchedule.map((slot) => (
          <div
            key={slot.id}
            className="flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/90 rounded px-2 py-1.5 text-[11px]"
          >
            <select
              aria-label="Start hour"
              value={slot.startHour}
              onChange={(e) =>
                updateTempSlot(slot.id, { startHour: parseInt(e.target.value, 10) })
              }
              className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded px-1.5 py-0.5 font-mono text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-amber-500"
            >
              {HOUR_OPTIONS.slice(0, 24).map((h) => (
                <option key={h} value={h}>
                  {String(h).padStart(2, '0')}:00
                </option>
              ))}
            </select>

            <span className="text-zinc-400 dark:text-zinc-600">–</span>

            <select
              aria-label="End hour"
              value={slot.endHour}
              onChange={(e) =>
                updateTempSlot(slot.id, { endHour: parseInt(e.target.value, 10) })
              }
              className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded px-1.5 py-0.5 font-mono text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-amber-500"
            >
              {HOUR_OPTIONS.slice(1).map((h) => (
                <option key={h} value={h} disabled={h <= slot.startHour}>
                  {String(h).padStart(2, '0')}:00
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1 ml-auto">
              <input
                aria-label="Ambient temperature"
                type="number"
                min={15}
                max={50}
                step={0.5}
                value={slot.ambientTemp}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!Number.isNaN(val)) updateTempSlot(slot.id, { ambientTemp: val });
                }}
                className="w-12 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded px-1.5 py-0.5 text-right font-mono font-medium text-amber-600 dark:text-amber-400 focus:outline-none focus:border-amber-500"
              />
              <span className="text-zinc-500 font-mono">°C</span>
            </div>

            <button
              type="button"
              onClick={() => removeTempSlot(slot.id)}
              disabled={tempSchedule.length <= 1}
              title={t.deleteSlot}
              className="p-1 rounded text-zinc-400 dark:text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-zinc-200/70 dark:hover:bg-zinc-900 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
