# Michael Kurdi — Portfolio

New graduate **IT Support / SOC Analyst** site. B.S. IT (Cybersecurity), Summa Cum Laude, SNHU · CompTIA Security+.

**Design:** Mash dossier with a fixed glass planet, sticky hire card in the hero, and a Look picker (10 color+layout skins; random on each visit). Content from [`src/content.ts`](src/content.ts) / [`content/BRIEF.md`](content/BRIEF.md).

## Live

- Site: <https://km-it-ops.github.io/>
- Resume: [`Michael_Kurdi_Resume_2026.pdf`](https://km-it-ops.github.io/Michael_Kurdi_Resume_2026.pdf)

## Stack

- Vite + React 19 + TypeScript
- Mash CSS (`src/designs/mash*.css`) — Syne / Figtree / JetBrains Mono (+ layout skins)
- React Three Fiber hero lens (lazy-loaded)

## Develop and deploy

```powershell
$env:Path = "C:\Program Files\nodejs;" + $env:Path
npm install
npm run dev
npm run build
npm run preview
```

GitHub Pages serves **main / docs**.
