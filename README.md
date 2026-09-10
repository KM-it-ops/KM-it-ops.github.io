# Michael Kurdi — Portfolio

New graduate **Junior Security Analyst / Security Operations / IT Risk** site. B.S. Information Technologies (Cybersecurity concentration), Summa Cum Laude, SNHU · CompTIA Security+.

**Design:** Mash dossier with a fixed glass planet, sticky hire card in the hero, and a Look picker (defaults to Warm Grit; optional “Always use this look” pin). Content from [`src/content.ts`](src/content.ts) / [`content/BRIEF.md`](content/BRIEF.md).

## Live

- Site: <https://km-it-ops.github.io/>
- Resume: [`resume.html`](https://km-it-ops.github.io/resume.html) (print to PDF)

## Stack

- Vite + React 19 + TypeScript
- Mash CSS (`src/designs/mash*.css`) — Syne / Figtree / JetBrains Mono (+ layout skins)
- React Three Fiber hero lens (lazy-loaded)

## Develop and deploy

```powershell
$env:Path = "C:\\Program Files\\nodejs;" + $env:Path
npm install
npm run dev
npm run build
npm run preview
```

GitHub Pages serves **main / docs**.
