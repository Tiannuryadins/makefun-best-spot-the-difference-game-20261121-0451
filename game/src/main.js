// Twin Lens — bootstrap. Builds the game, shows the title screen, and
// supports screenshot mode: ?shot=cover|beach|market|win freezes the game in
// a chosen state with a few differences already found, so the screenshots are
// real renders of this code with markers, unfound differences and a counter.
import { TwinLensGame } from './game.js';
import { LEVELS } from './levels.js';

const game = new TwinLensGame(document);
window.__twinLens = game; // play-test hook: state, clickAt, startLevel, phase

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
if (shot) {
  game.shotMode = true;
  game.frozenTime = 1.6; // fixed animation time: markers and hint pulse identically every run
  const foundCount = { cover: 3, beach: 2, market: 4, win: 7, title: 0 }[shot] ?? 0;
  const levelIndex = { cover: 0, beach: 1, market: 2, win: 0, title: 0 }[shot] ?? 0;
  game.startLevel(levelIndex);
  const level = LEVELS[levelIndex];
  level.differences.slice(0, foundCount).forEach((diff) => {
    game.found.add(diff.id);
    game.score += 100;
  });
  game.timeLeft = { cover: 147, beach: 121, market: 88, win: 132, title: 180 }[shot] ?? 120;
  game.updateHud();
  if (shot === 'win') {
    // Find them all, then let the real level-complete path run its overlay.
    level.differences.forEach((diff) => game.found.add(diff.id));
    game.levelComplete();
  }
  if (shot === 'title') game.showTitle();
  document.getElementById('toast').classList.add('hidden');
} else {
  game.showTitle();
}
