[![make.fun](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Tiannuryadins/makefun-best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Tiannuryadins/makefun-best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

# Twin Lens — Cari Perbedaannya

A complete, original spot-the-difference game that runs offline in a desktop
browser from static files. Two near-identical pictures side by side, markers
on the differences found, several still unfound, and a counter of how many
remain — played with mouse and keyboard.

[Play the bounty on make.fun](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

## How to play

- **Click** a difference on either picture (or move the crosshair with the
  **arrow keys** and press **Enter** / **Space**).
- Found differences get a gold ring marker on **both** panels, a chime and a
  confetti burst. A miss costs 10 points and 3 seconds.
- **H** spends one of 3 hints per level (a pulsing green ring, −50 points).
- **M** toggles sound, **Esc** pauses, **N** continues from a finished level.

## Levels

1. **Taman Kota Pagi** — 7 differences, 3 minutes (park, pond, bench, dog)
2. **Pantai Senja** — 8 differences, 2.5 minutes (sunset beach, umbrella, crab)
3. **Pasar Malam** — 10 differences, 2 minutes (night market, lanterns, cat)

All art is drawn procedurally on canvas at run time — no image files, no
network. All sounds are synthesized with WebAudio — no audio files. Finishing
a level scores a time bonus plus a no-miss bonus; finishing all three shows
the campaign score.

## Run it

```sh
node serve.ts        # serves game/ at http://localhost:8080
```

or serve `game/` with any static server and open `index.html`. No build step.

Screenshot mode (used for the entry's screenshots, real renders of this code):

```sh
# ?shot=cover | beach | market | win — freezes a state with some differences found
http://localhost:8080/?shot=cover
```

## Hand-in

`main.ts` (Node 22, standard library only) copies `game/` and `screenshots/`
to `/output` and writes `/output/dossier.json` with the vendored
`vendor/makefun-game.ts` library:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Layout

- `game/index.html` + `game/styles.css` — shell, HUD, overlays
- `game/src/main.js` — bootstrap + screenshot mode
- `game/src/game.js` — state machine, score, timer, hints
- `game/src/render.js` — panel painting, markers, particles
- `game/src/input.js` — mouse + keyboard
- `game/src/audio.js` — WebAudio synth effects
- `game/src/rng.js` — seeded random numbers
- `game/src/levels.js` — level registry
- `game/src/levels/park.js`, `beach.js`, `market.js` — the three original scenes
- `screenshots/` — 4 real renders of the game in a browser
- `vendor/makefun-game.ts` — the kit's library, unchanged
