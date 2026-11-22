# Deploying to GitHub Pages

The site is Vite + React + TypeScript, prerendered to static HTML in `docs/`.

1. Build locally: `npm run build` (runs `tsc --noEmit`, `vite build` into `docs/`, then `scripts/prerender.mjs`). Commit the rebuilt `docs/`.
2. Merge to `main`. The **Deploy Pages** workflow (`.github/workflows/pages.yml`) uploads the committed, prebuilt `docs/` as-is. It does not build.
3. The site is served at `https://km-it-ops.github.io/`.

The canonical **PDF résumé** is `/Mahmoud_Al_Kurdi_Resume.pdf`. The browser-readable **HTML résumé** is `/resume.html` (preview first; Download PDF is a separate control). The old-name PDF aliases are deleted on Boss's instruction (decision of Nov 17, 2026) and return 404 once this change is live.
