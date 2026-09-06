# Portfolio Draft v2 - Status

Aesthetic: **v2.9.5 — ship: faster nav snap-back + link/compat + go-live**
Baseline liked: **v2.8 — Immersive craft** / ceiling look from **v2.9** / perf from **v2.9.1** / type floors from **v2.9.2** / emblem from **v2.9.3**
Preview: http://127.0.0.1:4174/
Work root: portfolio-draft-v2 only
No push / no PR

## Checks
- Build exit 0 (`tsc --noEmit` + `vite build`)
- Preview HTTP 200 on :4174
- Full-bleed R3F world PRIMARY — cinematic look retained (glass emblem, particles, ribbons, bloom, montage)
- Adaptive quality presets: `high` | `medium` | `low` (device heuristics + FPS dial-down)
- Adaptive DPR (cap 1–1.75; drops on low FPS)
- Particle budgets cut ~32–40% vs v2.9; density via size/opacity
- Post leaner: bloom tuned; CA/Noise off on medium/low or low FPS; vignette kept
- Ribbons shorter; third tube trail high-only
- Visibility: page hide + IntersectionObserver + ResizeObserver → `frameloop: never`
- Bundle: ImmersiveWorld lazy; three/r3f async chunks
- Subtle GFX quality chip (desktop only; ≥ 0.7rem)
- Reduced-motion: designed still scene (same type floors as motion path)
- CoS content retained from content.ts; hex KM 2D in HUD
- **v2.9.2:** body/UI type floors; kill fashion-tiny meta; mobile clamps ≥ floors; ~44px touch CTAs
- **v2.9.3:** HeroEmblem rebuilt — extruded readable KM, material split (dense letters / transparent shell), coaxial rings, polished idle + damped parallax; type floors untouched
- **v2.9.4:** Keep PillNav velocity stretch; kill monogram nova — remove `.im-vel-flare`, emblem/camera velocity punches; split `velocity` (UI) vs `worldVelocity` (filtered); damp abyss `uVel`, ribbons, particles
