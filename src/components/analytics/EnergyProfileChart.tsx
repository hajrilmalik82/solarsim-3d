import { useMemo, useState } from 'react';
import { getTranslations } from '../../i18n/translations';
import { useSolarStore } from '../../store/useSolarStore';
import { formatSunHour } from '../../utils/reportFormatter';
import { simulateHourlyProfile } from '../../utils/solarCalculator';

/**
 * Grafik interaktif SVG (Light & Dark):
 * - Mode 'live': grafik berjalan mengikuti waktu simulasi (06:00 - 18:00).
 * - Mode 'manual': grafik penuh sesuai jadwal waktu & suhu.
 */
export function EnergyProfileChart() {
  const config = useSolarStore((state) => state.config);
  const results = useSolarStore((state) => state.results);
  const chartMode = useSolarStore((state) => state.chartMode);
  const lang = useSolarStore((state) => state.lang);
  const theme = useSolarStore((state) => state.theme);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const isDark = theme === 'dark';
  const t = getTranslations(lang).analytics;
  const data = useMemo(() => simulateHourlyProfile(config, results), [config, results]);

  const isLive = chartMode === 'live';
  const currentTime = config.sunHour;

  const liveProgress = useMemo(() => {
    const points = data.map((pt, idx) => {
      let fraction = 1;
      if (isLive) {
        if (currentTime <= pt.hour) {
          fraction = 0;
        } else if (currentTime < pt.hour + 1) {
          fraction = currentTime - pt.hour;
        } else {
          fraction = 1;
        }
      }

      const activeSolar = pt.solarKwh * fraction;
      const prevStored = idx > 0 ? data[idx - 1].batteryStoredKwh : 0;
      const activeStored =
        fraction === 0
          ? prevStored
          : prevStored + (pt.batteryStoredKwh - prevStored) * fraction;

      return {
        ...pt,
        fraction,
        activeSolar,
        activeStored,
      };
    });

    const producedSoFar = points.reduce((sum, p) => sum + p.activeSolar, 0);
    const activePoints = points.filter((p) => p.fraction > 0);
    const storedSoFar =
      activePoints.length > 0 ? activePoints[activePoints.length - 1].activeStored : 0;

    return { points, producedSoFar, storedSoFar };
  }, [data, isLive, currentTime]);

  const width = 560;
  const height = 148;
  const padLeft = 38;
  const padRight = 38;
  const padTop = 12;
  const padBottom = 22;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const maxSolar = Math.max(1, ...data.map((d) => d.solarKwh));
  const maxBattery = Math.max(1, results.usableBatteryKwh, ...data.map((d) => d.batteryStoredKwh));

  const stepX = data.length > 0 ? chartW / data.length : chartW;
  const barWidth = Math.max(6, Math.min(22, stepX * 0.56));

  const visibleBatteryPoints = liveProgress.points
    .map((pt, idx) => ({ pt, idx }))
    .filter(({ pt }) => !isLive || pt.fraction > 0);

  const batteryPath = visibleBatteryPoints
    .map(({ pt, idx }, i) => {
      const x = padLeft + idx * stepX + stepX / 2;
      const y = padTop + chartH - (pt.activeStored / maxBattery) * chartH;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');

  const firstHour = data.length > 0 ? data[0].hour : 6;
  const totalSpanHours = Math.max(1, data.length);
  const playheadRatio = Math.max(0, Math.min(1, (currentTime - firstHour) / totalSpanHours));
  const playheadX = padLeft + playheadRatio * chartW;

  const hoveredPoint = hoveredIdx !== null ? data[hoveredIdx] : null;

  // Warna SVG adaptif Light/Dark
  const gridStroke = isDark ? '#27272a' : '#e4e4e7';
  const axisText = '#71717a';
  const axisHoverText = isDark ? '#e4e4e7' : '#18181b';
  const batteryStroke = isDark ? '#34d399' : '#059669';
  const dotOutline = isDark ? '#09090b' : '#ffffff';
  const hoverFill = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';

  return (
    <div className="flex flex-col h-full">
      {/* Header Legend & Ringkasan */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-3 text-[11px]">
          <span className="inline-flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
            <span className="w-2.5 h-2.5 rounded-[1px] bg-amber-500 inline-block" />
            {t.panelLabel}:{' '}
            <strong className="font-mono text-amber-600 dark:text-amber-400 tabular-nums">
              {liveProgress.producedSoFar.toFixed(1)} kWh
            </strong>
          </span>
          <span className="inline-flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
            <span className="w-2.5 h-0.5 bg-emerald-600 dark:bg-emerald-400 inline-block" />
            {t.batteryLabel}:{' '}
            <strong className="font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
              {liveProgress.storedSoFar.toFixed(1)} / {results.usableBatteryKwh.toFixed(1)} kWh
            </strong>
          </span>
        </div>

        {/* Info Hover Per Jam atau Status Jam Live */}
        <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 tabular-nums">
          {hoveredPoint ? (
            <span>
              {hoveredPoint.label} ({hoveredPoint.ambientTemp}°C) • {t.panelLabel}{' '}
              <span className="text-amber-600 dark:text-amber-400 font-semibold">
                {hoveredPoint.solarKwh.toFixed(2)} kWh
              </span>{' '}
              • {t.batteryLabel}{' '}
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                {hoveredPoint.batteryStoredKwh.toFixed(1)} kWh (
                {hoveredPoint.batterySocPct.toFixed(0)}%)
              </span>
            </span>
          ) : isLive ? (
            <span className="text-zinc-500 dark:text-zinc-400">
              {t.runningTime}:{' '}
              <strong className="text-amber-600 dark:text-amber-400">
                {formatSunHour(currentTime)}
              </strong>
            </span>
          ) : (
            <span className="text-zinc-400 dark:text-zinc-500">{t.hoverHint}</span>
          )}
        </div>
      </div>

      {/* Canvas SVG Grafik */}
      <div className="relative flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/90 rounded overflow-hidden">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-zinc-500">
            {t.emptySchedule}
          </div>
        ) : (
          <svg
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            className="w-full h-full block"
            onMouseLeave={() => setHoveredIdx(null)}
          >
            {[0, 0.5, 1].map((ratio) => {
              const y = padTop + chartH - ratio * chartH;
              return (
                <g key={ratio}>
                  <line
                    x1={padLeft}
                    y1={y}
                    x2={width - padRight}
                    y2={y}
                    stroke={gridStroke}
                    strokeWidth="1"
                    strokeDasharray={ratio === 0 ? undefined : '2 3'}
                  />
                  <text
                    x={padLeft - 5}
                    y={y + 3}
                    textAnchor="end"
                    fill={axisText}
                    fontSize="9"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {(maxSolar * ratio).toFixed(1)}
                  </text>
                  <text
                    x={width - padRight + 5}
                    y={y + 3}
                    textAnchor="start"
                    fill={batteryStroke}
                    fontSize="9"
                    fontFamily="JetBrains Mono, monospace"
                    opacity="0.85"
                  >
                    {(maxBattery * ratio).toFixed(0)}
                  </text>
                </g>
              );
            })}

            {liveProgress.points.map((pt, idx) => {
              const xCenter = padLeft + idx * stepX + stepX / 2;
              const fullBarH = (pt.solarKwh / maxSolar) * chartH;
              const fullY = padTop + chartH - fullBarH;

              const activeBarH = (pt.activeSolar / maxSolar) * chartH;
              const activeY = padTop + chartH - activeBarH;
              const isHovered = hoveredIdx === idx;

              return (
                <g
                  key={pt.hour}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  className="cursor-crosshair"
                >
                  <rect
                    x={padLeft + idx * stepX}
                    y={padTop}
                    width={stepX}
                    height={chartH}
                    fill={isHovered ? hoverFill : 'transparent'}
                  />

                  {isLive && pt.fraction < 1 && (
                    <rect
                      x={xCenter - barWidth / 2}
                      y={fullY}
                      width={barWidth}
                      height={Math.max(0, fullBarH)}
                      rx="1"
                      fill="#f59e0b"
                      opacity="0.16"
                    />
                  )}

                  {activeBarH > 0 && (
                    <rect
                      x={xCenter - barWidth / 2}
                      y={activeY}
                      width={barWidth}
                      height={Math.max(0, activeBarH)}
                      rx="1"
                      fill={isHovered ? '#d97706' : '#f59e0b'}
                      opacity={isHovered ? 1 : 0.9}
                    />
                  )}

                  {(data.length <= 12 || idx % 2 === 0) && (
                    <text
                      x={xCenter}
                      y={height - 6}
                      textAnchor="middle"
                      fill={isHovered ? axisHoverText : axisText}
                      fontSize="9"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {String(pt.hour).padStart(2, '0')}
                    </text>
                  )}
                </g>
              );
            })}

            {visibleBatteryPoints.length > 1 && config.batteryKwh > 0 && (
              <path
                d={batteryPath}
                fill="none"
                stroke={batteryStroke}
                strokeWidth="2"
                strokeLinejoin="round"
              />
            )}

            {config.batteryKwh > 0 &&
              visibleBatteryPoints.map(({ pt, idx }) => {
                const x = padLeft + idx * stepX + stepX / 2;
                const y = padTop + chartH - (pt.activeStored / maxBattery) * chartH;
                const isHovered = hoveredIdx === idx;
                return (
                  <circle
                    key={`dot-${pt.hour}`}
                    cx={x}
                    cy={y}
                    r={isHovered ? 3.5 : 2}
                    fill={batteryStroke}
                    stroke={dotOutline}
                    strokeWidth="1"
                    pointerEvents="none"
                  />
                );
              })}

            {isLive && (
              <line
                x1={playheadX}
                y1={padTop}
                x2={playheadX}
                y2={padTop + chartH}
                stroke={isDark ? '#f59e0b' : '#d97706'}
                strokeWidth="1.2"
                strokeDasharray="3 2"
                pointerEvents="none"
              />
            )}
          </svg>
        )}
      </div>
    </div>
  );
}
