# Portfolio revamp — Windows local preview

Branch: `revamp/professional-hire-2026-09`  
**Do not push to main or force-push live Pages.** Preview locally only until Michael approves.

## Prerequisites
- Node.js 20+ (22+ preferred) and npm
- Extract `portfolio-revamp-preview.zip` to a folder (e.g. `Desktop\portfolio-revamp-preview`)

## PowerShell steps

```powershell
# from extracted folder
npm ci
npm run build
npx vite preview --host 127.0.0.1 --port 4175
# open http://127.0.0.1:4175/
# when done: stop the server (Ctrl+C)
```

## What to check
- Hero: hire lane from content (Junior Security Analyst / …), CTAs Resume · Email · LinkedIn · GitHub
- Selected work: log anomaly lead; Proofhouse featured engineering; no PromptRig primary
- Also shipping: AgentForge → GitHub only; OFG Dairy Site → Open site (ofg-sites.vercel.app), labeled client delivery
- No AgentForge live / agentforgestudio links
- Resume CTA → `/resume.html`
- View-source: title/meta/OG/Twitter, canonical, JSON-LD, `/site.webmanifest` (not a hashed 404), `/og-card.png`
- `prefers-reduced-motion`: poster path still works; no forced motion

## Notes
- Zip excludes `node_modules` and `.git`. Always run `npm ci` first.
- Built `docs/` is included for reference; `npm run build` regenerates it.
- Kill the preview server when finished (Ctrl+C). Do not leave it running.
