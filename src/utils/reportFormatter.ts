import type { Language, SolarConfig, SolarResults } from '../types/solar.types';

/**
 * Mengembalikan label deskriptif tipe atap sesuai bahasa aktif.
 */
export function getRoofTypeLabel(config: SolarConfig, lang: Language = 'id'): string {
  if (lang === 'en') {
    switch (config.roofType) {
      case 'flat':
        return `Flat Roof (Tilt ${config.flatTilt}°)`;
      case 'gable':
        return `Gable Roof (${config.gableSide === 'both' ? '2 Sides' : '1 Side'}, Pitch ${config.gablePitch}°)`;
      case 'industrial':
        return `Warehouse / Factory Roof (Pitch ${config.indPitch}°)`;
      default:
        return config.roofType;
    }
  }

  switch (config.roofType) {
    case 'flat':
      return `1 Atap Datar (Tilt ${config.flatTilt}°)`;
    case 'gable':
      return `2 Atap Pelana (${config.gableSide === 'both' ? '2 Sisi' : '1 Sisi'}, Sudut ${config.gablePitch}°)`;
    case 'industrial':
      return `Gudang / Pabrik Industri (Sudut ${config.indPitch}°)`;
    default:
      return config.roofType;
  }
}

/**
 * Memformat jam matahari desimal (contoh: 12.5 atau 8.25) menjadi string "HH:MM".
 */
export function formatSunHour(sunHour: number): string {
  const clamped = Math.max(0, Math.min(24, sunHour));
  const totalMinutes = Math.round(clamped * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/**
 * Menghasilkan teks laporan simulasi dalam Bahasa Indonesia atau Bahasa Inggris.
 */
export function formatClientReportText(
  clientName: string,
  config: SolarConfig,
  results: SolarResults,
  lang: Language = 'id'
): string {
  if (lang === 'en') {
    const projectTitle = clientName.trim() || 'Rooftop Solar PV Project';
    const monthlyFormatted = Math.round(results.monthlyEnergyKwh).toLocaleString('en-US');

    return `*ROOFTOP SOLAR PV SIMULATION REPORT*
Project: ${projectTitle}
----------------------------------------
1. BUILDING & ROOF SPECIFICATIONS
- Roof Type: ${getRoofTypeLabel(config, 'en')}
- Building Dimensions: ${config.bldgLength}m x ${config.bldgWidth}m (Height ${config.bldgHeight}m)
- Effective Roof Area: ${results.effectiveRoofArea.toFixed(1)} m²

2. SOLAR PANEL CONFIGURATION
- Module Size: ${config.panelLength}m x ${config.panelWidth}m (${config.panelWp} Wp, ${config.orientation})
- Total Installed: ${results.panelCount} modules
- Nominal Capacity (STC): ${results.totalStcKwp.toFixed(2)} kWp

3. TEMPERATURE & ENERGY YIELD SIMULATION
- Ambient Temperature: ${config.ambientTemp.toFixed(1)}°C (Est. Cell Temp: ${results.cellTemp.toFixed(1)}°C)
- Thermal Derating: -${results.tempLossPct.toFixed(1)}%
- Effective Actual Output: ${results.actualPowerKw.toFixed(2)} kW
- Estimated Yield (PSH ${config.psh} hrs): ${results.dailyEnergyKwh.toFixed(1)} kWh/day (~${monthlyFormatted} kWh/month)

4. INVERTER & BATTERY STORAGE
- Inverter Capacity: ${config.inverterKw} kW AC (DC/AC Ratio: ${results.dcAcRatio.toFixed(2)})
- Battery Bank: ${config.batteryKwh} kWh (Usable at ${Math.round(config.batteryDod * 100)}% DoD: ${results.usableBatteryKwh.toFixed(1)} kWh)
- Estimated Backup at ${config.backupLoadKw} kW load: ~${results.backupHours.toFixed(1)} hours`;
  }

  const projectTitle = clientName.trim() || 'Proyek PLTS Atap';
  const monthlyFormatted = Math.round(results.monthlyEnergyKwh).toLocaleString('id-ID');

  return `*LAPORAN SIMULASI PLTS ATAP*
Proyek: ${projectTitle}
----------------------------------------
1. SPESIFIKASI BANGUNAN & ATAP
- Tipe Atap: ${getRoofTypeLabel(config, 'id')}
- Dimensi Bangunan: ${config.bldgLength}m x ${config.bldgWidth}m (Tinggi ${config.bldgHeight}m)
- Luas Atap Efektif: ${results.effectiveRoofArea.toFixed(1)} m²

2. KONFIGURASI PANEL SURYA
- Ukuran Modul: ${config.panelLength}m x ${config.panelWidth}m (${config.panelWp} Wp, ${config.orientation})
- Total Terpasang: ${results.panelCount} lembar panel
- Kapasitas Nominal (STC): ${results.totalStcKwp.toFixed(2)} kWp

3. SIMULASI SUHU & PRODUKSI ENERGI
- Suhu Lingkungan: ${config.ambientTemp.toFixed(1)}°C (Est. Suhu Sel: ${results.cellTemp.toFixed(1)}°C)
- Penurunan Efisiensi Suhu: -${results.tempLossPct.toFixed(1)}%
- Daya Aktual Efektif: ${results.actualPowerKw.toFixed(2)} kW
- Estimasi Produksi (PSH ${config.psh} jam): ${results.dailyEnergyKwh.toFixed(1)} kWh/hari (~${monthlyFormatted} kWh/bulan)

4. INVERTER & PENYIMPANAN BATERAI
- Kapasitas Inverter: ${config.inverterKw} kW AC (Rasio DC/AC: ${results.dcAcRatio.toFixed(2)})
- Kapasitas Baterai: ${config.batteryKwh} kWh (Efektif DoD ${Math.round(config.batteryDod * 100)}%: ${results.usableBatteryKwh.toFixed(1)} kWh)
- Estimasi Backup Beban ${config.backupLoadKw} kW: ±${results.backupHours.toFixed(1)} jam`;
}
