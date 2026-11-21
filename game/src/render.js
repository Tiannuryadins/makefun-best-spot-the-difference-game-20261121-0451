// Twin Lens — panel renderer: paints one scene panel, the found-difference
// markers on both panels, the hint pulse and the confetti burst on a find.
// One canvas per panel; the same scene painter draws both, variant 0 left,
// variant 1 right, so the panels stay near-identical by construction.
import { levelSeed, mulberry32 } from './rng.js';

export const PANEL_W = 560;
export const PANEL_H = 440;

export class PanelRenderer {
  constructor(leftCanvas, rightCanvas) {
    this.left = leftCanvas;
    this.right = rightCanvas;
    this.leftCtx = leftCanvas.getContext('2d');
    this.rightCtx = rightCanvas.getContext('2d');
    this.particles = [];
    this.hint = null; // {x, y, r, until}
    this.cursor = null; // {x, y} in scene coords, or null
    this.time = 0;
  }

  draw(level, levelIndex, foundIds, frozenTime = null) {
    this.time = frozenTime ?? performance.now() / 1000;
    const rng = mulberry32(levelSeed(levelIndex));
    this.paintPanel(this.leftCtx, level, 0, rng, foundIds);
    this.paintPanel(this.rightCtx, level, 1, mulberry32(levelSeed(levelIndex)), foundIds);
    this.drawParticles();
  }

  paintPanel(ctx, level, variant, rng, foundIds) {
    ctx.clearRect(0, 0, PANEL_W, PANEL_H);
    ctx.save();
    level.draw(ctx, PANEL_W, PANEL_H, variant, rng);
    ctx.restore();
    this.drawMarkers(ctx, level, foundIds);
    if (this.hint) this.drawHint(ctx);
    if (this.cursor) this.drawCursor(ctx);
  }

  drawMarkers(ctx, level, foundIds) {
    for (const diff of level.differences) {
      if (!foundIds.has(diff.id)) continue;
      const pulse = 1 + 0.12 * Math.sin(this.time * 3 + diff.x);
      const r = diff.r + 7 * pulse;
      ctx.save();
      ctx.strokeStyle = '#ffd93b';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#ff8a3c';
      ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.arc(diff.x, diff.y, r, 0, Math.PI * 2); ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#e5484d';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(diff.x, diff.y, r + 4, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#ffd93b';
      ctx.font = 'bold 16px "Segoe UI", system-ui, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('✓', diff.x, diff.y - r - 12);
      ctx.restore();
    }
  }

  drawHint(ctx) {
    if (this.time > this.hint.until) { this.hint = null; return; }
    const pulse = 0.5 + 0.5 * Math.sin(this.time * 8);
    ctx.save();
    ctx.strokeStyle = `rgba(123, 228, 149, ${0.55 + 0.45 * pulse})`;
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 8]);
    ctx.beginPath(); ctx.arc(this.hint.x, this.hint.y, this.hint.r + 12, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }

  drawCursor(ctx) {
    const { x, y } = this.cursor;
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#000'; ctx.shadowBlur = 4;
    ctx.beginPath(); ctx.arc(x, y, 13, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 20, y); ctx.lineTo(x - 8, y);
    ctx.moveTo(x + 8, y); ctx.lineTo(x + 20, y);
    ctx.moveTo(x, y - 20); ctx.lineTo(x, y - 8);
    ctx.moveTo(x, y + 8); ctx.lineTo(x, y + 20);
    ctx.stroke();
    ctx.restore();
  }

  burst(x, y) {
    for (let i = 0; i < 26; i++) {
      const a = (i / 26) * Math.PI * 2 + Math.random() * 0.4;
      const speed = 40 + Math.random() * 90;
      this.particles.push({
        x, y,
        vx: Math.cos(a) * speed, vy: Math.sin(a) * speed - 30,
        life: 0.7 + Math.random() * 0.3, age: 0,
        color: ['#ffd93b', '#ff8a5c', '#7be495', '#ffffff'][i % 4],
        size: 2 + Math.random() * 3,
      });
    }
  }

  drawParticles() {
    if (!this.particles.length) return;
    const dt = 1 / 60;
    this.particles = this.particles.filter((p) => (p.age += dt) < p.life);
    for (const p of this.particles) {
      p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 160 * dt;
    }
    for (const ctx of [this.leftCtx, this.rightCtx]) {
      for (const p of this.particles) {
        ctx.save();
        ctx.globalAlpha = 1 - p.age / p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    }
  }

  setHint(diff, seconds = 3) {
    this.hint = { x: diff.x, y: diff.y, r: diff.r, until: this.time + seconds };
  }

  clearHint() { this.hint = null; }
  setCursor(pos) { this.cursor = pos; }
  clearCursor() { this.cursor = null; }
}
