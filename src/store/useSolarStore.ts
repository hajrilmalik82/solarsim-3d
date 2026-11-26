import { create } from 'zustand';
import { DEFAULT_SOLAR_CONFIG } from '../constants/presets';
import type {
  CameraFocusTarget,
  CameraPreset,
  ChartMode,
  GlobalPreset,
  Language,
  SolarConfig,
  SolarResults,
  TempScheduleSlot,
  ThemeMode,
} from '../types/solar.types';
import {
  calculateAutoSize,
  calculateSolarPerformance,
  getTemperatureAtHour,
} from '../utils/solarCalculator';

interface CameraCommand {
  type: CameraPreset | 'custom';
  custom?: CameraFocusTarget;
  seq: number;
}

interface SolarStoreState {
  config: SolarConfig;
  results: SolarResults;
  clientName: string;
  isReportModalOpen: boolean;
  printSnapshotUrl: string;
  cameraCommand: CameraCommand | null;
  snapshotCapturer: (() => string | null) | null;
  isSunPlaying: boolean;
  chartMode: ChartMode;
  lang: Language;
  theme: ThemeMode;

  // Actions
  updateConfig: (partial: Partial<SolarConfig>) => void;
  setGeometryStats: (panelCount: number, effectiveRoofArea: number) => void;
  applyGlobalPreset: (preset: GlobalPreset) => void;
  autoSizeSystem: () => void;
  setClientName: (name: string) => void;
  setReportModalOpen: (open: boolean) => void;
  triggerCameraPreset: (preset: CameraPreset) => void;
  registerSnapshotCapturer: (fn: (() => string | null) | null) => void;
  captureSnapshotForPrint: () => string;
  addTempSlot: () => void;
  updateTempSlot: (id: string, partial: Partial<Omit<TempScheduleSlot, 'id'>>) => void;
  removeTempSlot: (id: string) => void;
  setSunPlaying: (playing: boolean) => void;
  toggleSunPlaying: () => void;
  resetSunClock: () => void;
  setChartMode: (mode: ChartMode) => void;
  setLang: (lang: Language) => void;
  toggleTheme: () => void;
}

const INITIAL_RESULTS = calculateSolarPerformance(DEFAULT_SOLAR_CONFIG, 0, 0);

function getInitialLanguage(): Language {
  try {
    const saved = window.localStorage.getItem('solarsim-lang');
    if (saved === 'en' || saved === 'id') return saved;
  } catch {
    // Abaikan jika localStorage tidak tersedia
  }
  return 'id';
}

function getInitialTheme(): ThemeMode {
  try {
    const saved = window.localStorage.getItem('solarsim-theme');
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    // Abaikan jika localStorage tidak tersedia
  }
  return 'light';
}

export const useSolarStore = create<SolarStoreState>((set, get) => ({
  config: DEFAULT_SOLAR_CONFIG,
  results: INITIAL_RESULTS,
  clientName: 'PLTS Atap Gedung Komersial / Pabrik',
  isReportModalOpen: false,
  printSnapshotUrl: '',
  cameraCommand: null,
  snapshotCapturer: null,
  isSunPlaying: true,
  chartMode: 'live',
  lang: getInitialLanguage(),
  theme: getInitialTheme(),

  updateConfig: (partial) =>
    set((state) => {
      const nextConfig = { ...state.config, ...partial };
      const nextResults = calculateSolarPerformance(
        nextConfig,
        state.results.panelCount,
        state.results.effectiveRoofArea
      );
      return { config: nextConfig, results: nextResults };
    }),

  setGeometryStats: (panelCount, effectiveRoofArea) =>
    set((state) => ({
      results: calculateSolarPerformance(state.config, panelCount, effectiveRoofArea),
    })),

  applyGlobalPreset: (preset) =>
    set((state) => {
      const nextConfig = { ...state.config, ...preset.config };
      const nextResults = calculateSolarPerformance(
        nextConfig,
        state.results.panelCount,
        state.results.effectiveRoofArea
      );
      return {
        config: nextConfig,
        results: nextResults,
        cameraCommand: {
          type: 'custom',
          custom: preset.camera,
          seq: Date.now(),
        },
      };
    }),

  autoSizeSystem: () => {
    const { results, updateConfig } = get();
    const { inverterKw, batteryKwh } = calculateAutoSize(
      results.totalStcKwp,
      results.dailyEnergyKwh
    );
    updateConfig({ inverterKw, batteryKwh });
  },

  setClientName: (clientName) => set({ clientName }),

  setReportModalOpen: (isReportModalOpen) => set({ isReportModalOpen }),

  triggerCameraPreset: (preset) =>
    set({
      cameraCommand: {
        type: preset,
        seq: Date.now(),
      },
    }),

  registerSnapshotCapturer: (snapshotCapturer) => set({ snapshotCapturer }),

  captureSnapshotForPrint: () => {
    const capturer = get().snapshotCapturer;
    const dataUrl = capturer ? capturer() || '' : '';
    set({ printSnapshotUrl: dataUrl });
    return dataUrl;
  },

  addTempSlot: () =>
    set((state) => {
      const slots = state.config.tempSchedule;
      const lastEnd = slots.length > 0 ? slots[slots.length - 1].endHour : 6;
      const startHour = Math.min(22, lastEnd);
      const endHour = Math.min(24, startHour + 2);
      const nextSlot: TempScheduleSlot = {
        id: `slot-${Date.now()}`,
        startHour,
        endHour,
        ambientTemp: 30,
      };
      return {
        config: {
          ...state.config,
          tempSchedule: [...slots, nextSlot],
        },
      };
    }),

  updateTempSlot: (id, partial) =>
    set((state) => ({
      config: {
        ...state.config,
        tempSchedule: state.config.tempSchedule.map((slot) => {
          if (slot.id !== id) return slot;
          const merged = { ...slot, ...partial };
          // Pastikan endHour selalu lebih besar dari startHour
          if (merged.endHour <= merged.startHour) {
            merged.endHour = Math.min(24, merged.startHour + 1);
          }
          return merged;
        }),
      },
    })),

  removeTempSlot: (id) =>
    set((state) => ({
      config: {
        ...state.config,
        tempSchedule: state.config.tempSchedule.filter((slot) => slot.id !== id),
      },
    })),

  setSunPlaying: (isSunPlaying) => set({ isSunPlaying }),

  toggleSunPlaying: () => set((state) => ({ isSunPlaying: !state.isSunPlaying })),

  resetSunClock: () =>
    set((state) => {
      const morningTemp = getTemperatureAtHour(
        state.config.tempSchedule,
        6,
        state.config.ambientTemp
      );
      const nextConfig = {
        ...state.config,
        sunHour: 6,
        ambientTemp: state.chartMode === 'live' ? morningTemp : state.config.ambientTemp,
      };
      return {
        config: nextConfig,
        results: calculateSolarPerformance(
          nextConfig,
          state.results.panelCount,
          state.results.effectiveRoofArea
        ),
        isSunPlaying: true,
      };
    }),

  setChartMode: (chartMode) => set({ chartMode }),

  setLang: (lang) => {
    try {
      window.localStorage.setItem('solarsim-lang', lang);
    } catch {
      // Abaikan jika localStorage tidak tersedia
    }
    set({ lang });
  },

  toggleTheme: () =>
    set((state) => {
      const next: ThemeMode = state.theme === 'light' ? 'dark' : 'light';
      try {
        window.localStorage.setItem('solarsim-theme', next);
      } catch {
        // Abaikan jika localStorage tidak tersedia
      }
      return { theme: next };
    }),
}));
