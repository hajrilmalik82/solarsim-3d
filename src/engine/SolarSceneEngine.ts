import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { CameraPreset, SolarConfig } from '../types/solar.types';
import { buildInverterAndBattery } from './builders/equipmentBuilder';
import { buildBuildingAndPanels, type RoofBuildResult } from './builders/roofBuilder';
import { createSolarCellTexture } from './textures';

interface AtmosphereKeyframe {
  hour: number;
  sky: THREE.Color;
  sunColor: THREE.Color;
  orbColor: THREE.Color;
  sunIntensity: number;
  hemiIntensity: number;
  exposure: number;
}

const ATMOSPHERE_KEYFRAMES: AtmosphereKeyframe[] = [
  {
    // 06:00 — Pagi awal (terbit hangat)
    hour: 6,
    sky: new THREE.Color(0xf3dcc6),
    sunColor: new THREE.Color(0xffad66),
    orbColor: new THREE.Color(0xfb923c),
    sunIntensity: 0.65,
    hemiIntensity: 0.58,
    exposure: 0.94,
  },
  {
    // 08:30 — Pagi cerah segar
    hour: 8.5,
    sky: new THREE.Color(0xdcecf9),
    sunColor: new THREE.Color(0xfff6e8),
    orbColor: new THREE.Color(0xfde047),
    sunIntensity: 1.25,
    hemiIntensity: 0.85,
    exposure: 1.08,
  },
  {
    // 12:30 — Siang terik panas
    hour: 12.5,
    sky: new THREE.Color(0xc8e1f7),
    sunColor: new THREE.Color(0xfffef4),
    orbColor: new THREE.Color(0xfef08a),
    sunIntensity: 1.78,
    hemiIntensity: 1.02,
    exposure: 1.18,
  },
  {
    // 15:30 — Sore mulai hangat keemasan
    hour: 15.5,
    sky: new THREE.Color(0xe6d6c3),
    sunColor: new THREE.Color(0xffc67a),
    orbColor: new THREE.Color(0xfbbf24),
    sunIntensity: 1.0,
    hemiIntensity: 0.72,
    exposure: 0.98,
  },
  {
    // 18:00 — Senja agak redup
    hour: 18,
    sky: new THREE.Color(0x8c96ad),
    sunColor: new THREE.Color(0xf97316),
    orbColor: new THREE.Color(0xea580c),
    sunIntensity: 0.36,
    hemiIntensity: 0.42,
    exposure: 0.8,
  },
];

/**
 * Kelas Engine WebGL Three.js murni untuk SolarSim 3D.
 * Terisolasi sepenuhnya dari React lifecycle agar mudah dirawat, bebas memory leak,
 * dan menjaga performa render 60 FPS.
 */
export class SolarSceneEngine {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private skyColor: THREE.Color;
  private fog: THREE.FogExp2;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private hemiLight: THREE.HemisphereLight;
  private sunLight: THREE.DirectionalLight;
  private sunSphere: THREE.Mesh;
  private sunSphereMat: THREE.MeshBasicMaterial;
  private buildingGroup: THREE.Group;
  private panelsGroup: THREE.Group;
  private equipmentGroup: THREE.Group;
  private solarPanelTexture: THREE.CanvasTexture;
  private resizeObserver: ResizeObserver;
  private animationFrameId = 0;
  private onCompassChange?: (azimuthDeg: number) => void;
  private lastCompassDeg = Number.NaN;

  constructor(container: HTMLElement, onCompassChange?: (azimuthDeg: number) => void) {
    this.container = container;
    this.onCompassChange = onCompassChange;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. Scene & Atmosfer Dinamis (Berubah sesuai jam: Pagi -> Siang Terik -> Sore Redup)
    this.scene = new THREE.Scene();
    this.skyColor = new THREE.Color(0xe8eef4);
    this.fog = new THREE.FogExp2(0xe8eef4, 0.0042);
    this.scene.background = this.skyColor;
    this.scene.fog = this.fog;

    // 2. Kamera Perspektif
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 500);
    this.camera.position.set(28, 22, 30);

    // 3. Renderer WebGL (preserveDrawingBuffer: true untuk snapshot cetak PDF)
    this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    container.appendChild(this.renderer.domElement);

    // 4. OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.03;
    this.controls.minDistance = 6;
    this.controls.maxDistance = 140;
    this.controls.target.set(0, 3, 0);

    // 5. Pencahayaan Lingkungan & Matahari (Dinamis sesuai jam)
    this.hemiLight = new THREE.HemisphereLight(0xffffff, 0xcbd5e1, 0.85);
    this.hemiLight.position.set(0, 50, 0);
    this.scene.add(this.hemiLight);

    this.sunLight = new THREE.DirectionalLight(0xfff7ed, 1.35);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 2;
    this.sunLight.shadow.camera.far = 160;
    const d = 48;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.sunLight.shadow.bias = -0.0005;
    this.scene.add(this.sunLight);

    const sunGeo = new THREE.SphereGeometry(1.6, 24, 24);
    this.sunSphereMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
    this.sunSphere = new THREE.Mesh(sunGeo, this.sunSphereMat);
    this.scene.add(this.sunSphere);

    // 6. Lingkungan Tanah & Grid Kawasan
    this.buildEnvironment();

    // 7. Grup Dinamis & Tekstur Sel Surya
    this.buildingGroup = new THREE.Group();
    this.panelsGroup = new THREE.Group();
    this.equipmentGroup = new THREE.Group();
    this.scene.add(this.buildingGroup, this.panelsGroup, this.equipmentGroup);

    this.solarPanelTexture = createSolarCellTexture();

    // 8. ResizeObserver agar responsif terhadap ukuran container
    this.resizeObserver = new ResizeObserver(() => this.handleResize());
    this.resizeObserver.observe(this.container);

    // Mulai render loop
    this.animate();
  }

  private buildEnvironment(): void {
    const groundGeo = new THREE.PlaneGeometry(260, 260);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xdde4ec,
      roughness: 0.92,
      metalness: 0.02,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    const gridHelper = new THREE.GridHelper(160, 80, 0xb8c4d0, 0xcbd5e1);
    gridHelper.position.y = 0.02;
    this.scene.add(gridHelper);
  }

  private clearGroup(group: THREE.Group): void {
    while (group.children.length > 0) {
      const obj = group.children[0];
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
      group.remove(obj);
    }
  }

  /**
   * Memperbarui posisi matahari & atmosfer langit 3D secara halus (06:00 - 18:00):
   * Pagi hangat & cerah -> Siang terik panas -> Sore keemasan & senja redup.
   * Koordinat geografis: Utara = -Z, Timur = +X, Selatan = +Z, Barat = -X.
   */
  public updateSunPosition(sunHour: number): void {
    const clampedHour = THREE.MathUtils.clamp(sunHour, 6, 18);
    const progress = (clampedHour - 6) / 12;
    const angle = progress * Math.PI;
    const radius = 56;

    // 06:00 terbit di Timur (+X), 12:00 puncak di atas, 18:00 terbenam di Barat (-X)
    const x = Math.cos(angle) * radius;
    const y = Math.max(2.2, Math.sin(angle) * radius);
    const z = 16;

    this.sunLight.position.set(x, y, z);
    this.sunSphere.position.set(x, y, z);

    // Cari 2 keyframe atmosfer yang mengapit jam saat ini lalu interpolasi mulus
    let prev = ATMOSPHERE_KEYFRAMES[0];
    let next = ATMOSPHERE_KEYFRAMES[ATMOSPHERE_KEYFRAMES.length - 1];
    for (let i = 0; i < ATMOSPHERE_KEYFRAMES.length - 1; i++) {
      const a = ATMOSPHERE_KEYFRAMES[i];
      const b = ATMOSPHERE_KEYFRAMES[i + 1];
      if (clampedHour >= a.hour && clampedHour <= b.hour) {
        prev = a;
        next = b;
        break;
      }
    }

    const span = next.hour - prev.hour || 1;
    const t = THREE.MathUtils.clamp((clampedHour - prev.hour) / span, 0, 1);

    this.skyColor.lerpColors(prev.sky, next.sky, t);
    this.fog.color.copy(this.skyColor);
    this.sunLight.color.lerpColors(prev.sunColor, next.sunColor, t);
    this.sunSphereMat.color.lerpColors(prev.orbColor, next.orbColor, t);

    this.sunLight.intensity = THREE.MathUtils.lerp(prev.sunIntensity, next.sunIntensity, t);
    this.hemiLight.intensity = THREE.MathUtils.lerp(prev.hemiIntensity, next.hemiIntensity, t);
    this.renderer.toneMappingExposure = THREE.MathUtils.lerp(prev.exposure, next.exposure, t);
  }

  /**
   * Membangun ulang seluruh bangunan, panel surya, dan kabinet inverter/baterai.
   */
  public rebuild(config: SolarConfig): RoofBuildResult {
    this.clearGroup(this.buildingGroup);
    this.clearGroup(this.panelsGroup);
    this.clearGroup(this.equipmentGroup);

    const roofStats = buildBuildingAndPanels(
      config,
      this.buildingGroup,
      this.panelsGroup,
      this.solarPanelTexture
    );

    buildInverterAndBattery(config, this.equipmentGroup);
    return roofStats;
  }

  /**
   * Mengarahkan kamera ke posisi dan titik fokus tertentu.
   */
  public focusCamera(
    position: [number, number, number],
    target: [number, number, number]
  ): void {
    this.camera.position.set(position[0], position[1], position[2]);
    this.controls.target.set(target[0], target[1], target[2]);
    this.controls.update();
  }

  /**
   * Mengarahkan kamera ke preset cepat ('iso', 'top', 'inverter').
   */
  public applyCameraPreset(preset: CameraPreset, config: SolarConfig): void {
    if (preset === 'iso') {
      const dist = Math.max(24, config.bldgLength * 1.35);
      this.focusCamera([dist, dist * 0.75, dist * 1.05], [0, config.bldgHeight * 0.6, 0]);
    } else if (preset === 'top') {
      const dist = Math.max(26, Math.max(config.bldgLength, config.bldgWidth) * 1.45);
      this.focusCamera([0, dist, 0.1], [0, config.bldgHeight, 0]);
    } else if (preset === 'inverter') {
      const targetX = config.bldgLength / 2 + 1.8;
      const targetZ = config.bldgWidth / 2 - 2.0;
      this.focusCamera([targetX + 8, 5, targetZ + 7], [targetX, 1.2, targetZ]);
    }
  }

  /**
   * Mengambil tangkapan layar canvas WebGL saat ini sebagai data URL PNG (untuk cetak PDF).
   */
  public captureSnapshot(): string {
    this.renderer.render(this.scene, this.camera);
    return this.renderer.domElement.toDataURL('image/png');
  }

  private handleResize(): void {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (width === 0 || height === 0) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private animate = (): void => {
    this.animationFrameId = requestAnimationFrame(this.animate);
    this.controls.update();

    if (this.onCompassChange) {
      const dx = this.camera.position.x - this.controls.target.x;
      const dz = this.camera.position.z - this.controls.target.z;
      const azimuthDeg = THREE.MathUtils.radToDeg(Math.atan2(dx, dz));
      if (Number.isNaN(this.lastCompassDeg) || Math.abs(azimuthDeg - this.lastCompassDeg) > 0.25) {
        this.lastCompassDeg = azimuthDeg;
        this.onCompassChange(azimuthDeg);
      }
    }

    this.renderer.render(this.scene, this.camera);
  };

  /**
   * Membersihkan seluruh resource WebGL saat komponen React di-unmount.
   */
  public dispose(): void {
    cancelAnimationFrame(this.animationFrameId);
    this.resizeObserver.disconnect();
    this.clearGroup(this.buildingGroup);
    this.clearGroup(this.panelsGroup);
    this.clearGroup(this.equipmentGroup);
    this.solarPanelTexture.dispose();
    this.controls.dispose();
    this.renderer.dispose();
    if (this.renderer.domElement.parentNode === this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
