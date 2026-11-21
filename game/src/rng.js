// Twin Lens — deterministic random numbers so both panels of a level share the
// same decorative layout (clouds, stars, pebbles) and a screenshot replays
// exactly. Mulberry32: small, fast, seedable.
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Pick a stable seed per level so decorative randomness never differs between
// the two panels or between two runs of the same level.
export function levelSeed(levelIndex) {
  return 0x9e3779b9 + levelIndex * 7919;
}
