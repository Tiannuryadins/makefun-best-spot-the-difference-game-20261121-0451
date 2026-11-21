// Twin Lens — the level registry: three original scenes in rising difficulty.
// Each level is one module with one job: paint its scene twice (variant 0 =
// the left panel, variant 1 = the right panel with the differences applied)
// and list where those differences hide.
import { parkLevel } from './levels/park.js';
import { beachLevel } from './levels/beach.js';
import { marketLevel } from './levels/market.js';

export const LEVELS = [parkLevel, beachLevel, marketLevel];

export function levelById(id) {
  return LEVELS.find((level) => level.id === id) ?? LEVELS[0];
}

export function totalDifferences() {
  return LEVELS.reduce((sum, level) => sum + level.differences.length, 0);
}
