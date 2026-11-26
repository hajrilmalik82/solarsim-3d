import { getTranslations } from '../i18n/translations';
import type {
  HourlySimulationPoint,
  InverterStatusInfo,
  Language,
  SolarConfig,
  SolarResults,
  TempScheduleSlot,
} from '../types/solar.types';

const STC_REFERENCE_TEMP_C = 25;
const CELL_TEMP_RISE_C = 20; // Rata-rata kenaikan suhu operasional harian sel surya di atas suhu lingkungan
const SYSTEM_EFFICIENCY = 0.94; // Rugi-rugi kabel DC/AC & debu ringan (~6%)

/**
 * Pure Function: Menghitung performa listrik PLTS berdasarkan jumlah panel, luas atap,
 * suhu lingkungan, inverter, dan kapasitas baterai.
 */
export function calculateSolarPerformance(
  config: SolarConfig,
  panelCount: number,
  effectiveRoofArea: number
): SolarResults {
  // 1. Kapasitas Nominal STC (kWp)
  const totalStcKwp = (panelCount * config.panelWp) / 1000;

  // 2. Estimasi Suhu Sel Panel Operasional
  const cellTemp = config.ambientTemp + CELL_TEMP_RISE_C;

  // 3. Penurunan Efisiensi Akibat Suhu (Referensi STC = 25°C)
  const deltaT = cellTemp - STC_REFERENCE_TEMP_C;
  const tempFactor = Math.max(0.5, 1 + (config.tempCoeff / 100) * deltaT);
  const tempLossPct = (1 - tempFactor) * 100;

  // 4. Daya Output Aktual & Estimasi Produksi Energi
  const actualPowerKw = totalStcKwp * tempFactor;
  const dailyEnergyKwh = actualPowerKw * config.psh * SYSTEM_EFFICIENCY;
  const monthlyEnergyKwh = dailyEnergyKwh * 30;

  // 5. Analisis Inverter (DC-to-AC Ratio)
  const invKw = Math.max(0.5, config.inverterKw);
  const dcAcRatio = totalStcKwp > 0 ? totalStcKwp / invKw : 0;

  // 6. Analisis Penyimpanan Baterai
  const usableBatteryKwh = config.batteryKwh * config.batteryDod;
  const batteryFillPct =
    usableBatteryKwh > 0 ? Math.min(100, (dailyEnergyKwh / usableBatteryKwh) * 100) : 0;
  const backupHours = config.backupLoadKw > 0 ? usableBatteryKwh / config.backupLoadKw : 0;

  return {
    effectiveRoofArea,
    panelCount,
    totalStcKwp,
    cellTemp,
    tempLossPct,
    actualPowerKw,
    dailyEnergyKwh,
    monthlyEnergyKwh,
    dcAcRatio,
    usableBatteryKwh,
    batteryFillPct,
    backupHours,
  };
}

/**
 * Mengevaluasi status rasio DC/AC inverter untuk indikator UI (Light Theme).
 */
export function getInverterStatus(dcAcRatio: number, lang: Language = 'id'): InverterStatusInfo {
  const loadPct = Math.min(100, (dcAcRatio / 1.35) * 100);
  const t = getTranslations(lang).right.invStatus;

  if (dcAcRatio === 0) {
    return {
      label: t.none,
      ratioClass: 'text-zinc-500',
      statusClass: 'text-zinc-500',
      barClass: 'bg-zinc-400',
      loadPct: 0,
    };
  }
  if (dcAcRatio < 0.85) {
    return {
      label: t.oversized,
      ratioClass: 'text-sky-600 dark:text-sky-400',
      statusClass: 'text-sky-600 dark:text-sky-400',
      barClass: 'bg-sky-500',
      loadPct,
    };
  }
  if (dcAcRatio <= 1.25) {
    return {
      label: t.optimal,
      ratioClass: 'text-emerald-600 dark:text-emerald-400',
      statusClass: 'text-emerald-600 dark:text-emerald-400',
      barClass: 'bg-emerald-500',
      loadPct,
    };
  }
  return {
    label: t.clipping,
    ratioClass: 'text-amber-600 dark:text-amber-400',
    statusClass: 'text-amber-600 dark:text-amber-400',
    barClass: 'bg-amber-500',
    loadPct,
  };
}

/**
 * Menghitung rekomendasi kapasitas Inverter (kW) & Bank Baterai (kWh) otomatis.
 */
export function calculateAutoSize(totalStcKwp: number, dailyEnergyKwh: number) {
  const inverterKw = Math.max(2, Math.ceil(totalStcKwp / 1.1 / 5) * 5);
  const batteryKwh = Math.max(10, Math.round((dailyEnergyKwh * 0.65) / 5) * 5);
  return { inverterKw, batteryKwh };
}

/**
 * Pure Function: Menghitung suhu lingkungan aktual pada jam tertentu (desimal, misal 13.4)
 * dengan interpolasi halus berdasarkan jadwal segmen waktu & suhu.
 * Menghasilkan kurva suhu harian realistis (sejuk pagi -> puncak panas siang -> turun sore).
 */
export function getTemperatureAtHour(
  tempSchedule: TempScheduleSlot[],
  sunHour: number,
  fallbackTemp: number
): number {
  if (tempSchedule.length === 0) return fallbackTemp;

  const sorted = [...tempSchedule].sort((a, b) => a.startHour - b.startHour);
  const anchors: Array<{ hour: number; temp: number }> = [];

  // Awal pagi sedikit lebih sejuk (-2°C dari target segmen pertama)
  anchors.push({
    hour: sorted[0].startHour,
    temp: Math.max(15, sorted[0].ambientTemp - 2),
  });

  // Titik tengah tiap segmen mencapai suhu tepat sesuai konfigurasi user
  for (const slot of sorted) {
    anchors.push({
      hour: (slot.startHour + slot.endHour) / 2,
      temp: slot.ambientTemp,
    });
  }

  // Akhir sore mulai mendingin (-2°C dari target segmen terakhir)
  const last = sorted[sorted.length - 1];
  anchors.push({
    hour: last.endHour,
    temp: Math.max(15, last.ambientTemp - 2),
  });

  if (sunHour <= anchors[0].hour) return Number(anchors[0].temp.toFixed(1));
  if (sunHour >= anchors[anchors.length - 1].hour) {
    return Number(anchors[anchors.length - 1].temp.toFixed(1));
  }

  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i];
    const b = anchors[i + 1];
    if (sunHour >= a.hour && sunHour <= b.hour) {
      const span = b.hour - a.hour || 1;
      const t = (sunHour - a.hour) / span;
      const temp = a.temp + (b.temp - a.temp) * t;
      return Number(temp.toFixed(1));
    }
  }

  return fallbackTemp;
}

/**
 * Pure Function: Mensimulasikan profil produksi energi panel surya & akumulasi
 * penyimpanan baterai jam-per-jam berdasarkan jadwal rentang waktu & suhu.
 */
export function simulateHourlyProfile(
  config: SolarConfig,
  results: SolarResults
): HourlySimulationPoint[] {
  const slots = config.tempSchedule;
  const minHour =
    slots.length > 0 ? Math.max(0, Math.min(...slots.map((s) => s.startHour))) : 6;
  const maxHour =
    slots.length > 0 ? Math.min(24, Math.max(...slots.map((s) => s.endHour))) : 18;

  const usableCap = results.usableBatteryKwh;
  const points: HourlySimulationPoint[] = [];
  let storedKwh = 0;

  for (let h = minHour; h < maxHour; h++) {
    // Cari segmen jadwal yang mencakup jam h
    const activeSlot = slots.find((s) => h >= s.startHour && h < s.endHour);
    const ambientTemp = activeSlot ? activeSlot.ambientTemp : config.ambientTemp;

    // Faktor iradiasi matahari berbasis kurva sinus alami (06:00 - 18:00, puncak 12:00)
    const midHour = h + 0.5;
    const irradianceFactor =
      midHour > 6 && midHour < 18 ? Math.max(0, Math.sin(((midHour - 6) / 12) * Math.PI)) : 0;

    // Suhu sel meningkat proporsional dengan iradiasi
    const cellTemp = ambientTemp + CELL_TEMP_RISE_C * irradianceFactor;
    const deltaT = cellTemp - STC_REFERENCE_TEMP_C;
    const tempFactor = Math.max(0.5, 1 + (config.tempCoeff / 100) * deltaT);

    // Energi dihasilkan dalam 1 jam tersebut (dibatasi kapasitas AC inverter)
    const rawKwh = results.totalStcKwp * irradianceFactor * tempFactor * SYSTEM_EFFICIENCY;
    const solarKwh = Math.min(rawKwh, config.inverterKw);

    // Akumulasi penyimpanan ke bank baterai
    const remainingRoom = Math.max(0, usableCap - storedKwh);
    const addedToBattery = Math.min(solarKwh, remainingRoom);
    storedKwh += addedToBattery;

    const surplusKwh = Math.max(0, solarKwh - addedToBattery);
    const batterySocPct = usableCap > 0 ? Math.min(100, (storedKwh / usableCap) * 100) : 0;

    points.push({
      hour: h,
      label: `${String(h).padStart(2, '0')}:00`,
      ambientTemp,
      cellTemp,
      irradianceFactor,
      solarKwh,
      batteryStoredKwh: storedKwh,
      batterySocPct,
      surplusKwh,
    });
  }

  return points;
}
