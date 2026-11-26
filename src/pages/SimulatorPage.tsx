import { MonitoringDock } from '../components/analytics/MonitoringDock';
import { PrintReportSheet } from '../components/report/PrintReportSheet';
import { ReportModal } from '../components/report/ReportModal';
import { LeftSidebar } from '../components/sidebar-left/LeftSidebar';
import { RightSidebar } from '../components/sidebar-right/RightSidebar';
import { SolarViewport3D } from '../components/viewport/SolarViewport3D';

/**
 * Halaman Utama ('/'): Simulator Pemasangan & Performa PLTS Atap 3D.
 * Panel Kiri (Geometri), Tengah (Viewport 3D + Grafik & Jadwal), Panel Kanan (Suhu, Inverter & Baterai).
 */
export function SimulatorPage() {
  return (
    <>
      <PrintReportSheet />

      <div className="no-print flex-1 flex flex-col lg:flex-row lg:overflow-hidden">
        <LeftSidebar />

        <div className="flex-1 flex flex-col min-w-0 lg:overflow-hidden">
          <SolarViewport3D />
          <MonitoringDock />
        </div>

        <RightSidebar />
      </div>

      <ReportModal />
    </>
  );
}
