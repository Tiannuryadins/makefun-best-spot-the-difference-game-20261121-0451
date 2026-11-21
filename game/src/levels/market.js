// Twin Lens — Level 3: Pasar Malam (Night Market).
// Original procedural art: a night market under string lights, with lanterns,
// fruit stalls, a vendor, a cat and a bicycle. Ten differences — the hardest hunt.
export const marketLevel = {
  id: 'market',
  name: 'Pasar Malam',
  subtitle: '10 perbedaan · 2 menit',
  timeLimit: 120,
  hints: 3,
  differences: [
    { id: 'lantern',  x: 118, y: 88,  r: 17, name: 'Warna lampion' },
    { id: 'moon',     x: 500, y: 54,  r: 23, name: 'Kawah bulan' },
    { id: 'cat',      x: 218, y: 358, r: 17, name: 'Kucing di peti' },
    { id: 'bulbs',    x: 414, y: 100, r: 15, name: 'Lampu gantung' },
    { id: 'oranges',  x: 134, y: 296, r: 15, name: 'Jeruk di keranjang' },
    { id: 'hat',      x: 182, y: 218, r: 17, name: 'Topi pedagang' },
    { id: 'price',    x: 125, y: 355, r: 17, name: 'Harga di papan' },
    { id: 'kite',     x: 352, y: 68,  r: 17, name: 'Layang-layang' },
    { id: 'bike',     x: 524, y: 382, r: 16, name: 'Roda sepeda' },
    { id: 'star',     x: 62,  y: 48,  r: 13, name: 'Bintang di langit' },
  ],

  draw(ctx, W, H, variant) {
    // Night sky
    const sky = ctx.createLinearGradient(0, 0, 0, 240);
    sky.addColorStop(0, '#0d1030'); sky.addColorStop(1, '#2b1d4e');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, 240);

    drawStars(ctx, variant);
    drawMoon(ctx, 500, 54, variant);
    drawKite(ctx, 352, 68, variant);
    drawStringLights(ctx, 252, 108, variant);
    drawLantern(ctx, 118, 88, variant);
    drawLantern(ctx, 452, 96, 0);

    // Ground
    ctx.fillStyle = '#3a2d4a'; ctx.fillRect(0, 240, W, H - 240);
    ctx.fillStyle = '#4a3a5e';
    for (let i = 0; i < 8; i++) ctx.fillRect(20 + i * 68, 400, 44, 6);

    drawStall(ctx, 60, 250, 'BUAH', variant);
    drawStall(ctx, 250, 250, 'KUE', 0);
    drawStall(ctx, 400, 250, 'TEH', variant);
    drawVendor(ctx, 182, 218, variant);
    drawCrates(ctx);
    drawCat(ctx, 218, 358, variant);
    drawBicycle(ctx, 500, 382, variant);
  },
};

function drawStars(ctx, variant) {
  const stars = [[40, 90], [150, 40], [220, 80], [280, 30], [380, 110], [440, 36], [520, 130], [90, 140], [330, 140]];
  if (variant === 1) stars.push([62, 48]); // one extra star on the right
  ctx.fillStyle = '#ffffff';
  for (const [x, y] of stars) {
    ctx.beginPath();
    ctx.moveTo(x, y - 4); ctx.lineTo(x + 1.5, y - 1.5); ctx.lineTo(x + 4, y); ctx.lineTo(x + 1.5, y + 1.5);
    ctx.lineTo(x, y + 4); ctx.lineTo(x - 1.5, y + 1.5); ctx.lineTo(x - 4, y); ctx.lineTo(x - 1.5, y - 1.5);
    ctx.closePath(); ctx.fill();
  }
}

function drawMoon(ctx, x, y, variant) {
  ctx.fillStyle = '#f5f0c8';
  ctx.beginPath(); ctx.arc(x, y, 22, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(245,240,200,.3)';
  ctx.beginPath(); ctx.arc(x, y, 30, 0, Math.PI * 2); ctx.fill();
  if (variant === 0) {
    // Craters only on the left moon.
    ctx.fillStyle = '#d8d0a0';
    ctx.beginPath(); ctx.arc(x - 7, y - 4, 4, 0, Math.PI * 2); ctx.arc(x + 6, y + 6, 3, 0, Math.PI * 2); ctx.fill();
  }
}

function drawKite(ctx, x, y, variant) {
  if (variant === 1) return; // the kite is gone from the right sky
  ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(x, y + 20); ctx.quadraticCurveTo(x - 16, y + 50, x - 4, y + 78); ctx.stroke();
  ctx.fillStyle = '#7be495';
  ctx.beginPath(); ctx.moveTo(x, y - 16); ctx.lineTo(x + 16, y); ctx.lineTo(x, y + 20); ctx.lineTo(x - 16, y); ctx.closePath(); ctx.fill();
}

function drawStringLights(ctx, x, y, variant) {
  ctx.strokeStyle = '#1a1330'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(40, 84); ctx.quadraticCurveTo(280, 130, 520, 84); ctx.stroke();
  const bulbs = [[90, 100], [170, 112], [252, 108], [334, 112], [414, 100]];
  const lit = variant === 1 ? bulbs.slice(0, 4) : bulbs; // one bulb dark on the right
  for (const [bx, by] of lit) {
    ctx.fillStyle = '#ffd93b';
    ctx.beginPath(); ctx.arc(bx, by, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,217,59,.35)';
    ctx.beginPath(); ctx.arc(bx, by, 11, 0, Math.PI * 2); ctx.fill();
  }
  if (variant === 1) {
    const [bx, by] = bulbs[4];
    ctx.fillStyle = '#5b5470';
    ctx.beginPath(); ctx.arc(bx, by, 6, 0, Math.PI * 2); ctx.fill();
  }
}

function drawLantern(ctx, x, y, variant) {
  ctx.strokeStyle = '#1a1330'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x, y - 34); ctx.lineTo(x, y - 14); ctx.stroke();
  ctx.fillStyle = variant === 1 && x < 200 ? '#ffd93b' : '#e5484d'; // the left lantern turns yellow
  ctx.beginPath(); ctx.ellipse(x, y, 16, 20, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffd93b';
  ctx.fillRect(x - 5, y - 24, 10, 5);
  ctx.fillRect(x - 5, y + 19, 10, 5);
  ctx.fillStyle = '#f5b942';
  ctx.fillRect(x - 16, y - 4, 3, 8); ctx.fillRect(x + 13, y - 4, 3, 8);
}

function drawStall(ctx, x, y, label, variant) {
  // Awning
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#e5484d' : '#ffffff';
    ctx.beginPath();
    ctx.moveTo(x + i * 26, y);
    ctx.lineTo(x + i * 26, y + 16);
    ctx.lineTo(x + (i + 1) * 26, y + 16);
    ctx.lineTo(x + (i + 1) * 26, y);
    ctx.closePath(); ctx.fill();
  }
  ctx.fillStyle = '#7a4a21';
  ctx.fillRect(x, y + 16, 130, 8);
  ctx.fillRect(x + 4, y + 24, 8, 66);
  ctx.fillRect(x + 118, y + 24, 8, 66);
  // Counter goods per stall
  if (label === 'BUAH') drawFruit(ctx, x + 65, y + 66, variant);
  if (label === 'KUE') drawCakes(ctx, x + 65, y + 66);
  if (label === 'TEH') drawTeapot(ctx, x + 65, y + 66);
  // Sign board
  ctx.fillStyle = '#241a3f';
  ctx.fillRect(x + 18, y + 92, 94, 26);
  ctx.fillStyle = '#ffd76a';
  ctx.font = 'bold 15px "Segoe UI", system-ui, sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const price = label === 'BUAH' && variant === 1 ? 'BUAH 15' : label === 'BUAH' ? 'BUAH 10' : label;
  ctx.fillText(price, x + 65, y + 105);
}

function drawFruit(ctx, x, y, variant) {
  ctx.fillStyle = '#8a5a2b';
  ctx.beginPath(); ctx.ellipse(x, y, 34, 10, 0, 0, Math.PI * 2); ctx.fill();
  const oranges = [[x - 18, y - 6], [x, y - 10], [x + 18, y - 6]];
  if (variant === 1) oranges.push([x + 9, y - 20]); // one extra orange on the right
  ctx.fillStyle = '#ff8a3c';
  for (const [ox, oy] of oranges) { ctx.beginPath(); ctx.arc(ox, oy, 8, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = '#3f8f3a';
  ctx.beginPath(); ctx.arc(x, y - 18, 3, 0, Math.PI * 2); ctx.fill();
}

function drawCakes(ctx, x, y) {
  const cols = ['#ff8fb3', '#ffd93b', '#7be495'];
  cols.forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.fillRect(x - 28 + i * 20, y - 14, 16, 14);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x - 28 + i * 20, y - 18, 16, 4);
  });
}

function drawTeapot(ctx, x, y) {
  ctx.fillStyle = '#c9b8ff';
  ctx.beginPath(); ctx.ellipse(x, y - 6, 16, 12, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillRect(x - 4, y - 22, 8, 10);
  ctx.strokeStyle = '#c9b8ff'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x + 14, y - 10); ctx.quadraticCurveTo(x + 26, y - 8, x + 20, y + 2); ctx.stroke();
  ctx.fillStyle = '#8fd4f5';
  ctx.beginPath(); ctx.arc(x - 22, y + 6, 5, 0, Math.PI * 2); ctx.fill();
}

function drawVendor(ctx, x, y, variant) {
  // Body and apron
  ctx.fillStyle = '#3b82f6';
  ctx.beginPath(); ctx.ellipse(x, y + 34, 24, 30, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#f2ead8';
  ctx.fillRect(x - 14, y + 22, 28, 34);
  // Head and hat: the hat is red on the left, blue on the right.
  ctx.fillStyle = '#f2c89b';
  ctx.beginPath(); ctx.arc(x, y, 14, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = variant === 1 ? '#3b82f6' : '#e5484d';
  ctx.beginPath(); ctx.arc(x, y - 4, 15, Math.PI, 0); ctx.fill();
  ctx.fillRect(x - 18, y - 6, 36, 4);
  // Smile and waving arm
  ctx.fillStyle = '#2d2a45';
  ctx.beginPath(); ctx.arc(x - 5, y - 2, 1.8, 0, Math.PI * 2); ctx.arc(x + 5, y - 2, 1.8, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#2d2a45'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(x, y + 4, 5, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
  ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 7; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x + 20, y + 26); ctx.lineTo(x + 34, y + 8); ctx.stroke();
}

function drawCat(ctx, x, y, variant) {
  if (variant === 1) return; // the cat wandered off in the right picture
  ctx.fillStyle = '#2d2a45';
  ctx.beginPath(); ctx.ellipse(x, y, 20, 12, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 20, y - 8, 10, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x + 12, y - 16); ctx.lineTo(x + 14, y - 26); ctx.lineTo(x + 19, y - 17); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x + 22, y - 17); ctx.lineTo(x + 26, y - 26); ctx.lineTo(x + 28, y - 16); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#2d2a45'; ctx.lineWidth = 4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - 18, y - 2); ctx.quadraticCurveTo(x - 30, y - 12, x - 26, y - 20); ctx.stroke();
  ctx.fillStyle = '#ffd93b';
  ctx.beginPath(); ctx.arc(x + 23, y - 10, 2, 0, Math.PI * 2); ctx.arc(x + 17, y - 10, 2, 0, Math.PI * 2); ctx.fill();
}

function drawBicycle(ctx, x, y, variant) {
  ctx.strokeStyle = '#c9b8ff'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(x - 24, y, 13, 0, Math.PI * 2); ctx.stroke();
  if (variant === 0) {
    ctx.beginPath(); ctx.arc(x + 24, y, 13, 0, Math.PI * 2); ctx.stroke(); // rear wheel only on the left
    ctx.beginPath(); ctx.moveTo(x + 24, y); ctx.lineTo(x + 24, y - 13); ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(x - 24, y); ctx.lineTo(x - 4, y - 16); ctx.lineTo(x + 12, y - 16); ctx.lineTo(x + 24, y);
  ctx.moveTo(x - 4, y - 16); ctx.lineTo(x - 10, y); ctx.moveTo(x + 12, y - 16); ctx.lineTo(x + 20, y);
  ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - 8, y - 16); ctx.lineTo(x - 16, y - 22); ctx.moveTo(x + 12, y - 16); ctx.lineTo(x + 22, y - 22); ctx.stroke();
  ctx.fillStyle = '#e5484d';
  ctx.fillRect(x - 20, y - 26, 12, 4);
}

function drawCrates(ctx) {
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(196, 372, 44, 22);
  ctx.fillRect(200, 350, 36, 22);
  ctx.strokeStyle = '#6b4423'; ctx.lineWidth = 2;
  ctx.strokeRect(196, 372, 44, 22);
  ctx.strokeRect(200, 350, 36, 22);
  ctx.fillStyle = '#7a4a21';
  ctx.fillRect(440, 356, 40, 18);
}
