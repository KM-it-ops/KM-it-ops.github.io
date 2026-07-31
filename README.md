# Mahmoud Al Kurdi — Portfolio

Personal portfolio for **Mahmoud ("Michael") Al Kurdi** — Security Operations Analyst track. B.S. Information Technologies (Cybersecurity), *Summa Cum Laude*, SNHU 2026 · CompTIA Security+ (SY0-701).

**Design:** Ultra Design `product-site` · Class C. Iridescent scrutiny lens (R3F), pinned lens stage, elevated horizontal work cinema. Content from [`content/BRIEF.md`](content/BRIEF.md) only.

## Live

- Site: <https://km-it-ops.github.io/>
- Resume: [`Michael_Kurdi_Resume_2026.pdf`](https://km-it-ops.github.io/Michael_Kurdi_Resume_2026.pdf)

## Stack

- Vite + React 19 + TypeScript
- `@react-three/fiber` + `@react-three/drei` + `three`
- Hand-rolled CSS in `src/index.css` (Sora)

## Develop and deploy

```powershell
$env:Path = "C:\Program Files\nodejs;" + $env:Path
npm install
npm run dev       # http://127.0.0.1:5173
npm run build     # emits docs/
npm run preview   # grade the production bundle before push
```

GitHub Pages serves **main / docs**. Ship only after `build` + `preview` QA. Push requires Boss authority.

## Structure

| Path | Purpose |
| --- | --- |
| `src/` | App — App, HeroScene, PinStage, WorkCinema, content |
| `content/BRIEF.md` | Fact sheet (source of truth) |
| `docs/` | Built site (Pages) |
| `public/` | Resume PDF, favicon, robots, sitemap, 404 |
| `DESIGN.md` | Design direction |

Do not link the AgentForge Pages demo (`…/AgentForge/docs/demo/` is 404).
