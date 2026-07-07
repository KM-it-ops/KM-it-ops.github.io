---
version: alpha
name: Insert Coin
description: "Retro arcade cabinet aesthetic for a detection-engineering portfolio: deep-space navy, saturated pixel-arcade accents, and pixel/mono typography. The résumé as attract mode, character stats, and a high-score table."
colors:
  ink: "#05071c"
  navy: "#0c1136"
  navy-elevated: "#141b4d"
  line: "#2b3595"
  white: "#f5f7ff"
  body: "#c7d0ff"
  dim: "#8b96d8"
  yellow: "#ffd23f"
  gold-dark: "#8a5a00"
  pink: "#ff2e88"
  pink-dark: "#8f0f47"
  cyan: "#2de2ff"
  cyan-dark: "#0d6f80"
  lime: "#5dfc63"
  orange: "#ff8a2b"
  purple: "#8c6bff"
  red: "#ff4242"
typography:
  display:
    fontFamily: "Press Start 2P"
    note: "Pixel display face — hero title, section headings, HUD score digits. Used sparingly at small sizes; it is wide and slow to read at length."
  label:
    fontFamily: Silkscreen
    fontWeight: 700
    note: "UI labels, nav, buttons, chips, kickers — the workhorse face for anything short and uppercase."
  body:
    fontFamily: "IBM Plex Mono"
    note: "Body copy, alert/bio text — needs to stay readable at paragraph length, unlike the two pixel faces."
spacing:
  section: 96px
  panel: "26px 28px 30px"
components:
  win-panel:
    description: "The recurring 'pixel window' card — colored 6px pixel border via box-shadow, colored title bar, dark navy body. Used for every card: player profile, skills, project cabinets, career stages, high-score table."
    borderColors: [yellow, pink, cyan, lime, purple, orange]
  btn:
    description: "Chunky pixel button — solid fill, inset bevel via box-shadow (light top-left, dark bottom-right), hard drop shadow that shrinks on :active to simulate a physical press."
  hud:
    description: "Sticky header scoreboard (1UP score / HI-SCORE / CREDITS) plus a rainbow repeating-gradient divider strip, reused between every section as a visual anchor."
---

## Overview

Insert Coin reimagines the "evidence-led defensive security" brief as a genuine arcade cabinet rather than a
terminal or a resume page. The hero is an attract-mode title screen; the About section is a player-profile
character sheet; Projects is a game-select screen where the ATT&CKLens benchmark renders as a HIGH SCORES
table; there's a playable bonus round (Triage Rush); Résumé is a stage-select career playthrough; Contact is
a continue screen. The whole site is one scrolling page — cabinets don't have a nav bar to a different game,
they have scenes.

The tone is playful but the claims underneath are not: every stat, credential, and score on the page maps to
a real document, credential, or public repository. The arcade framing is a delivery mechanism for facts, not
a substitute for them.

## Colors

Deep-space navy (`ink`, `navy`, `navy-elevated`) is the base — never pure black, always with a faint blue
cast. Six saturated accents (`yellow`, `pink`, `cyan`, `lime`, `purple`, `orange`) rotate across panel borders
so no two adjacent cards look identical, the way cartridge boxes on a shelf don't match. `red` is reserved
for the Triage Rush "escalate" action and alarm states — it's the only color tied to a specific meaning
rather than rotating decoratively.

## Typography

Three faces, three jobs, deliberately not interchangeable: **Press Start 2P** for anything that should feel
like a title screen (used small and sparingly — it's wide and slow to read at paragraph length); **Silkscreen**
for every UI label, button, and nav item (bold, uppercase, short); **IBM Plex Mono** for anything a recruiter
actually has to read start to finish (bio paragraphs, alert text in the mini-game).

## Layout & Motion

Single page, six scenes (`#start`, `#player`, `#games`, `#bonus`, `#stages`, `#continue`), connected by
in-page anchors and a sticky HUD nav that highlights the current scene via `IntersectionObserver`. The one
orchestrated load animation is the attract-mode hero's staggered "slam" reveal; everything else is a quick
scroll-triggered reveal. `prefers-reduced-motion` disables all of it — content lands instantly, the game's
timer tick slows and stops animating decoratively (it stays functional).

## Do's and Don'ts

- **Do** keep the six accent colors rotating across panels — sameness reads as a template, not a cabinet.
- **Do** keep Press Start 2P short — a sentence of it is a design smell, not a feature.
- **Do** keep every number on the page traceable to a real source (credential, repo, benchmark result).
- **Don't** add a "serious mode" toggle or apologize for the concept — commit to it.
- **Don't** let Triage Rush (or any future mini-game) block access to real content; always provide a skip link.
- **Don't** reintroduce a shared CSS token file across pages — this design is intentionally one
  self-contained file; see `concepts/` for the alternate, token-driven "TRUE POSITIVE" design if that
  system is ever needed again.
