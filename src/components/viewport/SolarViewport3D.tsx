import { useEffect, useRef } from 'react';
import { SolarSceneEngine } from '../../engine/SolarSceneEngine';
import { useSolarStore } from '../../store/useSolarStore';
import { getTemperatureAtHour } from '../../utils/solarCalculator';
import { CompassWidget } from './CompassWidget';
import { SunControlBar } from './SunControlBar';
import { ViewportHUD } from './ViewportHUD';

// 1 siklus penuh (06:00 -> 18:00 = 12 jam simulasi) berjalan dalam ~24 detik
const SIM_HOURS_PER_SECOND = 0.5;
const TICK_MS = 100;

/**
 * Komponen Viewport 3D Interaktif yang menjembatani React + Zustand dengan SolarSceneEngine (Three.js),
 * termasuk jam simulasi berjalan (06:00 - 18:00) dan kompas real-time.
 */
export function SolarViewport3D() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const compassDialRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<SolarSceneEngine | null>(null);

  const config = useSolarStore((state) => state.config);
  const isSunPlaying = useSolarStore((state) => state.isSunPlaying);
  const cameraCommand = useSolarStore((state) => state.cameraCommand);
  const setGeometryStats = useSolarStore((state) => state.setGeometryStats);
  const registerSnapshotCapturer = useSolarStore((state) => state.registerSnapshotCapturer);

  // 1. Inisialisasi & pembersihan engine Three.js (Mount / Unmount)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const engine = new SolarSceneEngine(container, (azimuthDeg) => {
      if (compassDialRef.current) {
        compassDialRef.current.style.transform = `rotate(${azimuthDeg.toFixed(1)}deg)`;
      }
    });
    engineRef.current = engine;
    registerSnapshotCapturer(() => engine.captureSnapshot());

    return () => {
      registerSnapshotCapturer(null);
      engine.dispose();
      engineRef.current = null;
    };
  }, [registerSnapshotCapturer]);

  // 2. Rebuild geometri 3D hanya saat parameter fisik bangunan/panel/baterai berubah
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    const latestConfig = useSolarStore.getState().config;
    const { panelCount, effectiveRoofArea } = engine.rebuild(latestConfig);
    setGeometryStats(panelCount, effectiveRoofArea);
  }, [
    config.roofType,
    config.flatTilt,
    config.gablePitch,
    config.gableSide,
    config.indPitch,
    config.bldgLength,
    config.bldgWidth,
    config.bldgHeight,
    config.setback,
    config.panelLength,
    config.panelWidth,
    config.panelGap,
    config.orientation,
    config.batteryKwh,
    setGeometryStats,
  ]);

  // 3. Timer waktu berjalan otomatis (06:00 -> 18:00 lalu loop kembali ke 06:00)
  //    sekaligus menyinkronkan suhu lingkungan berjalan secara halus
  useEffect(() => {
    if (!isSunPlaying) return;

    const intervalId = window.setInterval(() => {
      const store = useSolarStore.getState();
      const rawNext = store.config.sunHour + (SIM_HOURS_PER_SECOND * TICK_MS) / 1000;
      const nextHour = rawNext > 18 ? 6 : rawNext;

      if (store.chartMode === 'live') {
        const liveTemp = getTemperatureAtHour(
          store.config.tempSchedule,
          nextHour,
          store.config.ambientTemp
        );
        store.updateConfig({ sunHour: nextHour, ambientTemp: liveTemp });
      } else {
        store.updateConfig({ sunHour: nextHour });
      }
    }, TICK_MS);

    return () => window.clearInterval(intervalId);
  }, [isSunPlaying]);

  // 4. Perbarui posisi matahari 3D tanpa membangun ulang mesh bangunan
  useEffect(() => {
    engineRef.current?.updateSunPosition(config.sunHour);
  }, [config.sunHour]);

  // 5. Tangani perintah sudut kamera cepat (3D Iso, Atas, Inverter, atau Preset Rumah/Pabrik)
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine || !cameraCommand) return;

    if (cameraCommand.type === 'custom' && cameraCommand.custom) {
      engine.focusCamera(cameraCommand.custom.position, cameraCommand.custom.target);
    } else if (cameraCommand.type !== 'custom') {
      const latestConfig = useSolarStore.getState().config;
      engine.applyCameraPreset(cameraCommand.type, latestConfig);
    }
  }, [cameraCommand]);

  return (
    <main className="relative flex-1 min-h-[380px] sm:min-h-[460px] lg:min-h-0 bg-[#e8eef4] overflow-hidden">
      <div ref={containerRef} className="w-full h-full" />
      <ViewportHUD />
      <CompassWidget dialRef={compassDialRef} />
      <SunControlBar />
    </main>
  );
}
