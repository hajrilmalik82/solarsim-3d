import * as THREE from 'three';
import type { SolarConfig } from '../../types/solar.types';

/**
 * Membangun visualisasi kabinet Inverter dan rak Bank Baterai 3D di samping kanan bangunan.
 */
export function buildInverterAndBattery(config: SolarConfig, equipmentGroup: THREE.Group): void {
  const baseX = config.bldgLength / 2 + 1.8;
  const baseZ = config.bldgWidth / 2 - 2.2;

  // Pondasi beton peralatan
  const pad = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 0.15, 3.6),
    new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9 })
  );
  pad.position.set(baseX, 0.075, baseZ);
  pad.receiveShadow = true;
  equipmentGroup.add(pad);

  // Unit Kabinet Inverter (Putih + layar indikator biru)
  const invMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.65, 1.35, 0.95),
    new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35, metalness: 0.2 })
  );
  invMesh.position.set(baseX, 0.82, baseZ - 0.95);
  invMesh.castShadow = true;
  equipmentGroup.add(invMesh);

  const invScreen = new THREE.Mesh(
    new THREE.BoxGeometry(0.05, 0.35, 0.45),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
  );
  invScreen.position.set(baseX + 0.33, 1.05, baseZ - 0.95);
  equipmentGroup.add(invScreen);

  // Rak Bank Baterai (jumlah modul menyesuaikan kapasitas kWh)
  if (config.batteryKwh > 0) {
    const stacks = Math.min(4, Math.max(1, Math.ceil(config.batteryKwh / 35)));
    const batMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.4,
      metalness: 0.5,
    });
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });

    for (let i = 0; i < stacks; i++) {
      const batBox = new THREE.Mesh(new THREE.BoxGeometry(0.75, 1.25, 0.52), batMat);
      batBox.position.set(baseX, 0.77, baseZ + 0.15 + i * 0.58);
      batBox.castShadow = true;
      equipmentGroup.add(batBox);

      const led = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.65, 0.06), ledMat);
      led.position.set(baseX + 0.38, 0.85, baseZ + 0.15 + i * 0.58);
      equipmentGroup.add(led);
    }
  }
}
