import { useState } from 'react';
import { getTranslations } from '../../i18n/translations';
import { useSolarStore } from '../../store/useSolarStore';
import { BuildingTab } from './BuildingTab';
import { PanelTab } from './PanelTab';

type LeftTab = 'building' | 'panel';

/**
 * Inspector Kiri (Light & Dark): Pengaturan Geometri Bangunan & Spesifikasi Modul Surya.
 */
export function LeftSidebar() {
  const [activeTab, setActiveTab] = useState<LeftTab>('building');
  const results = useSolarStore((state) => state.results);
  const lang = useSolarStore((state) => state.lang);
  const t = getTranslations(lang).left;

  return (
    <aside className="w-full lg:w-[310px] xl:w-[330px] bg-white dark:bg-[#111114] border-b lg:border-b-0 lg:border-r border-zinc-200 dark:border-zinc-800/90 flex flex-col shrink-0">
      {/* Tab Bar */}
      <div className="grid grid-cols-2 border-b border-zinc-200 dark:border-zinc-800/90 shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab('building')}
          className={`py-2.5 text-xs font-medium border-b-2 transition cursor-pointer ${
            activeTab === 'building'
              ? 'border-amber-500 text-zinc-900 dark:text-zinc-100 bg-zinc-50/80 dark:bg-zinc-900/40'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
          }`}
        >
          {t.tabBuilding}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('panel')}
          className={`py-2.5 text-xs font-medium border-b-2 transition cursor-pointer ${
            activeTab === 'panel'
              ? 'border-amber-500 text-zinc-900 dark:text-zinc-100 bg-zinc-50/80 dark:bg-zinc-900/40'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
          }`}
        >
          {t.tabPanel}
        </button>
      </div>

      {/* Konten Scrollable */}
      <div className="flex-1 lg:overflow-y-auto">
        {activeTab === 'building' ? <BuildingTab /> : <PanelTab />}
      </div>

      {/* Ringkasan Statis di Bawah Inspector */}
      <div className="border-t border-zinc-200 dark:border-zinc-800/90 bg-zinc-50 dark:bg-[#0e0e11] p-4 space-y-1.5 shrink-0">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-500">{t.effectiveArea}</span>
          <span className="font-mono text-zinc-700 dark:text-zinc-300 tabular-nums">
            {results.effectiveRoofArea.toFixed(1)} m²
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-500">{t.installedPanels}</span>
          <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
            {results.panelCount} {t.unit}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-500">{t.nominalCap}</span>
          <span className="font-mono font-semibold text-amber-600 dark:text-amber-400 tabular-nums">
            {results.totalStcKwp.toFixed(2)} kWp
          </span>
        </div>
      </div>
    </aside>
  );
}
