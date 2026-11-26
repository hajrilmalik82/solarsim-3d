import * as THREE from 'three';

/**
 * Menghasilkan tekstur sel surya monocrystalline biru gelap dengan busbar perak
 * secara prosedural menggunakan HTML5 Canvas (tanpa ketergantungan aset gambar eksternal).
 */
export function createSolarCellTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Gradasi dasar sel surya biru tua
    const grad = ctx.createLinearGradient(0, 0, 256, 512);
    grad.addColorStop(0, '#0c2448');
    grad.addColorStop(0.5, '#13386e');
    grad.addColorStop(1, '#091c3a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 512);

    // Grid sel (6 kolom x 12 baris)
    ctx.strokeStyle = 'rgba(186, 230, 253, 0.32)';
    ctx.lineWidth = 1.5;
    const cols = 6;
    const rows = 12;

    for (let c = 1; c < cols; c++) {
      const x = (256 / cols) * c;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 512);
      ctx.stroke();
    }

    for (let r = 1; r < rows; r++) {
      const y = (512 / rows) * r;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(256, y);
      ctx.stroke();
    }

    // Busbar tipis horizontal
    ctx.strokeStyle = 'rgba(224, 242, 254, 0.16)';
    ctx.lineWidth = 0.8;
    for (let y = 8; y < 512; y += 14) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(256, y);
      ctx.stroke();
    }

    // Bingkai aluminium tepi
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 8;
    ctx.strokeRect(0, 0, 256, 512);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  return texture;
}
