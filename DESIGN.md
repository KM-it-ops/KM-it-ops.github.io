# DESIGN — Casefile Monument

**Lane:** product-site craft · **evolved** past iridescent-lens cinema (Boss rejected as agency/bland)  
**Live:** https://km-it-ops.github.io/  
**Content SoT:** [`content/BRIEF.md`](content/BRIEF.md)

## Direction

Paper-led personal site. Signature beat: **CYB-210 Packet Tracer topology SVG** that draws itself — his coursework as the spectacle, not a purchased 3D lens. Labs as a vertical casefile list with plain English. One void band for contact only.

## Dials

`DESIGN_VARIANCE` 7 · `MOTION_INTENSITY` 6 · `VISUAL_DENSITY` 4 · Class A (Vite+React, no R3F)

## Tokens

```css
--paper: #e9ebe8;
--ink: #14171c;
--accent: #0f6e56;
--accent-2: #c45d2c; /* scarce */
--font: "Syne";
--mono: "IBM Plex Mono";
```

## Spine

1. Hero — topology SVG atmosphere + name + one line + CTAs  
2. Facts — GPA / Sec+ / 2015 monument strip  
3. Labs — five coursework casefiles  
4. Path — experience  
5. Contact — void band  

## Deploy

- Vite `base: '/'`, `build.outDir: 'docs'`
- Gate: `npm run build` → `npm run preview` before push
