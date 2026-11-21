# Mahmoud Al Kurdi Portfolio

Portfolio for a **Junior SOC / Security Analyst · Security Operations · Vulnerability Management** job search. B.S. Information Technologies (Cybersecurity concentration), summa cum laude, SNHU · CompTIA Security+.

**Design:** A blueprint drawing set with five sheets (Cover, Schematic, Assembly, Details, Path) on light or dark paper. The HTML is prerendered, `src/blueprint/enhance.ts` adds interaction after load, and `prefers-reduced-motion` is honoured. Copy lives in [`src/content.ts`](src/content.ts) and [`content/BRIEF.md`](content/BRIEF.md).

## Live

- Site: <https://km-it-ops.github.io/>
- Resume: [`resume.html`](https://km-it-ops.github.io/resume.html) · [PDF](https://km-it-ops.github.io/Mahmoud_Al_Kurdi_Resume.pdf)

## Stack

- Vite + React 19 + TypeScript, prerendered by `scripts/prerender.mjs`
- Blueprint CSS with self-hosted Unbounded, Red Hat Text and Roboto Mono fonts
- Playwright + axe QA (`qa/qa.py`): 5 viewports × 2 themes × reduced motion, plus a no-JS pass

## Develop and deploy

```powershell
$env:Path = "C:\\Program Files\\nodejs;" + $env:Path
npm install
npm run dev
npm run build
npm run preview
```

`npm run build` writes the site to `docs/`. Commit the rebuilt `docs/`. On push to **main**, `.github/workflows/pages.yml` does a static deploy of that prebuilt `docs/` folder; it doesn't run a build.
