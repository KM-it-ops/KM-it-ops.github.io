# Bold portfolio mocks (round 2)

Static, self-contained HTML direction previews after A/B/C were rejected as too bland. **Not** the React/Vite app. Do not push to git remote or GitHub Pages unless explicitly approved later.

## Local server

From this folder:

```bash
python3 -m http.server 4181 --bind 127.0.0.1
```

## URLs (box / CoS phone preview)

| Page | URL |
| --- | --- |
| Index (hub) | http://127.0.0.1:4181/ |
| D — Signal Brutal | http://127.0.0.1:4181/d-signal-brutal.html |
| E — Noir Spotlight | http://127.0.0.1:4181/e-noir-spotlight.html |
| **E+ Assets** (sticky morph nav + 10 heroes) | http://127.0.0.1:4181/e-noir-assets.html |
| F — Kinetic Ink | http://127.0.0.1:4181/f-kinetic-ink.html |

Files live at:

`/workspace/portfolio-draft-v2/dist-preview/mocks-bold/`

## Files

- `index.html` — hub with labels + short descriptions
- `d-signal-brutal.html` — brutalist black/white + electric lime; huge type; poster cards
- `e-noir-spotlight.html` — cinematic noir + gold spotlight; serif name; film stills
- `e-noir-assets.html` — **E+ Assets**: sticky locked nav; selected hero asset morphs/shrinks into nav on scroll; 10 CSS/SVG asset concepts with picker
- `f-kinetic-ink.html` — indigo + vermillion; skew/diagonal rhythm; big 01/02 numbers

Each mock is a single HTML file (inline CSS). `@media (prefers-reduced-motion: reduce)` kills motion/skew. No Three.js, no build step.
