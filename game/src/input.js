// Twin Lens — input: mouse clicks on either panel and full keyboard play.
// The keyboard moves a crosshair that is drawn on both panels at the same
// scene position; Enter or Space "clicks" there, exactly like a mouse click.
import { PANEL_W, PANEL_H } from './render.js';

export class InputController {
  constructor(leftCanvas, rightCanvas, actions) {
    this.left = leftCanvas;
    this.right = rightCanvas;
    this.actions = actions; // {onClick(scenePos), onMove(scenePos), onKey(name)}
    this.cursor = { x: PANEL_W / 2, y: PANEL_H / 2 };
    this.attach();
  }

  attach() {
    for (const [canvas, side] of [[this.left, 'left'], [this.right, 'right']]) {
      canvas.addEventListener('pointermove', (event) => {
        const pos = this.toScene(event, canvas);
        this.cursor = pos;
        this.actions.onMove(pos);
      });
      canvas.addEventListener('pointerleave', () => this.actions.onMove(null));
      canvas.addEventListener('click', (event) => {
        event.preventDefault();
        this.actions.onClick(this.toScene(event, canvas));
      });
    }
    window.addEventListener('keydown', (event) => this.onKey(event));
  }

  toScene(event, canvas) {
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * PANEL_W;
    const y = ((event.clientY - rect.top) / rect.height) * PANEL_H;
    return { x: Math.max(0, Math.min(PANEL_W, x)), y: Math.max(0, Math.min(PANEL_H, y)) };
  }

  onKey(event) {
    const step = event.shiftKey ? 4 : 14;
    const key = event.key;
    if (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown') {
      event.preventDefault();
      if (key === 'ArrowLeft') this.cursor.x = Math.max(0, this.cursor.x - step);
      if (key === 'ArrowRight') this.cursor.x = Math.min(PANEL_W, this.cursor.x + step);
      if (key === 'ArrowUp') this.cursor.y = Math.max(0, this.cursor.y - step);
      if (key === 'ArrowDown') this.cursor.y = Math.min(PANEL_H, this.cursor.y + step);
      this.actions.onMove({ ...this.cursor });
      this.actions.onKey('move');
      return;
    }
    if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      this.actions.onClick({ ...this.cursor });
      return;
    }
    const map = { h: 'hint', H: 'hint', m: 'mute', M: 'mute', Escape: 'pause', p: 'pause', P: 'pause', n: 'next', N: 'next' };
    if (map[key]) { event.preventDefault(); this.actions.onKey(map[key]); }
  }
}
