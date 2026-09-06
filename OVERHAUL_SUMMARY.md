# Overhaul Summary - Portfolio Draft v2 / v2.1

## Aesthetic name

**Night Dossier** (v2.7) - craft push on ActiveTheory × ReactBits. Bones from Daylight Dossier inverted to night. 3D logo spotlight stays off live path.

Bones from Daylight Dossier (v2.0): stamps, case numbers, serif hero, letterhead - night palette.

## v2.1 changes (2026-09-05)

### 1. Palette - warm charcoal night (not neon SOC)

| Token | Value | Role |
| --- | --- | --- |
| Ground | #1c1917 | warm charcoal / ink |
| Deep | #141210 | tags, copy ground |
| Card | #292524 | warm panels |
| Ink | #f5f0e8 ivory | body + display |
| Soft | #a8a29e | secondary |
| Rule | #3f3a36 | borders |
| Links | #9aabcf muted indigo | hireable |
| Accent | #c45d2c terracotta | scarce stamps |

Mood: dim lamp on paper at night - not emerald SOC, not daylight ivory.

### 2. Logo - A+B hex-seal blend

- Hex shield primary + seal energy: terracotta outer hex, indigo inner hex, dashed terracotta seal ring, geometric KM, wax tick
- Header KmMark in DaylightDossier.tsx uses same 64×64 geometry as favicon
- public/favicon.svg + apple-touch-icon.svg + public/logos/km-hex-seal.svg
- site.webmanifest theme #1c1917
- Not plain monogram-only, not terminal favicon

### 3. Tasteful motion

| Motion | Behavior |
| --- | --- |
| Hero entrance | staggered fade-up |
| Section Reveal | GSAP scroll fade (shared.tsx) |
| Project cards | Reveal stagger + hover lift |
| Link underline | scaleX expand on hover |
| Hero stamp | settle rotate on load |
| Margin line | vertical draw-in |
| Reduced motion | CSS + GSAP + Lenis respect prefers-reduced-motion |

No circus / no endless flashing.

### 4. Content (unchanged)

- Featured: PromptRig / AgentForge / OFG
- Sec+ + SNHU Summa 3.96
- Transferables-only experience

## Build / preview

- Build: exit 0
- Preview: http://127.0.0.1:4174/
- No git push / deploy
- v1 portfolio-draft untouched

## Blockers

None.

## A+B hex-seal blend install (2026-09-05)

- Replaced header `KmMark` in `DaylightDossier.tsx` with 64×64 hex-seal geometry matching `public/favicon.svg` / `apple-touch-icon.svg`: terracotta outer hex, indigo inner hex, dashed seal ring, geometric KM, wax dot.
- Full badge asset: `public/logos/km-hex-seal.svg`; isolation HTML: `logo-preview/blend-hex-seal.html` (serve on :4175).
- Supersedes prior interlocking monogram + underline tick for the live header mark.
- Build exit 0; preview http://127.0.0.1:4174/; no git push.

## v2.2 — clean badge + landscape density (2026-09-05)

### Badge
- Replaced A+B hex-seal (dashed ring, wax dot, nested rings, "KM · SEAL") with a **clean hex KM mark**: subtle terracotta hex silhouette, ivory interlocking KM letterforms, **one** terracotta accent stroke.
- Updated in sync: `KmMark` in `DaylightDossier.tsx`, `public/favicon.svg`, `public/apple-touch-icon.svg`, `public/logos/km-hex-seal.svg`.
- Sized for ~36px header and favicon readability.

### Layout (landscape-first)
- Content shell max-width **1240px**; tightened section/card/hero padding.
- Hero ≥1100px: **2-column fold** (name/role/CTAs left · credentials + hire box right).
- Featured projects pulled closer; reduced card padding; 3-up grid kept.
- Labs + operating habits combined into a **2-col band**.
- Skills as compact **chips**; experience as **3-up horizontal** compact cards.
- Softened ruled-paper: removed horizontal line grid; faint vertical margin only.
- Night palette unchanged (warm charcoal / ivory / scarce terracotta).

### Build / preview
- Build: exit 0
- Preview: http://127.0.0.1:4174/ (PID 202670 / node 202754)
- No git push; `portfolio-draft` untouched

## v2.3 — CoS audit fixes (2026-09-05)

Harsh Chief of Staff audit applied to Night Dossier. Sharp night portfolio, not classified-file cosplay.

### Must-fix
1. **Duplicate above-fold copy killed** — Hire Brief is 3 bullets (Want / Bring / Won't fake), not a repeat of the hero lede.
2. **DOSSIER OPEN stamp retired** — removed from header (CSS stamp display:none). FILE / LOCALE / STATUS metadata kept.
3. **Lead with proof** — PromptRig + AgentForge reframed as detection/automation proof; OFG demoted visually/copy as smaller shipped client delivery.
4. **Section 05 / lower asymmetry** — skill bands equal-height 3-up cards; labs as 3-up case grid; habits merged into one How I work strip (no orphan gutter).
5. **Hero jargon toned down** — seeking line uses triage / documentation under pressure / automation that does not invent signals (no PromptOps slang).
6. **One primary CTA** — Résumé button primary; Contact + GitHub demoted to text links. Nav Resume CTA unchanged.

### Should-fix
- Eyebrow → `Portfolio · Michael Kurdi`
- Removed Favorite tag + ★ FAVORITE double-label (fav border accent kept)
- Habit cards → single How I work strip under labs
- Legal name quieter than role line (smaller, muted, under role)
- Untouched: no-fake-SIEM honesty, Sec+/Summa/GPA/AA framing, clean hex KM, PromptRig+AgentForge featured, landscape density intent

### Build / preview
- Build: exit 0
- Preview: http://127.0.0.1:4174/
- No git push; `portfolio-draft` untouched

## v2.4 — 3D center-stage logo spotlight (2026-09-05)

Michael ask: subtle 3D center-stage spotlight of the logo as background — pizzazz without stealing the structured Night Dossier UI.

### Approach
- New `src/LogoSpotlight.tsx` (lazy wrapper) + `src/LogoSpotlightScene.tsx` (R3F scene)
- **Extruded clean hex KM** (favicon geometry) — NOT dashed-ring seal, NOT old iridescent `HeroScene`
- Lighting: soft indigo ambient/fill + ivory key spotlight + scarce terracotta rim
- Slow Float + gentle Y rotation; `frameloop` pauses when offscreen or tab hidden
- Scroll opacity dims past upper fold; CSS radial mask keeps it behind hero
- `prefers-reduced-motion`: static favicon poster (opacity-only), no canvas
- Wired as fixed `pointer-events: none` layer under main in `DaylightDossier.tsx`
- Cards/cred/hire panels stay opaque for contrast
- CoS v2.3 content fixes untouched; no git push

### Build / preview
- Build: exit 0 (LogoSpotlightScene code-split chunk)
- Preview: http://127.0.0.1:4174/
- No git push; `portfolio-draft` untouched

## v2.5 — ActiveTheory × ReactBits craft pass (2026-09-05)

Michael priority: **tweak the 3D spotlight before PR** — local only.

### #1 Spotlight stage (`LogoSpotlight` / `LogoSpotlightScene`)
- **Sculptural clean hex KM** — larger scale, deeper extrude + bevels, stronger ivory/terracotta emissive materials
- **Volumetric atmosphere** — FogExp2 room fog + soft additive fog slabs + denser particle field (~680) biased around the mark; soft floor disc + light pool (stage, not void)
- **Lighting** — tighter stronger ivory key + secondary front fill + terracotta rim; **pointer-reactive** point fill + key/rim drift (smooth, intensity capped so UI text is not washed)
- **Scroll** — quadratic opacity settle + group Y/Z/scale parallax + slight camera ease; CSS veil side-gradients protect hero copy
- **Bloom** via `@react-three/postprocessing` (subtle, luminance-thresholded)
- Lazy chunk + pause when scrolled past / tab hidden; reduced-motion → static favicon poster

### Secondary UI craft (kept lean)
- Hero **split/blur** name reveal (`SplitName` + GSAP)
- **Magnetic** primary Resume CTA
- Project **spotlight-follow** cards
- Sharper type scale; frosted/opaque panels over the 3D stage
- Reveal sections: slight blur→clear settle

### Deps
- Added: `@react-three/postprocessing` (bloom)
- Not added: `motion` (GSAP already owns motion)

### CoS v2.3 retained
No DOSSIER OPEN; 3-bullet hire brief; one primary Resume CTA; SOC-plain hero; PromptRig+AgentForge lead / OFG smaller; How I work strip; no-fake-SIEM honesty; clean hex KM.

### Build / preview
- Build: exit 0
- Preview: http://127.0.0.1:4174/
- No git push / PR; `portfolio-draft` untouched

## v2.6 — ActiveTheory × ReactBits (spotlight deprioritized) (2026-09-05)

Michael: STOP obsessing over the 3D logo spotlight. Elevate using Active Theory + React Bits properly.

### Removed / simplified
- **Live path no longer mounts** `LogoSpotlight` / extruded hex KM WebGL stage (files retained unused; MashDesign still has separate `HeroScene`)
- `@react-three/*` / Three.js **not loaded** on the DaylightDossier path (tree-shaken out of production bundle)
- Logo is **header mark + favicon only** (clean 2D hex KM)

### Atmosphere (Active Theory energy)
- New `src/Atmosphere.tsx`: **WebGL aurora silk** (fbm bands in night indigo + scarce terracotta) + **canvas particle field**
- Pointer-reactive subtle drift; scroll-coupled opacity settle; pause when tab hidden
- CSS veil + grain + margin rule; reduced-motion → static CSS aurora poster (no canvas)
- Full-page environment feel without drowning hireable copy; frosted panels over stage

### React Bits–style UI craft
- Kept: `SplitName` (split/blur hero), `MagneticCTA`, `SpotlightCard` (pointer spotlight-follow)
- Added: `BlurText` word-level blur reveals on section titles (GSAP + ScrollTrigger)
- Staggered hero entrance + section Reveal blur→clear retained
- Stack: TS + CSS + GSAP (no `motion` dep)

### CoS / content retained
Hire brief 3 bullets; one primary Resume CTA; SOC-plain hero; PromptRig + AgentForge lead / OFG smaller shipped; How I work strip; no-fake-SIEM; Sec+/Summa/GPA/AA; landscape density; no DOSSIER OPEN.

### Deps
- No new packages. Live path uses existing `gsap` + `lenis` + raw WebGL/canvas.
- Three / R3F / postprocessing remain in package.json for unused Mash / LogoSpotlight lab files only.

### Build / preview
- Build: exit 0
- Preview: http://127.0.0.1:4174/
- No git push / PR; local only

## v2.7 — craft push (2026-09-05)

Michael: v2.6 direction right — push ActiveTheory/ReactBits craft further. Local only.

### Atmosphere (Active Theory)
- Richer aurora silk: 6-octave fbm, depth layers (band / ribbon / silk), higher contrast indigo↔terracotta
- Scroll-scrubbed color shift (indigo-forward → warmer wash)
- Stronger pointer parallax (shader + particle attraction); snappier ptr lerp
- Soft light shafts + CSS vignette + engineered grain; veil side/bottom protection kept
- Particles ~92 (indigo + scarce warm), denser but elegant
- Frosted/opaque panels strengthened for readability
- Reduced-motion: static CSS poster (no canvas)

### React Bits–grade craft
- Hero `SplitName`: brief scramble-on-enter → blur settle + ivory/indigo/warm **gradient text**
- `BlurText` snappier stagger + letter-spacing settle on section titles
- `MagneticCTA`: stronger pull radius/scale + shine sweep
- Project `SpotlightCard`: richer spotlight-follow + **conic border beam / glow trail**
- Scroll: snappier `Reveal` (power4, shorter duration, tighter start)
- Extra patterns: **skills infinite marquee** + **CountUp** for 3.96 GPA and 8 yrs ops

### Layout polish
- Slightly tighter shell (1220), section/hero padding, product-site rhythm
- Landscape 2-col fold retained; denser vertical spacing

### CoS / content retained
Hire brief 3 bullets; Resume primary CTA; SOC-plain hero; PromptRig+AgentForge lead / OFG smaller; How I work; no stamp; no-fake-SIEM; hex KM header only. No 3D logo spotlight.

### Deps
- No new packages (GSAP + Lenis + raw WebGL/canvas only on live path)

### Build / preview
- Build: exit 0
- Preview: http://127.0.0.1:4174/
- No git push / PR; local only

## v2.8 — Immersive craft (ActiveTheory×ReactBits, non-bland) (2026-09-05)

Hard push after AT inspiration frames (at-01…at-05). Not a frosted résumé over mild aurora.

### Primary experience
- `ImmersivePortfolio` + `ImmersiveWorld` (R3F) from `App.tsx`
- Oversized glass/chrome torus + KM bars + filament loops; MeshPhysical transmission/iridescence; bloom + chromatic aberration + vignette
- Layered: abyss shader + gold micro dust + large blue bokeh + translucent silhouettes + cursor ribbons
- Scroll-coupled camera travel + velocity FOV punch; continuous drift; pause when hidden
- Montage work moments (PromptRig lead oversized, AgentForge mid, OFG side) — not equal boxes
- Oswald condensed all-caps atmospheric UI; designed reduced-motion poster scene
- CoS facts unchanged from content.ts

### Preview
- Build exit 0 · http://127.0.0.1:4174/ · local only

## v2.9 — push even harder (ceiling demo) (2026-09-05)

Michael liked **v2.8 immersive craft** and asked what we’re capable of if he says “push even harder.” This is the **max-craft ceiling demo** — still a hireable SOC portfolio (readable CTAs/proof, CoS facts intact).

### Dialed beyond v2.8
1. **World materials** — higher transmission/iridescence/clearcoat; inner spectral glass disc; stronger multi-point lights
2. **Filament orbits** — 4 animated orbital loops (chrome/terracotta/cyan) under the emblem
3. **Particles / bokeh** — ~2200 gold micro-dust + ~900 cyan dust layer; 42 mixed-color bokeh orbs with velocity scale
4. **Anamorphic flares** — abyss shader dual streaks + gold shaft; flare width/intensity tied to scroll velocity; CSS HUD vel-flare overlay
5. **Post** — bloom up, CA offset reacts to velocity, deeper vignette, subtle Noise overlay
6. **Cursor** — 96-point triple ribbons (cyan/gold/terra + light tube) with age-based linger/fade; stronger emblem pointer parallax
7. **Scroll cinema** — keyed camera beats at ~0 / 0.18 / 0.42 / 0.72 (hero → work → labs → contact); FOV/dolly punch on velocity
8. **Typography** — longer scramble, heavier pressure radius/scale, snappier glitch; section titles = BlurText + TextPressure moments
9. **Work montage** — perspective depth-sort, lead/mid/side Z-scale, hover punch (still asymmetric, not equal grid)
10. **HUD** — stronger pill velocity morph + glow; magnetic Resume in nav; rotating beam cards on cred/hire/labs/path/contact
11. **Soundless rhythm** — smoother velocity decay, Lenis lerp 0.075, `data-beat` UI accents
12. **Reduced-motion** — richer still poster (dual flare + dual filament), WebGL off

### Unchanged (don’t break)
- CoS content facts from `content.ts` (Resume primary, hire bullets, no SIEM lies, PromptRig/AgentForge lead / OFG side)
- Pause WebGL when tab/hidden; local only — no push/PR

### Preview
- Build exit 0 · http://127.0.0.1:4174/ · local only

## v2.9.1 — ceiling + performance (2026-09-05)

Michael chose **v2.9 ceiling** energy with performance optimization (not a visual gut).

### Adaptive quality
- Presets `high` | `medium` | `low` in `src/worldQuality.ts`
- Initial: `saveData` / low `deviceMemory` → low; coarse pointer / narrow / ≤4 cores → medium; else high
- Runtime FPS monitor: drops DPR, soft-disables CA/Noise, scales bloom; sustained pain steps preset down (never above device ceiling)
- Subtle HUD: `GFX · HIGH|MEDIUM|LOW` (hidden on small screens)

### Budgets (approx before → after @ high)
| Item | v2.9 | v2.9.1 high | medium | low |
| --- | --- | --- | --- | --- |
| Gold particles | 2200 | 1480 | 980 | 620 |
| Cyan dust | 900 | 580 | 380 | 220 |
| Bokeh orbs | 42 | 28 | 18 | 10 |
| Ribbon points | 96 | 64 | 42 | 28 |
| DPR cap | 1.5 | 1.75 (adaptive) | 1.25 | 1.0 |
| Post | Bloom+CA+Vig+Noise | Bloom+CA+Vig+Noise | Bloom+Vig | Bloom+Vig lean |
| Point lights | 4 | 3 | 2 | 1 |
| Environment | night | night | night weaker | off |

### Bundle (vite build)
- **Before (v2.9):** single `index` ~**1418 kB** (gzip ~411)
- **After (v2.9.1):**
  - `index` ~**167 kB** (gzip ~62) — HUD/CSS path; first paint
  - `ImmersiveWorld` ~**21 kB** async
  - `r3f` ~**467 kB** async
  - `three` ~**765 kB** async
- Canvas deferred one rAF; `powerPreference: high-performance`; antialias off below high

### Files
- `src/worldQuality.ts` (new)
- `src/ImmersiveWorld.tsx` (perf pass)
- `src/ImmersivePortfolio.tsx` (lazy world + quality chip)
- `vite.config.ts` (manualChunks three/r3f)
- `src/immersive-portfolio.css` (`.im-quality`)

CoS content rules unchanged. No git push / PR.

## v2.9.2 — readable type + viewport floors (2026-09-05)

Michael: fonts render too small — **nonnegotiable** for this and future sites: comfortably readable body/UI across mobile/tablet/PC; reduced-motion must pass; never ship fashion-tiny reading text.

### Type floors (`immersive-portfolio.css` + `index.css` root)
| Role | Before (approx) | After |
| --- | --- | --- |
| Body / lede / card copy | ~0.9–1.05rem | **1.125–1.25rem** (`--im-fs-body` / `--im-fs-lede`; mobile prefers 1.1875–1.25rem) |
| Nav / buttons / CTAs | ~0.78–0.9rem | **≥ 0.95–1rem**; min-height ~44px touch |
| Meta / chips / captions | ~0.58–0.72rem | **≥ 0.8125rem** (`--im-fs-meta`) |
| Eyebrows uppercase | ~0.68–0.72rem + extreme tracking | **≥ 0.75–0.8125rem**; letter-spacing eased |
| GFX quality chip | 0.58rem | **≥ 0.7rem** |

Responsive token overrides at **1024 / 768 / 640** so clamps never sink under floors. Reduced-motion (`.im-reduced` + poster caption) inherits the same floors. Cinematic craft unchanged. Local only — no push/PR.

## v2.9.3 — emblem craft (2026-09-05)

Michael: site is smooth (keep perf) but 3D logo fails craft — letters muddy/illegible, asymmetric, motion fights readability.

### HeroEmblem (`ImmersiveWorld.tsx`)
- **Geometry:** Replaced crude `boxGeometry` sticks with **ExtrudeGeometry** KM from `km-hex-seal.svg` path spirit — interlocking K + M + terra accent bar, **bbox-centered at origin**.
- **Materials:** Letter faces dense (no transmission) + cool indigo/white emissive; outer glass torus + lens **lower opacity / higher transmission** so they frame instead of bury; accent keeps terracotta glow.
- **Symmetry:** Removed vertical meridian torus; equatorial + inner chrome rings coaxial; filament orbit offsets stacked on axis (no x/z drift); softer concentric spin.
- **Motion:** Idle Y ≈ 0.10 + soft float; damped pointer parallax; glyph group **counter-rotates** toward camera; Float wrapper dialed down; scroll recession unchanged.
- Poster `.im-poster-km` contrast bump only. Type floors from v2.9.2 kept. Local only — no push/PR.

## v2.9.4 — smooth scroll (nav stretch, no monogram nova)

Michael liked PillNav stretch on scroll but monogram nova/burst every few lines felt jarring.

Kept: PillNav `stretch`/`squash`, emblem depth recession on scroll progress, v2.9.3 emblem geometry + type floors + perf floors.

Removed / softened:
- `.im-vel-flare` CSS + DOM (bright horizontal flare)
- HeroEmblem velocity `punch` scale (constant scale + idle float only)
- ScrollCamera FOV/z velocity punch
- Abyss shader `uVel` flare gain heavily reduced
- Ribbons / particles / bokeh / CA use filtered `worldVelocity` with low gain

Split: `ptr.velocity` (lively UI) vs `ptr.worldVelocity` (heavy filter × 0.35 gain) so nav stays lively while the 3D world stays cinematic-smooth.
