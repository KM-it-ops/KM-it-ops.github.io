# Visual redesign directions — 2026-09-28

**Trigger:** Michael previewed the hire-content draft on :4175 — same visual system (3D-heavy ImmersiveWorld). He wants a **new visual system**: clean, polished, sharp, with a little oomph. Wrong vibe for hire as-is.

**Locks (unchanged):**
- Headline A for `<title>` / OG
- Featured: log anomaly → Proofhouse eng → phishing → VulnTrack
- Side: AgentForge GitHub-only; OFG live OK
- Comfortable readable UI + `prefers-reduced-motion` nonnegotiable
- **No merge / live Pages** until Michael approves a draft

**Branch for the build (after pick):** `revamp/visual-system-2026-09`  
Forked from `revamp/professional-hire-2026-09` (`40209d6`) so content/SEO stays; ImmersiveWorld / R3F shell is replaced, not polished.

---

## Direction A — Ops Brief

Recruiter-first dark “desk brief.” Typography and grid do the work; no WebGL.

- **Look:** Near-black canvas, sharp 1px borders, mono eyebrows, one cyan/teal accent (signal color). Large name + hire lane; proof as a dense card grid.
- **Motion:** Section fades / underline grows only; world canvas gone. `prefers-reduced-motion` = fully static.
- **Oomph:** Hero “status strip” (Security+ · Summa · Charlotte/Remote) and a left-rail “at a glance” column that feels like a triage brief, not a game.

## Direction B — Editorial Analyst

Magazine / studio portfolio energy — confident type hierarchy, lots of air, still serious.

- **Look:** Warm off-white or soft charcoal paper ground, deep navy/ink type, one electric accent (coral or electric blue). Display serif or sharp grotesk for name; clean sans for body (≥ readable floors).
- **Motion:** Soft scroll reveals and sticky section labels; no particles, no 3D.
- **Oomph:** Full-bleed project “spreads” (title + one-liner + proof chips) with asymmetric columns — feels designed, not template.

## Direction C — Detection Grid

Flat geometric system: SOC-adjacent without cosplay. Modular tiles + subtle signal motif.

- **Look:** Dark slate base, high-contrast white type, lime or amber “alert” accent used sparingly. SVG/CSS grid backdrop (not Three.js); cards as modules with clear primary CTA.
- **Motion:** CSS transform snaps and focus rings; reduced-motion kills all transform FX.
- **Oomph:** Interactive-feeling but 2D “detection board” hero — chips for Detection · VM · IT Risk that filter or highlight the featured set without a 3D scene.

---

## Shared IA (all three)

1. Hero — name, Headline A lane, chips, Resume · Email · LinkedIn · GitHub  
2. At a glance — want / bring / won’t claim  
3. Selected work — four featured (log anomaly lead)  
4. Also shipping — AgentForge, OFG  
5. Labs · Path · Contact  

## Decision needed

Michael / CoS pick **A, B, or C** (or hybrid: e.g. “A layout + B accent”). Heavy build starts only after that pick.
