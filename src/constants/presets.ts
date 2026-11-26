import type {
  GlobalPreset,
  PanelPreset,
  RoofType,
  SolarConfig,
} from '../types/solar.types';

/**
 * Konfigurasi awal default saat aplikasi pertama kali dibuka.
 */
export const DEFAULT_SOLAR_CONFIG: SolarConfig = {
  roofType: 'flat',
  flatTilt: 12,
  gablePitch: 22,
  gableSide: 'both',
  indPitch: 10,

  bldgLength: 20,
  bldgWidth: 12,
  bldgHeight: 5,
  setback: 0.6,

  panelLength: 2.28,
  panelWidth: 1.13,
  panelWp: 550,
  panelGap: 0.05,
  orientation: 'portrait',

  ambientTemp: 25,
  tempCoeff: -0.35,
  psh: 4.5,
  sunHour: 6,
  tempSchedule: [
    { id: 'slot-morning', startHour: 6, endHour: 10, ambientTemp: 27 },
    { id: 'slot-noon', startHour: 10, endHour: 15, ambientTemp: 35 },
    { id: 'slot-afternoon', startHour: 15, endHour: 18, ambientTemp: 30 },
  ],

  inverterKw: 30,
  batteryKwh: 40,
  batteryDod: 0.9,
  backupLoadKw: 5,
};

/**
 * Daftar pilihan tipe bangunan & atap.
 */
export const ROOF_TYPE_OPTIONS: Array<{
  value: RoofType;
  title: string;
  subtitle: string;
}> = [
  { value: 'flat', title: '1 Atap Datar', subtitle: 'Dak beton + tilt rack' },
  { value: 'gable', title: '2 Atap Pelana', subtitle: '2 sisi miring simetris' },
  { value: 'industrial', title: 'Gudang / Pabrik', subtitle: 'Bentang lebar industri' },
];

/**
 * Preset ukuran fisik modul surya yang umum beredar di pasaran.
 */
export const PANEL_PRESETS: PanelPreset[] = [
  { id: '450wp', label: '450Wp Pendek', length: 1.72, width: 1.13, wp: 450 },
  { id: '550wp', label: '550Wp Standar', length: 2.28, width: 1.13, wp: 550 },
  { id: '660wp', label: '660Wp Jumbo', length: 2.38, width: 1.3, wp: 660 },
];

/**
 * Opsi Depth of Discharge (DoD) berdasarkan jenis teknologi baterai.
 */
export const BATTERY_DOD_OPTIONS = [
  { value: 0.8, label: '80% (LiFePO4 Standar)' },
  { value: 0.9, label: '90% (LiFePO4 High)' },
  { value: 0.5, label: '50% (Lead-Acid / Gel)' },
];

/**
 * Preset cepat skala hunian (Rumah Tinggal).
 */
export const RESIDENTIAL_PRESET: GlobalPreset = {
  id: 'residential',
  label: 'Preset Rumah',
  config: {
    roofType: 'gable',
    bldgLength: 12,
    bldgWidth: 9,
    bldgHeight: 4,
    gablePitch: 25,
    gableSide: 'single',
    panelLength: 1.72,
    panelWidth: 1.13,
    panelWp: 450,
    inverterKw: 6,
    batteryKwh: 15,
    backupLoadKw: 2,
  },
  camera: {
    position: [18, 14, 20],
    target: [0, 2.5, 0],
  },
};

/**
 * Preset cepat skala industri (Pabrik / Gudang Komersial).
 */
export const FACTORY_PRESET: GlobalPreset = {
  id: 'factory',
  label: 'Preset Pabrik',
  config: {
    roofType: 'industrial',
    bldgLength: 42,
    bldgWidth: 24,
    bldgHeight: 9,
    indPitch: 10,
    panelLength: 2.28,
    panelWidth: 1.13,
    panelWp: 550,
    inverterKw: 150,
    batteryKwh: 200,
    backupLoadKw: 35,
  },
  camera: {
    position: [48, 34, 52],
    target: [0, 5, 0],
  },
};
