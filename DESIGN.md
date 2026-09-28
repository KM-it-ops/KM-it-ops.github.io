# DESIGN — Noir Spotlight + Orb Seal

**Lane:** hire-first personal site · Junior Security Analyst / SecOps / IT Risk  
**Live (draft branch):** PR #12 · preview `npx vite preview --port 4176`  
**Content SoT:** [`content/BRIEF.md`](content/BRIEF.md) · [`src/content.ts`](src/content.ts)

## Direction

Dark cinematic shell with gold accents and italic/serif display. Signature asset: **Orb Seal** (CSS/SVG only — no R3F). Hero Orb is large, then snaps into the sticky nav on scroll. `prefers-reduced-motion` = snap (no half-morph transitions).

## Hierarchy (above the fold)

1. Available eyebrow  
2. **Mahmoud Al Kurdi** + muted `(Michael Kurdi)`  
3. **Junior Security Analyst** role (ink, strong 700) — wins the eye over name size  
4. **Proof strip** — log anomaly detection, cloneable, View repo →  
5. Seeking line + CTAs (Resume gold-fill primary; Email secondary ghost; LinkedIn/GitHub tertiary)  
6. Cred chips including **8 yrs AA · not SIEM**  

Hire glance (want / bring / won’t) sits **below the fold**, after selected work.

## Featured order

Log anomaly (lead) → phishing → VulnTrack. Proofhouse lives under Also shipping (SIDE_PROJECTS).

## Tokens

```css
--noir-bg: #050505;
--noir-ink: #f4efe6;
--noir-muted: #9a9388;
--noir-gold: #d4af37;
--noir-serif: "Playfair Display";
--noir-mono: "JetBrains Mono";
--noir-sans: "Figtree";
--noir-body: 17px; /* readable floor */
--noir-ui-min: 15px;
```

## Nav / SEO

- Brand: **Mahmoud Al Kurdi** (xs: **M. Al Kurdi**) — not MK / Portfolio  
- Title / OG / Twitter / JSON-LD Person: Mahmoud-primary, Michael as alternateName / paren  

## Deploy

- Vite `base: '/'`, `build.outDir: 'docs'`
- Gate: `npm run build` → `npx vite preview --port 4176` before push  
- **Do not merge to `main` / GitHub Pages until signed off**
