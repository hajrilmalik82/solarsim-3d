interface RangeSliderProps {
  id?: string;
  label: string;
  value: number;
  displayValue: string;
  min: number;
  max: number;
  step?: number;
  valueClassName?: string;
  helperText?: string;
  ticks?: [string, string, string];
  onChange: (value: number) => void;
}

/**
 * Kontrol slider presisi gaya CAD inspector (Light & Dark).
 */
export function RangeSlider({
  id,
  label,
  value,
  displayValue,
  min,
  max,
  step = 1,
  valueClassName = 'text-zinc-900 dark:text-zinc-100',
  helperText,
  ticks,
  onChange,
}: RangeSliderProps) {
  return (
    <div>
      <div className="flex justify-between items-center text-xs mb-1">
        <label htmlFor={id} className="text-zinc-600 dark:text-zinc-400">
          {label}
        </label>
        <span className={`font-mono text-[11px] tabular-nums font-semibold ${valueClassName}`}>
          {displayValue}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full"
      />
      {ticks && (
        <div className="flex justify-between text-[10px] font-mono text-zinc-400 dark:text-zinc-600 mt-0.5">
          <span>{ticks[0]}</span>
          <span>{ticks[1]}</span>
          <span>{ticks[2]}</span>
        </div>
      )}
      {helperText && <p className="text-[11px] text-zinc-500 mt-1 leading-snug">{helperText}</p>}
    </div>
  );
}
