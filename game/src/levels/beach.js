// Twin Lens — Level 2: Pantai Senja (Sunset Beach).
// Original procedural art: a sunset beach with an umbrella, a sandcastle, a
// palm tree and a little red crab. Eight differences hide in plain sight.
export const beachLevel = {
  id: 'beach',
  name: 'Pantai Senja',
  subtitle: '8 perbedaan · 2,5 menit',
  timeLimit: 150,
  hints: 3,
  differences: [
    { id: 'umbrella', x: 140, y: 148, r: 27, name: 'Warna payung' },
    { id: 'crab',     x: 424, y: 362, r: 17, name: 'Kepiting' },
    { id: 'starfish', x: 336, y: 400, r: 14, name: 'Bintang laut' },
    { id: 'sail',     x: 416, y: 245, r: 20, name: 'Layar perahu' },
    { id: 'flag',     x: 210, y: 237, r: 14, name: 'Bendera istana pasir' },
    { id: 'coconut',  x: 517, y: 122, r: 13, name: 'Kelapa di palem' },
    { id: 'gull',     x: 310, y: 44,  r: 15, name: 'Burung camar' },
    { id: 'bucket',   x: 352, y: 352, r: 17, name: 'Warna ember' },
  ],

  draw(ctx, W, H, variant) {
    // Sunset sky
    const sky = ctx.createLinearGradient(0, 0, 0, 210);
    sky.addColorStop(0, '#ff9a5c'); sky.addColorStop(0.55, '#ff7e7e'); sky.addColorStop(1, '#c86dd7');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, 210);

    drawSettingSun(ctx, 472, 118, variant);
    drawGulls(ctx, variant);

    // Sea
    const sea = ctx.createLinearGradient(0, 210, 0, 300);
    sea.addColorStop(0, '#e8726b'); sea.addColorStop(1, '#7fb3d5');
    ctx.fillStyle = sea; ctx.fillRect(0, 210, W, 90);
    ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.lineWidth = 3; ctx.lineCap = 'round';
    for (const [wx, wy, wl] of [[60, 232, 70], [220, 252, 90], [380, 238, 80], [470, 268, 60]]) {
      ctx.beginPath(); ctx.moveTo(wx, wy); ctx.quadraticCurveTo(wx + wl / 2, wy - 8, wx + wl, wy); ctx.stroke();
    }
    drawBoat(ctx, 400, 235, variant); // sails on the sea, painted after it

    // Sand
    const sand = ctx.createLinearGradient(0, 300, 0, H);
    sand.addColorStop(0, '#f7dc9a'); sand.addColorStop(1, '#e8bd6a');
    ctx.fillStyle = sand; ctx.fillRect(0, 300, W, H - 300);

    drawUmbrella(ctx, 140, 148, variant);
    drawTowel(ctx, 120, 330);
    drawSandcastle(ctx, 202, 296, variant);
    drawBucket(ctx, 352, 352, variant);
    drawStarfish(ctx, 302, 392, variant);
    drawPalm(ctx, 512, 92, variant);
    drawCrab(ctx, 424, 362, variant);
    drawShells(ctx);
  },
};

function drawSettingSun(ctx, x, y, variant) {
  ctx.fillStyle = '#ffe27a';
  ctx.beginPath(); ctx.arc(x, y, 30, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff7c0';
  ctx.beginPath(); ctx.arc(x - 8, y - 8, 14, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255, 226, 122, .45)';
  ctx.beginPath(); ctx.arc(x, y, 42, 0, Math.PI * 2); ctx.fill();
}

function drawGulls(ctx, variant) {
  const gulls = [[180, 52], [252, 58]];
  if (variant === 1) gulls.push([310, 44]); // a third gull joins on the right
  ctx.strokeStyle = '#4a2c4a'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
  for (const [x, y] of gulls) {
    ctx.beginPath();
    ctx.moveTo(x - 10, y); ctx.quadraticCurveTo(x - 4, y - 8, x, y);
    ctx.quadraticCurveTo(x + 4, y - 8, x + 10, y);
    ctx.stroke();
  }
}

function drawBoat(ctx, x, y, variant) {
  ctx.fillStyle = '#7a4a21';
  ctx.beginPath(); ctx.moveTo(x - 34, y + 42); ctx.lineTo(x + 34, y + 42); ctx.lineTo(x + 24, y + 58); ctx.lineTo(x - 24, y + 58); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#5b3a1e'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x, y + 42); ctx.lineTo(x, y - 18); ctx.stroke();
  ctx.fillStyle = variant === 1 ? '#ffd93b' : '#ffffff'; // sail changes colour
  ctx.beginPath(); ctx.moveTo(x + 2, y - 16); ctx.lineTo(x + 2, y + 38); ctx.lineTo(x + 30, y + 38); ctx.closePath(); ctx.fill();
  ctx.fillStyle = variant === 1 ? '#ffe27a' : '#f2f2f2';
  ctx.beginPath(); ctx.moveTo(x - 2, y - 12); ctx.lineTo(x - 2, y + 38); ctx.lineTo(x - 24, y + 38); ctx.closePath(); ctx.fill();
}

function drawUmbrella(ctx, x, y, variant) {
  ctx.strokeStyle = '#8a5a2b'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(x, y + 60); ctx.lineTo(x, y + 130); ctx.stroke();
  const stripe = variant === 1 ? '#3b82f6' : '#e5484d';
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i % 2 === 0 ? stripe : '#ffffff';
    ctx.beginPath();
    ctx.moveTo(x, y - 18);
    const a0 = Math.PI + (i / 6) * Math.PI;
    const a1 = Math.PI + ((i + 1) / 6) * Math.PI;
    ctx.arc(x, y - 18, 78, a0, a1);
    ctx.closePath(); ctx.fill();
  }
  ctx.fillStyle = stripe;
  ctx.beginPath(); ctx.arc(x, y - 18, 10, 0, Math.PI * 2); ctx.fill();
}

function drawTowel(ctx, x, y) {
  ctx.fillStyle = '#37c978';
  ctx.fillRect(x - 6, y, 96, 44);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x - 6, y + 12, 96, 8);
  ctx.fillRect(x - 6, y + 28, 96, 8);
  ctx.fillStyle = '#ffd93b';
  ctx.beginPath(); ctx.arc(x + 110, y + 10, 14, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#2d2a45';
  ctx.beginPath(); ctx.arc(x + 105, y + 8, 4, 0, Math.PI * 2); ctx.arc(x + 115, y + 8, 4, 0, Math.PI * 2); ctx.fill();
}

function drawSandcastle(ctx, x, y, variant) {
  ctx.fillStyle = '#e8bd6a';
  ctx.fillRect(x - 34, y, 68, 42);
  ctx.fillRect(x - 22, y - 26, 44, 28);
  ctx.fillRect(x - 12, y - 46, 24, 22);
  ctx.fillStyle = '#d9a94f';
  ctx.fillRect(x - 34, y + 34, 68, 8);
  ctx.fillStyle = '#5b3a1e';
  ctx.fillRect(x - 26, y + 10, 7, 9); ctx.fillRect(x - 3, y + 10, 7, 9); ctx.fillRect(x + 19, y + 10, 7, 9);
  // The little flag flies only on the left.
  if (variant === 0) {
    ctx.strokeStyle = '#5b3a1e'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x, y - 46); ctx.lineTo(x, y - 66); ctx.stroke();
    ctx.fillStyle = '#e5484d';
    ctx.beginPath(); ctx.moveTo(x, y - 66); ctx.lineTo(x + 18, y - 61); ctx.lineTo(x, y - 56); ctx.closePath(); ctx.fill();
  }
}

function drawBucket(ctx, x, y, variant) {
  ctx.fillStyle = variant === 1 ? '#37c978' : '#3b82f6'; // bucket changes colour
  ctx.beginPath(); ctx.moveTo(x - 18, y - 16); ctx.lineTo(x + 18, y - 16); ctx.lineTo(x + 13, y + 16); ctx.lineTo(x - 13, y + 16); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#5b3a1e'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x - 18, y - 16); ctx.quadraticCurveTo(x, y + 8, x + 18, y - 16); ctx.stroke();
  ctx.fillStyle = '#f7dc9a';
  ctx.beginPath(); ctx.arc(x + 26, y + 12, 5, 0, Math.PI * 2); ctx.fill();
}

function drawStarfish(ctx, x, y, variant) {
  const stars = [[x - 34, y + 6], [x + 6, y - 4]];
  if (variant === 1) stars.push([x + 34, y + 8]); // a third starfish on the right
  for (const [sx, sy] of stars) {
    ctx.fillStyle = '#ff8a5c';
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + (i / 5) * Math.PI * 2;
      const a2 = a + Math.PI / 5;
      ctx.lineTo(sx + Math.cos(a) * 11, sy + Math.sin(a) * 11);
      ctx.lineTo(sx + Math.cos(a2) * 4.5, sy + Math.sin(a2) * 4.5);
    }
    ctx.closePath(); ctx.fill();
  }
}

function drawPalm(ctx, x, y, variant) {
  ctx.strokeStyle = '#8a5a2b'; ctx.lineWidth = 10; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x, y + 190); ctx.quadraticCurveTo(x + 18, y + 90, x + 4, y + 8); ctx.stroke();
  ctx.strokeStyle = '#3f8f3a'; ctx.lineWidth = 8;
  const fronds = [[-1, -0.4], [-0.6, -0.9], [0, -1], [0.7, -0.85], [1, -0.35]];
  for (const [dx, dy] of fronds) {
    ctx.beginPath(); ctx.moveTo(x + 4, y + 8);
    ctx.quadraticCurveTo(x + 4 + dx * 34, y + 8 + dy * 30, x + 4 + dx * 52, y + 8 + dy * 52);
    ctx.stroke();
  }
  // Coconuts: 2 on the left, 3 on the right.
  const nuts = [[x - 4, y + 16], [x + 14, y + 20]];
  if (variant === 1) nuts.push([x + 5, y + 30]);
  ctx.fillStyle = '#7a4a21';
  for (const [nx, ny] of nuts) { ctx.beginPath(); ctx.arc(nx, ny, 7, 0, Math.PI * 2); ctx.fill(); }
}

function drawCrab(ctx, x, y, variant) {
  if (variant === 1) return; // the crab scuttled away in the right picture
  ctx.fillStyle = '#e5484d';
  ctx.beginPath(); ctx.ellipse(x, y, 16, 11, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#e5484d'; ctx.lineWidth = 3; ctx.lineCap = 'round';
  for (const s of [-1, 1]) {
    ctx.beginPath(); ctx.moveTo(x + s * 12, y - 6); ctx.lineTo(x + s * 20, y - 16); ctx.stroke();
    ctx.beginPath(); ctx.arc(x + s * 21, y - 17, 4, 0, Math.PI * 2); ctx.fill();
    for (let l = 0; l < 3; l++) {
      ctx.beginPath(); ctx.moveTo(x + s * 14, y + 2 + l * 4); ctx.lineTo(x + s * 24, y + 4 + l * 5); ctx.stroke();
    }
  }
  ctx.fillStyle = '#2d2a45';
  ctx.beginPath(); ctx.arc(x - 5, y - 2, 2, 0, Math.PI * 2); ctx.arc(x + 5, y - 2, 2, 0, Math.PI * 2); ctx.fill();
}

function drawShells(ctx) {
  ctx.fillStyle = '#ffffff';
  for (const [x, y, r] of [[60, 330, 6], [480, 330, 5], [250, 420, 6], [90, 410, 5]]) {
    ctx.beginPath(); ctx.arc(x, y, r, Math.PI, 0); ctx.fill();
    ctx.fillRect(x - r, y - 2, r * 2, 3);
  }
}
