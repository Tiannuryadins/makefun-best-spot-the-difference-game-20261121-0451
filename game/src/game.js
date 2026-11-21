// Twin Lens — the game state machine: title, playing, paused, level complete,
// campaign complete, and time up. Owns the score, the timer, the hints and
// the found set; the renderer only paints what this state describes.
import { LEVELS } from './levels.js';
import { PanelRenderer } from './render.js';
import { InputController } from './input.js';
import { SoundBank } from './audio.js';

export const PHASES = ['title', 'playing', 'paused', 'levelDone', 'campaignDone', 'timeUp'];

export class TwinLensGame {
  constructor(doc) {
    this.doc = doc;
    this.sounds = new SoundBank();
    this.renderer = new PanelRenderer(
      doc.getElementById('canvas-left'),
      doc.getElementById('canvas-right'),
    );
    this.levelIndex = 0;
    this.phase = 'title';
    this.found = new Set();
    this.score = 0;
    this.totalScore = 0;
    this.misses = 0;
    this.hintsLeft = 3;
    this.timeLeft = 0;
    this.timerId = null;
    this.lastTickSecond = -1;
    this.frozenTime = null; // set by shot mode so screenshots replay exactly
    this.shotMode = false;
    this.onPhaseChange = null;

    this.input = new InputController(
      doc.getElementById('canvas-left'),
      doc.getElementById('canvas-right'),
      {
        onClick: (pos) => this.clickAt(pos),
        onMove: (pos) => this.renderer.setCursor(pos),
        onKey: (name) => this.handleKey(name),
      },
    );
    doc.getElementById('mute-btn').addEventListener('click', () => this.toggleMute());
    doc.getElementById('pause-btn').addEventListener('click', () => this.togglePause());
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  get level() { return LEVELS[this.levelIndex]; }
  get remaining() { return this.level.differences.length - this.found.size; }

  startLevel(index) {
    this.levelIndex = index;
    this.found = new Set();
    this.score = 0;
    this.misses = 0;
    this.hintsLeft = this.level.hints;
    this.timeLeft = this.level.timeLimit;
    this.lastTickSecond = -1;
    this.renderer.clearHint();
    this.phase = 'playing';
    this.hideOverlay();
    this.startTimer();
    this.updateHud();
    this.announce(`${this.level.name}: cari ${this.level.differences.length} perbedaan.`);
  }

  startTimer() {
    this.stopTimer();
    if (this.shotMode) return; // screenshots never tick
    this.timerId = setInterval(() => {
      if (this.phase !== 'playing') return;
      this.timeLeft -= 1;
      if (this.timeLeft <= 10 && this.timeLeft > 0 && this.timeLeft !== this.lastTickSecond) {
        this.lastTickSecond = this.timeLeft;
        this.sounds.tick();
      }
      if (this.timeLeft <= 0) { this.timeLeft = 0; this.timeUp(); }
      this.updateHud();
    }, 1000);
  }

  stopTimer() {
    if (this.timerId !== null) { clearInterval(this.timerId); this.timerId = null; }
  }

  clickAt(pos) {
    if (this.phase !== 'playing' || !pos) return;
    this.sounds.click();
    const hit = this.level.differences.find(
      (d) => !this.found.has(d.id) && Math.hypot(d.x - pos.x, d.y - pos.y) <= d.r + 6,
    );
    if (hit) {
      this.found.add(hit.id);
      this.score += 100;
      this.sounds.found();
      this.renderer.burst(hit.x, hit.y);
      this.toast(`Ketemu! ${hit.name} (+100)`);
      this.announce(`Ketemu ${hit.name}. Sisa ${this.remaining}.`);
      if (this.remaining === 0) this.levelComplete();
    } else {
      this.misses += 1;
      this.score = Math.max(0, this.score - 10);
      this.timeLeft = Math.max(0, this.timeLeft - 3);
      this.sounds.miss();
      this.toast('Bukan di situ — minus 10 poin, minus 3 detik');
    }
    this.updateHud();
  }

  useHint() {
    if (this.phase !== 'playing') return;
    if (this.hintsLeft <= 0) { this.toast('Petunjuk habis!'); return; }
    const remaining = this.level.differences.filter((d) => !this.found.has(d.id));
    if (!remaining.length) return;
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    this.hintsLeft -= 1;
    this.score = Math.max(0, this.score - 50);
    this.sounds.hint();
    this.renderer.setHint(pick, 3);
    this.toast(`Petunjuk: cari di sekitar lingkaran hijau (−50)`);
    this.updateHud();
  }

  levelComplete() {
    this.stopTimer();
    const timeBonus = this.timeLeft * 5;
    const accuracyBonus = this.misses === 0 ? 200 : 0;
    const levelScore = this.score + timeBonus + accuracyBonus;
    this.totalScore += levelScore;
    this.sounds.win();
    const stars = this.misses === 0 && this.timeLeft > 60 ? 3 : this.misses <= 2 ? 2 : 1;
    if (this.levelIndex === LEVELS.length - 1) {
      this.phase = 'campaignDone';
      this.showCampaignComplete();
    } else {
      this.phase = 'levelDone';
      this.showLevelComplete({ levelScore, timeBonus, accuracyBonus, stars });
    }
    this.updateHud();
  }

  timeUp() {
    this.stopTimer();
    this.sounds.lose();
    this.phase = 'timeUp';
    this.showTimeUp();
  }

  togglePause() {
    if (this.phase === 'playing') {
      this.phase = 'paused';
      this.showPaused();
    } else if (this.phase === 'paused') {
      this.phase = 'playing';
      this.hideOverlay();
    }
  }

  toggleMute() {
    const muted = this.sounds.toggleMute();
    this.doc.getElementById('mute-btn').textContent = muted ? '✕' : '♪';
    this.toast(muted ? 'Suara mati' : 'Suara hidup');
  }

  handleKey(name) {
    if (name === 'hint') this.useHint();
    if (name === 'mute') this.toggleMute();
    if (name === 'pause') this.togglePause();
    if (name === 'next' && (this.phase === 'levelDone' || this.phase === 'campaignDone')) this.nextFromOverlay();
  }

  nextFromOverlay() {
    if (this.phase === 'levelDone') this.startLevel(this.levelIndex + 1);
    else if (this.phase === 'campaignDone') this.showTitle();
    else if (this.phase === 'timeUp') this.startLevel(this.levelIndex);
  }

  // ---- HUD and overlays ----
  updateHud() {
    const d = this.doc;
    d.getElementById('level-name').textContent = `${this.level.name} — Level ${this.levelIndex + 1} dari ${LEVELS.length}`;
    d.getElementById('remaining-count').textContent = String(this.remaining);
    d.getElementById('remaining-of').textContent = `/ ${this.level.differences.length} perbedaan`;
    d.getElementById('found-count').textContent = String(this.found.size);
    d.getElementById('hint-count').textContent = String(this.hintsLeft);
    d.getElementById('miss-count').textContent = String(this.misses);
    d.getElementById('score').textContent = String(this.score + this.totalScore);
    const mins = Math.floor(this.timeLeft / 60);
    const secs = String(this.timeLeft % 60).padStart(2, '0');
    d.getElementById('timer-text').textContent = `${mins}:${secs}`;
    const bar = d.getElementById('timer-bar');
    bar.style.width = `${(this.timeLeft / this.level.timeLimit) * 100}%`;
    bar.classList.toggle('low', this.timeLeft <= 30);
  }

  toast(message) {
    const el = this.doc.getElementById('toast');
    el.textContent = message;
    el.classList.remove('hidden');
    clearTimeout(this.toastId);
    this.toastId = setTimeout(() => el.classList.add('hidden'), 2200);
  }

  announce(message) {
    this.doc.getElementById('sr-status').textContent = message;
  }

  hideOverlay() { this.doc.getElementById('overlay').classList.add('hidden'); }

  showOverlay({ title, sub, bodyHtml, buttons }) {
    const overlay = this.doc.getElementById('overlay');
    this.doc.getElementById('overlay-title').textContent = title;
    this.doc.getElementById('overlay-sub').textContent = sub;
    this.doc.getElementById('overlay-body').innerHTML = bodyHtml;
    const box = this.doc.getElementById('overlay-buttons');
    box.innerHTML = '';
    for (const { label, secondary, action } of buttons) {
      const btn = this.doc.createElement('button');
      btn.type = 'button';
      btn.textContent = label;
      if (secondary) btn.className = 'secondary';
      btn.addEventListener('click', action);
      box.appendChild(btn);
    }
    overlay.classList.remove('hidden');
    if (this.onPhaseChange) this.onPhaseChange(this.phase);
  }

  showTitle() {
    this.phase = 'title';
    this.totalScore = 0;
    const cards = LEVELS.map((level, i) => `
      <div class="level-card" data-level="${i}" tabindex="0" role="button">
        <h3>${i + 1}. ${level.name}</h3>
        <p>${level.subtitle}</p>
      </div>`).join('');
    this.showOverlay({
      title: 'TWIN LENS',
      sub: 'Cari semua perbedaan di antara dua gambar yang hampir identik.',
      bodyHtml: `
        <p>Dua gambar berdampingan — <b>Gambar A</b> dan <b>Gambar B</b> — hampir sama,
        tapi ada <b>${this.level.differences.length}–10 perbedaan</b> tersembunyi.
        Klik perbedaannya di gambar mana pun. Tiga level, makin sulit, makin cepat.</p>
        <div class="level-pick">${cards}</div>`,
      buttons: [
        { label: '▶ Mulai dari Level 1', action: () => this.startLevel(0) },
      ],
    });
    this.doc.querySelectorAll('.level-card').forEach((card) => {
      const go = () => this.startLevel(Number(card.dataset.level));
      card.addEventListener('click', go);
      card.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
    });
  }

  showPaused() {
    this.showOverlay({
      title: 'JEDA',
      sub: 'Istirahat sebentar — timer berhenti.',
      bodyHtml: `<p>Skor sementara <b>${this.score + this.totalScore}</b> · Sisa <b>${this.remaining}</b> perbedaan.</p>`,
      buttons: [
        { label: '▶ Lanjutkan', action: () => this.togglePause() },
        { label: 'Pilih Level', secondary: true, action: () => this.showTitle() },
      ],
    });
  }

  showLevelComplete({ levelScore, timeBonus, accuracyBonus, stars }) {
    const next = LEVELS[this.levelIndex + 1];
    this.showOverlay({
      title: 'LEVEL SELESAI!',
      sub: `${this.level.name} — semua ${this.level.differences.length} perbedaan ketemu.`,
      bodyHtml: `
        <div class="stars">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
        <p class="big-score">${levelScore} poin</p>
        <p>Skor level ${this.score} + bonus waktu ${timeBonus}${accuracyBonus ? ` + bonus tanpa salah ${accuracyBonus}` : ''}<br>
        Total sejauh ini: <b>${this.totalScore}</b></p>`,
      buttons: [
        { label: `▶ Lanjut: ${next.name}`, action: () => this.startLevel(this.levelIndex + 1) },
        { label: 'Pilih Level', secondary: true, action: () => this.showTitle() },
      ],
    });
  }

  showTimeUp() {
    this.showOverlay({
      title: 'WAKTU HABIS',
      sub: `${this.level.name} — masih ada ${this.remaining} perbedaan yang belum ketemu.`,
      bodyHtml: `<p>Kamu menemukan <b>${this.found.size}</b> dari ${this.level.differences.length} perbedaan.<br>
        Coba lagi — sekarang kamu sudah tahu sebagian tempatnya.</p>`,
      buttons: [
        { label: '↻ Coba Lagi', action: () => this.startLevel(this.levelIndex) },
        { label: 'Pilih Level', secondary: true, action: () => this.showTitle() },
      ],
    });
  }

  showCampaignComplete() {
    this.phase = 'campaignDone';
    this.showOverlay({
      title: 'KAMU MENANG!',
      sub: 'Semua level selesai — mata elang!',
      bodyHtml: `<p class="big-score">${this.totalScore} poin</p>
        <p>Kamu menemukan seluruh <b>${LEVELS.reduce((s, l) => s + l.differences.length, 0)} perbedaan</b>
        di tiga dunia Twin Lens.</p>`,
      buttons: [
        { label: '↻ Main Lagi dari Level 1', action: () => this.startLevel(0) },
        { label: 'Pilih Level', secondary: true, action: () => this.showTitle() },
      ],
    });
  }

  loop() {
    // Always paint the current level behind the overlay, so the title screen
    // already shows the park scene and screenshots never catch a blank panel.
    this.renderer.draw(this.level, this.levelIndex, this.found, this.frozenTime);
    requestAnimationFrame(this.loop);
  }
}
