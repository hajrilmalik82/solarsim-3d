import * as THREE from 'three';
import type { SolarConfig } from '../../types/solar.types';
import { populateRectangularZone } from './panelPlacer';

export interface RoofBuildResult {
  panelCount: number;
  effectiveRoofArea: number;
}

/**
 * Membangun struktur 3D bangunan & atap (Flat, Gable, Industrial)
 * sekaligus menempatkan panel surya secara otomatis di atas bidang efektifnya.
 */
export function buildBuildingAndPanels(
  config: SolarConfig,
  buildingGroup: THREE.Group,
  panelsGroup: THREE.Group,
  solarTexture: THREE.Texture
): RoofBuildResult {
  const L = config.bldgLength;
  const W = config.bldgWidth;
  const H = config.bldgHeight;
  const sb = config.setback;

  // Material arsitektur
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.75,
    metalness: 0.05,
  });
  const darkTrimMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.6,
    metalness: 0.3,
  });
  const roofFlatMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.85 });
  const roofTileMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.7 });
  const roofMetalMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.45,
    metalness: 0.55,
  });

  let panelCount = 0;
  let effectiveRoofArea = 0;

  // -------------------------------------------------------------------------
  // MODE 1: 1 ATAP DATAR (FLAT ROOF)
  // -------------------------------------------------------------------------
  if (config.roofType === 'flat') {
    const body = new THREE.Mesh(new THREE.BoxGeometry(L, H, W), wallMat);
    body.position.y = H / 2;
    body.castShadow = true;
    body.receiveShadow = true;
    buildingGroup.add(body);

    const roofSlab = new THREE.Mesh(new THREE.BoxGeometry(L + 0.3, 0.25, W + 0.3), roofFlatMat);
    roofSlab.position.y = H + 0.125;
    roofSlab.receiveShadow = true;
    buildingGroup.add(roofSlab);

    // Dinding parapet rendah
    const parapetH = 0.35;
    const pThick = 0.2;
    const pFront = new THREE.Mesh(new THREE.BoxGeometry(L + 0.3, parapetH, pThick), darkTrimMat);
    pFront.position.set(0, H + 0.25 + parapetH / 2, W / 2 + 0.05);
    const pBack = pFront.clone();
    pBack.position.z = -(W / 2 + 0.05);
    const pLeft = new THREE.Mesh(new THREE.BoxGeometry(pThick, parapetH, W + 0.3), darkTrimMat);
    pLeft.position.set(-(L / 2 + 0.05), H + 0.25 + parapetH / 2, 0);
    const pRight = pLeft.clone();
    pRight.position.x = L / 2 + 0.05;
    buildingGroup.add(pFront, pBack, pLeft, pRight);

    const tiltRad = THREE.MathUtils.degToRad(config.flatTilt);
    effectiveRoofArea = Math.max(0, (L - 2 * sb) * (W - 2 * sb));

    panelCount = populateRectangularZone(config, panelsGroup, solarTexture, {
      minX: -L / 2 + sb,
      maxX: L / 2 - sb,
      minZ: -W / 2 + sb,
      maxZ: W / 2 - sb,
      getYAt: () => H + 0.25,
      panelTiltX: tiltRad,
    });
  }

  // -------------------------------------------------------------------------
  // MODE 2: 2 ATAP PELANA (GABLE ROOF)
  // -------------------------------------------------------------------------
  else if (config.roofType === 'gable') {
    const pitchRad = THREE.MathUtils.degToRad(config.gablePitch);
    const halfW = W / 2;
    const ridgeH = Math.tan(pitchRad) * halfW;
    const slopeLen = halfW / Math.cos(pitchRad);

    const body = new THREE.Mesh(new THREE.BoxGeometry(L, H, W), wallMat);
    body.position.y = H / 2;
    body.castShadow = true;
    body.receiveShadow = true;
    buildingGroup.add(body);

    // Segitiga dinding sopi-sopi
    const gableShape = new THREE.Shape();
    gableShape.moveTo(-halfW, 0);
    gableShape.lineTo(halfW, 0);
    gableShape.lineTo(0, ridgeH);
    gableShape.closePath();
    const gableGeo = new THREE.ExtrudeGeometry(gableShape, { depth: L, bevelEnabled: false });
    gableGeo.rotateY(Math.PI / 2);
    const gableWall = new THREE.Mesh(gableGeo, wallMat);
    gableWall.position.set(-L / 2, H, 0);
    gableWall.castShadow = true;
    buildingGroup.add(gableWall);

    const overhang = 0.45;
    const roofSideGeo = new THREE.BoxGeometry(L + overhang * 2, 0.18, slopeLen + overhang);

    const southRoof = new THREE.Mesh(roofSideGeo, roofTileMat);
    southRoof.position.set(0, H + ridgeH / 2, halfW / 2);
    southRoof.rotation.x = pitchRad;
    southRoof.castShadow = true;
    southRoof.receiveShadow = true;

    const northRoof = new THREE.Mesh(roofSideGeo, roofTileMat);
    northRoof.position.set(0, H + ridgeH / 2, -halfW / 2);
    northRoof.rotation.x = -pitchRad;
    northRoof.castShadow = true;
    northRoof.receiveShadow = true;

    buildingGroup.add(southRoof, northRoof);

    const areaOneSide = Math.max(0, (L - 2 * sb) * (slopeLen - 2 * sb));
    effectiveRoofArea = config.gableSide === 'both' ? areaOneSide * 2 : areaOneSide;

    const zMargin = sb * Math.cos(pitchRad);
    panelCount += populateRectangularZone(config, panelsGroup, solarTexture, {
      minX: -L / 2 + sb,
      maxX: L / 2 - sb,
      minZ: zMargin,
      maxZ: halfW - zMargin,
      getYAt: (_x, z) => H + (halfW - z) * Math.tan(pitchRad) + 0.11,
      slopeAngleX: pitchRad,
    });

    if (config.gableSide === 'both') {
      panelCount += populateRectangularZone(config, panelsGroup, solarTexture, {
        minX: -L / 2 + sb,
        maxX: L / 2 - sb,
        minZ: -halfW + zMargin,
        maxZ: -zMargin,
        getYAt: (_x, z) => H + (halfW - Math.abs(z)) * Math.tan(pitchRad) + 0.11,
        slopeAngleX: -pitchRad,
      });
    }
  }

  // -------------------------------------------------------------------------
  // MODE 3: GUDANG / PABRIK KOMERSIAL (INDUSTRIAL)
  // -------------------------------------------------------------------------
  else if (config.roofType === 'industrial') {
    const pitchRad = THREE.MathUtils.degToRad(config.indPitch);
    const halfW = W / 2;
    const ridgeH = Math.tan(pitchRad) * halfW;
    const slopeLen = halfW / Math.cos(pitchRad);

    const body = new THREE.Mesh(new THREE.BoxGeometry(L, H, W), wallMat);
    body.position.y = H / 2;
    body.castShadow = true;
    body.receiveShadow = true;
    buildingGroup.add(body);

    const bayCount = Math.max(3, Math.floor(L / 4));
    for (let i = 0; i <= bayCount; i++) {
      const px = -L / 2 + (L / bayCount) * i;
      const colFront = new THREE.Mesh(new THREE.BoxGeometry(0.28, H, 0.35), darkTrimMat);
      colFront.position.set(px, H / 2, W / 2 + 0.05);
      const colBack = colFront.clone();
      colBack.position.z = -(W / 2 + 0.05);
      buildingGroup.add(colFront, colBack);
    }

    const gableShape = new THREE.Shape();
    gableShape.moveTo(-halfW, 0);
    gableShape.lineTo(halfW, 0);
    gableShape.lineTo(0, ridgeH);
    gableShape.closePath();
    const gableGeo = new THREE.ExtrudeGeometry(gableShape, { depth: L, bevelEnabled: false });
    gableGeo.rotateY(Math.PI / 2);
    const gableWall = new THREE.Mesh(gableGeo, wallMat);
    gableWall.position.set(-L / 2, H, 0);
    buildingGroup.add(gableWall);

    const roofSideGeo = new THREE.BoxGeometry(L + 0.6, 0.16, slopeLen + 0.4);
    const southRoof = new THREE.Mesh(roofSideGeo, roofMetalMat);
    southRoof.position.set(0, H + ridgeH / 2, halfW / 2);
    southRoof.rotation.x = pitchRad;
    southRoof.castShadow = true;
    southRoof.receiveShadow = true;

    const northRoof = new THREE.Mesh(roofSideGeo, roofMetalMat);
    northRoof.position.set(0, H + ridgeH / 2, -halfW / 2);
    northRoof.rotation.x = -pitchRad;
    northRoof.castShadow = true;
    northRoof.receiveShadow = true;

    const walkway = new THREE.Mesh(
      new THREE.BoxGeometry(L, 0.08, 0.7),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.6 })
    );
    walkway.position.set(0, H + ridgeH + 0.12, 0);

    buildingGroup.add(southRoof, northRoof, walkway);

    const walkwayMargin = 0.55;
    effectiveRoofArea = Math.max(0, 2 * (L - 2 * sb) * (slopeLen - sb - walkwayMargin));

    panelCount += populateRectangularZone(config, panelsGroup, solarTexture, {
      minX: -L / 2 + sb,
      maxX: L / 2 - sb,
      minZ: walkwayMargin,
      maxZ: halfW - sb * Math.cos(pitchRad),
      getYAt: (_x, z) => H + (halfW - z) * Math.tan(pitchRad) + 0.1,
      slopeAngleX: pitchRad,
    });

    panelCount += populateRectangularZone(config, panelsGroup, solarTexture, {
      minX: -L / 2 + sb,
      maxX: L / 2 - sb,
      minZ: -halfW + sb * Math.cos(pitchRad),
      maxZ: -walkwayMargin,
      getYAt: (_x, z) => H + (halfW - Math.abs(z)) * Math.tan(pitchRad) + 0.1,
      slopeAngleX: -pitchRad,
    });
  }

  return { panelCount, effectiveRoofArea };
}
