interface DualNumberSliderProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  numberMax?: number;
  step?: number;
  numberStep?: number;
  onChange: (value: number) => void;
}

/**
 * Input angka + slider tersinkronisasi (Light & Dark).
 */
export function DualNumberSlider({
  id,
  label,
  value,
  min,
  max,
  numberMax,
  step = 1,
  numberStep,
  onChange,
}: DualNumberSliderProps) {
  const effectiveMax = numberMax ?? max;

  const handleNumberChange = (raw: string) => {
    const parsed = parseFloat(raw);
    if (Number.isNaN(parsed)) return;
    const clamped = Math.max(min, Math.min(effectiveMax, parsed));
    onChange(clamped);
  };

  return (
    <div>
      <div className="flex justify-between items-center text-xs mb-1">
        <label htmlFor={id} className="text-zinc-600 dark:text-zinc-400">
          {label}
        </label>
        <input
          id={id}
          type="number"
          min={min}
          max={effectiveMax}
          step={numberStep ?? step}
          value={value}
          onChange={(e) => handleNumberChange(e.target.value)}
          className="w-20 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded px-2 py-0.5 text-right font-mono text-[11px] tabular-nums text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-zinc-950"
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={Math.min(max, value)}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full"
      />
    </div>
  );
}
