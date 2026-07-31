# Mahmoud Al Kurdi — Portfolio

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-live-79e8bd?style=flat-square&logo=github&labelColor=080b10)](https://km-it-ops.github.io/)
[![Built with](https://img.shields.io/badge/built%20with-Vite%20%2B%20React%20%2B%20R3F-7ba7ff?style=flat-square&labelColor=080b10)](https://km-it-ops.github.io/)
[![Resume](https://img.shields.io/badge/resume-.pdf-ef6d6d?style=flat-square&labelColor=080b10)](https://km-it-ops.github.io/Michael_Kurdi_Resume_2026.pdf)

Personal portfolio for **Mahmoud ("Michael") Al Kurdi** — B.S. Information Technologies (Cybersecurity concentration), *Summa Cum Laude*, Southern New Hampshire University 2026 · CompTIA Security+ (SY0-701).

**Design:** product-site polish with neon-command accents (dark, gold/teal). The hero is a React Three Fiber "credential monolith" — transmission glass with iridescence under gold and teal rim light. All showcased projects were cleared in the 2026 overhaul; two flagship slots are reserved for upcoming builds.

## Live

- Site: <https://km-it-ops.github.io/>
- PDF resume: [`Michael_Kurdi_Resume_2026.pdf`](https://km-it-ops.github.io/Michael_Kurdi_Resume_2026.pdf)

## Stack

- Vite + React 19 + TypeScript
- `@react-three/fiber` + `@react-three/drei` hero scene (lazy-loaded; three.js ships as a separate chunk)
- No component library, no CSS framework — hand-rolled design system in `src/styles.css`

## Develop and deploy

```bash
npm install
npm run dev       # local dev server
npm run build     # type-check + build into docs/
npm run preview   # serve the production build locally
```

Deployment is **Actions-free**: `npm run build` emits the static site into `docs/`, which is committed to `main`. GitHub Pages serves from **main /docs** ("Deploy from a branch"). To ship changes: build, commit `docs/` alongside the source changes, push.

## Structure

| Path | Purpose |
| --- | --- |
| [`src/`](src/) | App source — components, hooks, design tokens, transcript-sourced content in `src/data.ts` |
| [`docs/`](docs/) | Built site output — **generated, served by GitHub Pages** |
| [`notes/`](notes/) | Brand rollout, GitHub profile setup, and deploy runbooks (moved out of `docs/` in the 2026 rebuild) |
| [`public/`](public/) | Static files copied verbatim into the build (resume PDF, favicon, robots, sitemap, 404) |
| [`PROFILE_README.md`](PROFILE_README.md) | Source for GitHub profile README (`KM-it-ops/KM-it-ops`) |
| [`linkedin/`](linkedin/) | LinkedIn headline, About, posts, setup checklist |
| [`assets/`](assets/) | Brand assets (banners, portrait, canonical resume PDF) |

## Accessibility and performance

- Skip link, semantic landmarks, `:focus-visible` rings
- `prefers-reduced-motion`: WebGL hero is replaced by a static poster and the three.js chunk is never loaded
- Hero scene pauses offscreen and when the tab is hidden; DPR capped at 2
- Three.js code-split behind `React.lazy` — main bundle ~65 kB gzip

## License

Copyright 2026 Mahmoud ("Michael") Al Kurdi. All rights reserved.
