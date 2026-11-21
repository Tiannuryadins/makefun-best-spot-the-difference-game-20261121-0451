// Twin Lens — all sound is synthesized with WebAudio oscillators, no audio
// files, no network. Every effect is a short envelope so a find feels
// rewarding and a miss feels soft, never punishing.
export class SoundBank {
  constructor() {
    this.context = null;
    this.muted = false;
    this.master = null;
  }

  ensureContext() {
    if (!this.context) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      this.context = new AC();
      this.master = this.context.createGain();
      this.master.gain.value = 0.22;
      this.master.connect(this.context.destination);
    }
    if (this.context.state === 'suspended') void this.context.resume();
    return this.context;
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.master) this.master.gain.value = this.muted ? 0 : 0.22;
    return this.muted;
  }

  tone(freq, startAt, dur, type = 'sine', vol = 1) {
    const ctx = this.ensureContext();
    if (!ctx || this.muted) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + startAt);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime + startAt);
    gain.gain.exponentialRampToValueAtTime(0.5 * vol, ctx.currentTime + startAt + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startAt + dur);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start(ctx.currentTime + startAt);
    osc.stop(ctx.currentTime + startAt + dur + 0.05);
  }

  // A soft tick for any click on a panel.
  click() { this.tone(660, 0, 0.06, 'triangle', 0.5); }

  // Two-note chime when a difference is found: the satisfying mark.
  found() {
    this.tone(523.25, 0, 0.16, 'sine', 1);
    this.tone(783.99, 0.09, 0.24, 'sine', 1);
    this.tone(1046.5, 0.18, 0.28, 'triangle', 0.6);
  }

  // Low buzz for a miss — short and gentle.
  miss() {
    this.tone(160, 0, 0.18, 'sawtooth', 0.45);
    this.tone(120, 0.05, 0.2, 'sawtooth', 0.35);
  }

  // Rising shimmer when a hint is spent.
  hint() {
    this.tone(880, 0, 0.12, 'sine', 0.7);
    this.tone(1174.66, 0.08, 0.14, 'sine', 0.7);
    this.tone(1567.98, 0.16, 0.2, 'sine', 0.6);
  }

  // Arpeggio for finishing a level.
  win() {
    [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => this.tone(f, i * 0.11, 0.3, 'triangle', 0.9));
  }

  // Descending line for running out of time.
  lose() {
    [392, 329.63, 261.63, 196].forEach((f, i) => this.tone(f, i * 0.14, 0.3, 'sine', 0.8));
  }

  // Short warning tick when the timer drops under ten seconds.
  tick() { this.tone(980, 0, 0.05, 'square', 0.3); }
}
