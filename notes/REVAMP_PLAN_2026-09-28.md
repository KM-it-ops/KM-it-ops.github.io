# Portfolio revamp plan — 2026-09-28

**Status:** draft for Michael / CoS approval before mk preview or Pages push  
**Live:** https://km-it-ops.github.io/  
**Repo:** KM-it-ops/KM-it-ops.github.io @ main `995211e`  
**Constraints:** comfortable readable UI + `prefers-reduced-motion` nonnegotiable; no live Pages until mk Windows preview approved; no SIEM/EDR tenure claims.

## 1. Audit snapshot

### What’s already good
- Clear junior-analyst hire lane in source: Security Operations / VM / IT Risk, Charlotte / remote.
- Honest BRIEF (`content/BRIEF.md`) — labs labeled labs; AgentForge demo not linked.
- robots.txt + sitemap.xml present; basic title / description / OG / Twitter meta exist.
- `/resume.html` print path; LinkedIn + GitHub in content + noscript.
- Immersive craft + readable type floors already in CSS; R3F world code-split.

### Gaps (prioritized)

**P0 — recruiter trust / discoverability**
1. **Built `docs/` lags source** — live still ships `hire-patch.js` text swaps + CSS/MutationObserver to hide AgentForge Vercel links. Clean rebuild from current `src/content.ts` and delete hire-patch hacks.
2. **OG/Twitter image is `/favicon.svg`** — weak when shared from LinkedIn; need a real ~1200×630 PNG (absolute URL).
3. **No canonical URL, no JSON-LD** (`Person` + `WebSite`) for AI/recruiter parsers.
4. **Sitemap only lists `/`** — add `/resume.html` (and any future project pages).
5. **Immersive UI still special-cases `ofg` id** but OFG moved to `SIDE_PROJECTS` — side projects (OFG, AgentForge) may be under-rendered vs CoS/LinkedIn asks.

**P1 — positioning / IA**
6. Homepage narrative should lead with **detection / triage / VM proof**, then shipping (Proofhouse, AgentForge, OFG) — match LinkedIn pack without inventing SOC tenure.
7. **PromptRig → Proofhouse** rename: CoS/LinkedIn packs still say PromptRig; site BRIEF says Proofhouse. Align naming everywhere.
8. Project cards: Log anomaly (favorite) · Phishing classifier · VulnTrack · Proofhouse; side: AgentForge (+ ATT&CKLens mention) · OFG (client-only label).
9. Stronger CTAs: Resume · Email · LinkedIn · GitHub, above the fold and in contact.
10. Optional light AppSec/GRC signals only via existing academic labs (CIS/HIPAA, threat models) — labeled academic.

**P2 — performance / polish**
11. ~1.2MB JS (three + r3f) before interaction — keep adaptive quality / reduced-motion poster; consider deferring world until idle or first scroll on low-end.
12. Too many Google Fonts families — trim to display + body + mono.
13. Remove dead design previews / draft noise from what ships in `docs/`.

## 2. Keyword alignment (LinkedIn draft pack)

| Surface | Lock to |
|--------|---------|
| `<title>` / OG title | `Michael Kurdi — Junior Security Analyst \| Security+ · Detection, VM, IT Risk \| Charlotte / Remote` (or LinkedIn’s final headline #1 once they land) |
| Meta description | Security+, Summa 3.96, log anomaly / phishing / vuln workflow repos, aviation regulated-ops transfer, open to Tier-1 SOC / Jr Detection / security automation |
| Project tags | SOC triage · Detection · Vuln workflow · PromptOps (Proofhouse) · Client delivery (OFG) |
| Soft CTA | Portfolio hub + GitHub KM-it-ops + Resume |

**Do not claim:** multi-year SIEM/EDR/firewall tenure, production alert volumes, PromptRig benchmarks, GitHub stars.

## 3. Visual / IA direction (professional, not a new art direction)

Keep the immersive dark system (already ceiling craft) but make it **hire-first**:
1. **Hero** — name, hire lane, Security+ + Summa chips, primary Resume + Email, secondary LinkedIn/GitHub.
2. **At a glance** — HIRE_BRIEF three bullets (want / bring / won’t claim).
3. **Selected work** — four featured cards (log anomaly lead); honest links (GitHub; OFG live only).
4. **Also shipping** — AgentForge, OFG (labeled client site), ATT&CKLens one-liner.
5. **Labs** — coursework filmstrip, clearly labeled.
6. **Path** — AA crew chief → degree/Security+ → logistics while building.
7. **Contact** — email, phone, LinkedIn, GitHub, Resume.

Reduced-motion: existing poster path stays; Lenis off on coarse/reduced.

## 4. SEO deliverables

- Update `index.html` title/description/OG/Twitter; absolute `og:image` + `twitter:image`.
- Add `<link rel="canonical">`.
- Add JSON-LD `Person` + `WebSite`.
- Expand `public/sitemap.xml`; keep `robots.txt`.
- Rebuild `docs/` without hire-patch; verify AgentForge live URLs absent in source.
- Optional: `keywords` meta only if we keep it short and honest (many crawlers ignore — JSON-LD + copy matter more).

## 5. Implementation sequence (after plan approval)

1. Branch `revamp/professional-hire-2026-09` from main.
2. Content + ImmersivePortfolio: render `SIDE_PROJECTS`, drop stale `ofg` hacks, align labels with BRIEF + LinkedIn pack.
3. SEO assets (OG image, head tags, JSON-LD, sitemap).
4. Strip hire-patch from build pipeline / docs.
5. Readable + reduced-motion pass (375 / 768 / 1280).
6. **mk preview package:** zip + PowerShell `npm ci` / `npm run build` / `npx vite preview` notes; serve locally; **kill servers after**.
7. Ping CoS + Michael with preview path; **wait for explicit approve** before Pages/`main` push.

## 6. Decisions locked (CoS 2026-09-28)

1. **Lead cyber favorite:** log anomaly detection.
2. **Proofhouse** = featured engineering / PromptOps (PromptRig name retired on site).
3. **OFG + AgentForge** = side projects only; **no AgentForge demo/live link** until fixed.
4. Immersive WebGL kept as progressive enhancement; reduced-motion poster remains nonnegotiable.
5. No live Pages until Michael approves mk preview.

## 7. Executor audit close-out (2026-09-28 ~09:06 ET) — PASS

Factual pass against **live** `https://km-it-ops.github.io/` and **origin/main** `995211e` (`fix(docs): repair double-encoded em dashes…`, 2026-09-23 12:47 ET). No code changes; no push. Working tree may lag; analysis used `git show origin/main:…` + live curl.

### Live SEO snapshot
| Item | Finding |
|------|---------|
| Title | `Michael Kurdi — Junior Security Analyst / Security Operations / IT Risk` |
| Meta description | Present (Security+, Summa, detection/vuln/case files) |
| OG | type/title/description/url present; **`og:image=/favicon.svg`** (relative, not share-card sized) |
| Twitter | `summary` card; title/description; **no `twitter:image`** |
| Canonical | **Absent** |
| robots meta | **Absent** |
| JSON-LD | **Absent** |
| robots.txt | **200** — `Allow: /` + Sitemap URL |
| sitemap.xml | **200** — **homepage only** |
| Manifest | HTML points at `/assets/site-B6Vv90cx.webmanifest` → **404** (serves 404 page). Built hash on main is `site-CPhDpyuj.webmanifest` |
| favicon.ico | **404**; `favicon.svg` **200** |
| resume.html | **200**; HTML resume; LinkedIn+GitHub+portfolio links; **no** SEO meta/canonical |
| Live Last-Modified | 2026-09-23 12:47 ET (aligned with tip commit) |
| Runtime patches | Inline CSS hide `agentforgestudio*`; MutationObserver + **`setInterval(400)`** text-swap / killDemo; resume href rewrite → `/resume.html`. Separate `docs/assets/hire-patch.js` also in tree |

### IA / content (origin/main `src/`)
- Sections: hero `#top` · work `#work` · labs `#labs` · habits `#habits` · skills `#skills` · path `#path` · contact `#contact`
- CTAs: Resume (`RESUME_PDF=/resume.html`, label still **“Resume PDF”**) in pill + hero + contact; email/phone/GitHub/LinkedIn in contact
- **FEATURED_PROJECTS:** log anomaly (**favorite**) · phishing · VulnTrack · Proofhouse
- **SIDE_PROJECTS:** AgentForge (GitHub only) · OFG (`https://ofg-sites.vercel.app/`) — **exported but not rendered** in `ImmersivePortfolio.tsx` (no `SIDE_PROJECTS` import); stale `p.id === 'ofg'` UI branches remain
- Decorative string **`PROMPTRIG`** still in ImmersivePortfolio; BRIEF/content use **Proofhouse**
- CoS lock reflected: Proofhouse = featured eng; OFG/AgentForge side-only; no AgentForge demo/live

### Tech / performance (source + live asset sizes)
- Vite `outDir: **docs**`; manualChunks `three` + `r3f`; `ImmersiveWorld` **lazy** + Suspense; quality presets; Lenis/GSAP gated by `prefers-reduced-motion`
- Body type floor **`1.125rem`** / `--im-fs-body` clamp ≥1.125rem
- Live transferred sizes (Content-Length): **three ≈765 KB**, **r3f ≈467 KB**, index JS ≈169 KB, CSS ≈27 KB — three+r3f still **modulepreload** in built HTML
- Google Fonts: Figtree + JetBrains Mono + Playfair + Syne + Oswald
- `site.webmanifest` copy still “Night Dossier” / Tier-1 SOC wording (stale vs hire lane)

### Gaps — short P0 / P1 (handoff)
**P0**
1. Clean rebuild of `docs/` from current content; **remove** hire-patch / killDemo / AgentForge-hide hacks
2. Real OG/Twitter image (absolute URL; `assets/og-image.svg` exists unused) + fix broken manifest href
3. Canonical + JSON-LD (`Person`/`WebSite`); expand sitemap (`/`, `/resume.html`)
4. Render **SIDE_PROJECTS** (OFG live, AgentForge GitHub only — **no** demo/Vercel studio link); drop dead `ofg` featured hacks

**P1**
5. Align labels (Resume vs “Resume PDF”; retire PromptRig chrome; refresh webmanifest copy)
6. Hero CTAs: Resume · Email · LinkedIn · GitHub above the fold
7. Trim font families; avoid eager three/r3f preload when reduced-motion / before world needed
8. Optional AppSec/GRC only via labeled academic labs

### Repo facts
- Branch: **main** @ **995211e**
- Build outDir: **`docs`** (GitHub Pages)
- Remote: `https://github.com/KM-it-ops/KM-it-ops.github.io.git`
