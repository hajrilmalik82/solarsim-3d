import * as THREE from 'three';
import type { SolarConfig } from '../../types/solar.types';

export interface RectangularZoneOptions {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  getYAt: (x: number, z: number) => number;
  slopeAngleX?: number;
  panelTiltX?: number;
  isExcluded?: (cx: number, cz: number, pw: number, pd: number) => boolean;
}

/**
 * Membuat satu mesh panel surya 3D lengkap dengan bingkai aluminium dan tekstur sel.
 */
export function createSolarPanelMesh(
  wX: number,
  dZ: number,
  solarTexture: THREE.Texture,
  tiltRad = 0
): THREE.Mesh {
  const thickness = 0.045;
  const geo = new THREE.BoxGeometry(wX, thickness, dZ);
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0xcbd5e1,
    metalness: 0.7,
    roughness: 0.3,
  });
  const cellMat = new THREE.MeshStandardMaterial({
    map: solarTexture,
    metalness: 0.35,
    roughness: 0.22,
  });

  // Urutan face BoxGeometry: +X, -X, +Y (atas), -Y (bawah), +Z, -Z
  const materials = [frameMat, frameMat, cellMat, frameMat, frameMat, frameMat];
  const mesh = new THREE.Mesh(geo, materials);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  if (tiltRad !== 0) {
    mesh.rotation.x = tiltRad;
  }
  return mesh;
}

/**
 * Mengisi zona persegi panjang pada permukaan atap secara otomatis dengan panel surya,
 * termasuk dukungan untuk rotasi kemiringan atap, tilt rack, dan pengecualian area penghalang.
 */
export function populateRectangularZone(
  config: SolarConfig,
  panelsGroup: THREE.Group,
  solarTexture: THREE.Texture,
  options: RectangularZoneOptions
): number {
  const {
    minX,
    maxX,
    minZ,
    maxZ,
    getYAt,
    slopeAngleX = 0,
    panelTiltX = 0,
    isExcluded,
  } = options;

  // Dimensi panel di sumbu X dan Z sesuai orientasi
  const pX = config.orientation === 'portrait' ? config.panelWidth : config.panelLength;
  const pZ = config.orientation === 'portrait' ? config.panelLength : config.panelWidth;
  const gap = config.panelGap;

  // Jarak baris Z tambahan untuk tilt rack di atap datar agar meminimalkan bayangan antar-baris
  const rowSpacingZ = pZ + gap + (panelTiltX > 0 ? Math.sin(panelTiltX) * pZ * 0.45 : 0);
  const colSpacingX = pX + gap;

  const availX = maxX - minX;
  const availZ = maxZ - minZ;

  if (availX < pX || availZ < pZ) return 0;

  const cols = Math.floor((availX + gap) / colSpacingX);
  const rows = Math.floor((availZ + gap) / rowSpacingZ);

  // Pusatkan susunan panel di dalam zona
  const usedX = cols * colSpacingX - gap;
  const usedZ = rows * rowSpacingZ - gap;
  const startX = minX + (availX - usedX) / 2 + pX / 2;
  const startZ = minZ + (availZ - usedZ) / 2 + pZ / 2;

  let count = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = startX + c * colSpacingX;
      const cz = startZ + r * rowSpacingZ;

      if (isExcluded && isExcluded(cx, cz, pX, pZ)) {
        continue;
      }

      const totalTiltX = slopeAngleX + panelTiltX;
      const panel = createSolarPanelMesh(pX, pZ, solarTexture, totalTiltX);
      const baseY = getYAt(cx, cz);
      const liftY = panelTiltX > 0 ? (Math.sin(Math.abs(panelTiltX)) * pZ) / 2 + 0.06 : 0.06;

      panel.position.set(cx, baseY + liftY, cz);
      panelsGroup.add(panel);
      count++;
    }
  }

  return count;
}
