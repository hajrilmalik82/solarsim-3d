import { InverterBatteryCard } from './InverterBatteryCard';
import { TempRadiationCard } from './TempRadiationCard';

/**
 * Inspector Kanan (Light & Dark): Simulasi Suhu, Radiasi, Inverter & Baterai.
 */
export function RightSidebar() {
  return (
    <aside className="w-full lg:w-[320px] xl:w-[340px] bg-white dark:bg-[#111114] border-t lg:border-t-0 lg:border-l border-zinc-200 dark:border-zinc-800/90 lg:overflow-y-auto divide-y divide-zinc-200 dark:divide-zinc-800/80 shrink-0">
      <TempRadiationCard />
      <InverterBatteryCard />
    </aside>
  );
}
