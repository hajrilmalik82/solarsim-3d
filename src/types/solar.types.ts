/**
 * Definisi tipe data inti untuk SolarSim 3D.
 * Memisahkan kontrak data agar aman (type-safe) dan mudah dirawat jangka panjang.
 */

export type RoofType = 'flat' | 'gable' | 'industrial';
export type GableSide = 'both' | 'single';
export type PanelOrientation = 'portrait' | 'landscape';
export type CameraPreset = 'iso' | 'top' | 'inverter';
export type ChartMode = 'live' | 'manual';
export type Language = 'id' | 'en';
export type ThemeMode = 'light' | 'dark';

export interface TempScheduleSlot {
  id: string;
  startHour: number; // 0 - 23
  endHour: number;   // 1 - 24
  ambientTemp: number; // °C
}

export interface HourlySimulationPoint {
  hour: number;
  label: string;
  ambientTemp: number;
  cellTemp: number;
  irradianceFactor: number;
  solarKwh: number;
  batteryStoredKwh: number;
  batterySocPct: number;
  surplusKwh: number;
}

export interface SolarConfig {
  // Pengaturan atap & bentuk bangunan
  roofType: RoofType;
  flatTilt: number;         // derajat kemiringan mounting pada atap datar
  gablePitch: number;       // derajat kemiringan atap pelana
  gableSide: GableSide;     // kedua sisi atau 1 sisi utama
  indPitch: number;         // derajat kemiringan atap pabrik/gudang

  // Dimensi bangunan (meter)
  bldgLength: number;       // sumbu X
  bldgWidth: number;        // sumbu Z
  bldgHeight: number;       // sumbu Y
  setback: number;          // jarak aman tepi atap (meter)

  // Spesifikasi fisik modul surya
  panelLength: number;      // meter
  panelWidth: number;       // meter
  panelWp: number;          // Watt-peak per modul
  panelGap: number;         // jarak antar-panel (meter)
  orientation: PanelOrientation;

  // Parameter simulasi suhu, radiasi & matahari
  ambientTemp: number;      // °C
  tempCoeff: number;        // %/°C di atas 25°C (bernilai negatif)
  psh: number;              // Peak Sun Hours (jam/hari)
  sunHour: number;          // Jam simulasi 3D (07:00 - 17:00)
  tempSchedule: TempScheduleSlot[]; // Jadwal rentang waktu & suhu harian

  // Parameter Inverter & Penyimpanan Baterai
  inverterKw: number;       // kW AC
  batteryKwh: number;       // kWh total kapasitas baterai
  batteryDod: number;       // Depth of Discharge (0.5 - 0.9)
  backupLoadKw: number;     // kW beban prioritas saat mati lampu
}

export interface SolarResults {
  effectiveRoofArea: number;
  panelCount: number;
  totalStcKwp: number;
  cellTemp: number;
  tempLossPct: number;
  actualPowerKw: number;
  dailyEnergyKwh: number;
  monthlyEnergyKwh: number;
  dcAcRatio: number;
  usableBatteryKwh: number;
  batteryFillPct: number;
  backupHours: number;
}

export interface PanelPreset {
  id: string;
  label: string;
  length: number;
  width: number;
  wp: number;
}

export interface CameraFocusTarget {
  position: [number, number, number];
  target: [number, number, number];
}

export interface GlobalPreset {
  id: string;
  label: string;
  config: Partial<SolarConfig>;
  camera: CameraFocusTarget;
}

export interface InverterStatusInfo {
  label: string;
  ratioClass: string;
  statusClass: string;
  barClass: string;
  loadPct: number;
}
