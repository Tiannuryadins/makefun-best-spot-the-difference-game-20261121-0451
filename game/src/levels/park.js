// Twin Lens — Level 1: Taman Kota Pagi (City Park Morning).
// Original procedural art: a sunny park with a pond, a bench, a dog and a kite.
// The right panel (variant 1) changes exactly the seven listed differences.
export const parkLevel = {
  id: 'park',
  name: 'Taman Kota Pagi',
  subtitle: '7 perbedaan · 3 menit',
  timeLimit: 180,
  hints: 3,
  differences: [
    { id: 'bird',    x: 118, y: 62,  r: 18, name: 'Burung di langit' },
    { id: 'flower',  x: 92,  y: 332, r: 15, name: 'Warna bunga' },
    { id: 'apple',   x: 446, y: 114, r: 14, name: 'Apel di pohon' },
    { id: 'cloud',   x: 398, y: 58,  r: 24, name: 'Bentuk awan' },
    { id: 'bench',   x: 305, y: 322, r: 18, name: 'Papan bangku' },
    { id: 'sunrays', x: 492, y: 58,  r: 26, name: 'Sinar matahari' },
    { id: 'ball',    x: 232, y: 382, r: 15, name: 'Bola anjing' },
  ],

  draw(ctx, W, H, variant) {
    // Sky
    const sky = ctx.createLinearGradient(0, 0, 0, 250);
    sky.addColorStop(0, '#7ec8f7'); sky.addColorStop(1, '#dff3ff');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, 250);

    drawSun(ctx, variant);
    drawCloud(ctx, 120, 48, 1.0, variant, 'bird');
    drawCloud(ctx, 398, 58, 1.2, variant, 'cloud');
    drawBuildings(ctx);
    drawBird(ctx, 118, 62, variant);

    // Grass
    const grass = ctx.createLinearGradient(0, 250, 0, H);
    grass.addColorStop(0, '#7ec850'); grass.addColorStop(1, '#4f9e33');
    ctx.fillStyle = grass; ctx.fillRect(0, 250, W, H - 250);

    drawPond(ctx, 90, 285);
    drawPath(ctx);
    drawTree(ctx, 448, 150, variant);
    drawBench(ctx, 305, 300, variant);
    drawFlowers(ctx, 92, 332, variant);
    drawDog(ctx, 180, 362, variant);
    drawKite(ctx, 300, 120);
    drawFence(ctx);
  },
};

function drawSun(ctx, variant) {
  const cx = 492, cy = 58;
  const rays = variant === 1 ? 6 : 8;
  ctx.save();
  ctx.strokeStyle = '#f7b733'; ctx.lineWidth = 5; ctx.lineCap = 'round';
  for (let i = 0; i < rays; i++) {
    const a = (i / rays) * Math.PI * 2 + 0.2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * 34, cy + Math.sin(a) * 34);
    ctx.lineTo(cx + Math.cos(a) * 46, cy + Math.sin(a) * 46);
    ctx.stroke();
  }
  ctx.restore();
  ctx.fillStyle = '#ffd93b';
  ctx.beginPath(); ctx.arc(cx, cy, 28, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff3ad';
  ctx.beginPath(); ctx.arc(cx - 8, cy - 8, 12, 0, Math.PI * 2); ctx.fill();
}

function drawCloud(ctx, x, y, s, variant, key) {
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x, y, 20 * s, 0, Math.PI * 2);
  ctx.arc(x + 22 * s, y + 4 * s, 16 * s, 0, Math.PI * 2);
  ctx.arc(x - 22 * s, y + 5 * s, 14 * s, 0, Math.PI * 2);
  if (!(variant === 1 && key === 'cloud')) {
    ctx.arc(x + 6 * s, y - 12 * s, 15 * s, 0, Math.PI * 2);
  }
  ctx.fill();
}

function drawBuildings(ctx) {
  ctx.fillStyle = '#9db8d6';
  const blocks = [[30, 190, 46, 60], [82, 205, 38, 45], [440, 195, 52, 55], [498, 210, 40, 40]];
  for (const [x, y, w, h] of blocks) {
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = '#ffe9a8';
    for (let wy = y + 8; wy < y + h - 8; wy += 14) {
      for (let wx = x + 7; wx < x + w - 8; wx += 14) ctx.fillRect(wx, wy, 7, 8);
    }
    ctx.fillStyle = '#9db8d6';
  }
}

function drawBird(ctx, x, y, variant) {
  if (variant === 1) return; // the bird is gone in the right picture
  ctx.strokeStyle = '#2d2a45'; ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 12, y); ctx.quadraticCurveTo(x - 5, y - 9, x, y);
  ctx.quadraticCurveTo(x + 5, y - 9, x + 12, y);
  ctx.stroke();
}

function drawPond(ctx, x, y) {
  ctx.fillStyle = '#5db7e8';
  ctx.beginPath(); ctx.ellipse(x + 45, y + 18, 72, 22, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#8fd4f5';
  ctx.beginPath(); ctx.ellipse(x + 30, y + 12, 40, 10, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x + 15, y + 22); ctx.quadraticCurveTo(x + 45, y + 16, x + 75, y + 22); ctx.stroke();
}

function drawPath(ctx) {
  ctx.fillStyle = '#e8d9b0';
  ctx.beginPath();
  ctx.moveTo(250, 250); ctx.lineTo(330, 250); ctx.lineTo(360, 440); ctx.lineTo(220, 440);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#cbb98a'; ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    const y = 280 + i * 32;
    ctx.beginPath(); ctx.moveTo(258 + i * 4, y); ctx.lineTo(322 - i * 2, y); ctx.stroke();
  }
}

function drawTree(ctx, x, y, variant) {
  ctx.fillStyle = '#7a4a21';
  ctx.fillRect(x - 8, y + 40, 16, 90);
  ctx.fillStyle = '#3f8f3a';
  ctx.beginPath();
  ctx.arc(x, y, 52, 0, Math.PI * 2);
  ctx.arc(x - 38, y + 22, 34, 0, Math.PI * 2);
  ctx.arc(x + 38, y + 22, 34, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#57ab4e';
  ctx.beginPath(); ctx.arc(x - 16, y - 18, 26, 0, Math.PI * 2); ctx.fill();
  // Apples: 3 on the left, 4 on the right (one extra at the top).
  const apples = [[x - 30, y + 8], [x + 12, y - 6], [x + 34, y + 26]];
  if (variant === 1) apples.push([x - 2, y - 34]);
  ctx.fillStyle = '#e5484d';
  for (const [ax, ay] of apples) { ctx.beginPath(); ctx.arc(ax, ay, 7, 0, Math.PI * 2); ctx.fill(); }
}

function drawBench(ctx, x, y, variant) {
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(x - 52, y - 6, 104, 10);
  ctx.fillRect(x - 52, y + 8, 104, 10);
  if (variant === 0) ctx.fillRect(x - 52, y + 22, 104, 10); // third slat only on the left
  ctx.fillStyle = '#6b4423';
  ctx.fillRect(x - 48, y + 32, 10, 34);
  ctx.fillRect(x + 38, y + 32, 10, 34);
  ctx.fillRect(x - 52, y - 34, 8, 30);
  ctx.fillRect(x + 44, y - 34, 8, 30);
}

function drawFlowers(ctx, x, y, variant) {
  const spots = [[x - 26, y], [x, y - 8], [x + 26, y + 2]];
  ctx.strokeStyle = '#2f7d2a'; ctx.lineWidth = 3;
  for (const [fx, fy] of spots) {
    ctx.beginPath(); ctx.moveTo(fx, fy + 8); ctx.lineTo(fx, fy + 22); ctx.stroke();
  }
  const petal = variant === 1 ? '#ffd93b' : '#e5484d'; // the middle flower changes colour
  const colors = ['#e5484d', petal, '#ff8fb3'];
  spots.forEach(([fx, fy], i) => {
    ctx.fillStyle = colors[i];
    for (let p = 0; p < 5; p++) {
      const a = (p / 5) * Math.PI * 2;
      ctx.beginPath(); ctx.arc(fx + Math.cos(a) * 6, fy + Math.sin(a) * 6, 5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = '#fff3ad';
    ctx.beginPath(); ctx.arc(fx, fy, 4, 0, Math.PI * 2); ctx.fill();
  });
}

function drawDog(ctx, x, y, variant) {
  // Body, head, ear, legs, tail.
  ctx.fillStyle = '#c98a4b';
  ctx.beginPath(); ctx.ellipse(x, y, 34, 18, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 34, y - 14, 15, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#a86f36';
  ctx.beginPath(); ctx.ellipse(x + 26, y - 26, 7, 11, -0.4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#5b3a1e';
  ctx.beginPath(); ctx.arc(x + 46, y - 12, 5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#c98a4b';
  for (const lx of [-22, -8, 12, 24]) ctx.fillRect(x + lx, y + 10, 8, 16);
  ctx.strokeStyle = '#c98a4b'; ctx.lineWidth = 6; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - 32, y - 6); ctx.lineTo(x - 44, y - 20); ctx.stroke();
  // The ball exists only on the left.
  if (variant === 0) {
    ctx.fillStyle = '#e5484d';
    ctx.beginPath(); ctx.arc(232, 382, 11, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(232, 382, 11, 0.4, 2.2); ctx.stroke();
  }
}

function drawKite(ctx, x, y) {
  ctx.strokeStyle = '#5b3a1e'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(x, y + 26); ctx.quadraticCurveTo(x - 30, y + 70, x - 10, y + 110); ctx.stroke();
  ctx.fillStyle = '#ff6b9d';
  ctx.beginPath(); ctx.moveTo(x, y - 22); ctx.lineTo(x + 22, y); ctx.lineTo(x, y + 26); ctx.lineTo(x - 22, y); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x, y - 22); ctx.lineTo(x, y + 26); ctx.moveTo(x - 22, y); ctx.lineTo(x + 22, y); ctx.stroke();
}

function drawFence(ctx) {
  ctx.fillStyle = '#f2ead8';
  for (let x = 20; x < 560; x += 34) ctx.fillRect(x, 252, 8, 26);
  ctx.fillRect(0, 258, 560, 5);
  ctx.fillRect(0, 270, 560, 5);
}
