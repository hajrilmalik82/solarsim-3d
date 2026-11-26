import type { RefObject } from 'react';
import { getTranslations } from '../../i18n/translations';
import { useSolarStore } from '../../store/useSolarStore';

interface CompassWidgetProps {
  dialRef: RefObject<HTMLDivElement | null>;
}

/**
 * Kompas arah mata angin (Light & Dark) yang berputar 60 FPS mengikuti kamera 3D.
 */
export function CompassWidget({ dialRef }: CompassWidgetProps) {
  const lang = useSolarStore((state) => state.lang);
  const c = getTranslations(lang).hud.compass;

  return (
    <div
      aria-label={c.title}
      title={c.title}
      className="absolute top-14 right-3 w-14 h-14 rounded-full bg-white/92 dark:bg-[#111114]/90 border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-center justify-center pointer-events-none select-none"
    >
      <div ref={dialRef} className="relative w-full h-full will-change-transform">
        <span className="absolute top-1 left-1/2 -translate-x-1/2 font-mono text-[9px] font-bold text-rose-600 dark:text-rose-400 leading-none">
          {c.n}
        </span>
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 font-mono text-[9px] font-medium text-zinc-400 dark:text-zinc-500 leading-none">
          {c.s}
        </span>
        <span className="absolute right-1.5 top-1/2 -translate-y-1/2 font-mono text-[9px] font-medium text-zinc-600 dark:text-zinc-400 leading-none">
          {c.e}
        </span>
        <span className="absolute left-1.5 top-1/2 -translate-y-1/2 font-mono text-[9px] font-medium text-zinc-600 dark:text-zinc-400 leading-none">
          {c.w}
        </span>

        <svg viewBox="0 0 40 40" className="w-full h-full p-3">
          <polygon points="20,6 23,20 17,20" fill="#e11d48" />
          <polygon points="20,34 23,20 17,20" fill="#71717a" />
          <circle cx="20" cy="20" r="2" fill="#52525b" />
        </svg>
      </div>
    </div>
  );
}
