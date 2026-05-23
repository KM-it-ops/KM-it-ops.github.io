---
version: alpha
name: Masked Signal
description: "AI security console aesthetic for a detection-engineering portfolio: dark operational surfaces, red alert energy, mint signal accents, and precise terminal typography."
colors:
  primary: "#04060A"
  secondary: "#C8D0E0"
  tertiary: "#FF5E6E"
  neutral: "#EEF3FB"
  surface: "#0A0D16"
  surface-elevated: "#0E1220"
  muted: "#8A93A8"
  subdued: "#5A6478"
  signal: "#7CF0C1"
  info: "#6FB3FF"
  violet: "#B07CFF"
  warning: "#FFB547"
  success: "#6DDF9F"
  ink: "#080607"
  on-primary: "#EEF3FB"
  on-surface: "#EEF3FB"
  on-tertiary: "#080607"
  on-signal: "#04060A"
typography:
  display:
    fontFamily: Space Grotesk
    fontSize: 4rem
    fontWeight: 700
    lineHeight: 0.92
    letterSpacing: "-0.045em"
  h1:
    fontFamily: Space Grotesk
    fontSize: 3rem
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.035em"
  h2:
    fontFamily: Space Grotesk
    fontSize: 1.75rem
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: Inter
    fontSize: 0.92rem
    fontWeight: 400
    lineHeight: 1.55
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 0.75rem
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.08em"
  mono:
    fontFamily: JetBrains Mono
    fontSize: 0.88rem
    fontWeight: 500
    lineHeight: 1.5
rounded:
  sm: 4px
  md: 8px
  lg: 14px
  xl: 20px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  section: 88px
components:
  button-primary:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.on-signal}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.sm}"
    padding: 12px
  button-primary-hover:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.ink}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.neutral}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.sm}"
    padding: 12px
  button-secondary-hover:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-tertiary}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: 24px
  card-elevated:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: 24px
  badge-signal:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.on-signal}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.full}"
    padding: 8px
  badge-alert:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-tertiary}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.full}"
    padding: 8px
  page-shell:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
  body-copy:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.secondary}"
    typography: "{typography.body-md}"
  meta-label:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.muted}"
    typography: "{typography.label-caps}"
  disabled-label:
    backgroundColor: "{colors.subdued}"
    textColor: "{colors.neutral}"
    typography: "{typography.body-sm}"
  badge-info:
    backgroundColor: "{colors.info}"
    textColor: "{colors.ink}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.full}"
    padding: 8px
  badge-violet:
    backgroundColor: "{colors.violet}"
    textColor: "{colors.ink}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.full}"
    padding: 8px
  badge-warning:
    backgroundColor: "{colors.warning}"
    textColor: "{colors.ink}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.full}"
    padding: 8px
  badge-success:
    backgroundColor: "{colors.success}"
    textColor: "{colors.ink}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.full}"
    padding: 8px
---

## Overview

Masked Signal is an AI-security portfolio identity built like a low-light operations console. It should feel precise, technical, and evidence-led: a detection-engineering HUD with enough atmosphere to be memorable, but never so much motion or texture that it competes with the proof of work.

The design voice is confident and restrained. Red carries alert energy and brand personality; mint carries live-signal/verified-system states. Dark negative space is the primary layout material, with panels and terminal labels emerging from the background rather than sitting on a bright marketing canvas.

## Colors

- **Primary ({colors.primary}):** Deep operational black for the page canvas and deepest chrome.
- **Surface ({colors.surface}):** Default card and console-panel fill.
- **Surface Elevated ({colors.surface-elevated}):** Higher emphasis modules, hero panels, and dense technical cards.
- **Neutral ({colors.neutral}):** Primary readable text on dark surfaces.
- **Secondary ({colors.secondary}):** Body text and supporting copy.
- **Muted ({colors.muted}):** Metadata, secondary labels, and subdued descriptions.
- **Tertiary ({colors.tertiary}):** Alert red for section numbers, emphasis strokes, active states, and the Masked Signal identity.
- **Signal ({colors.signal}):** Mint live-signal accent for positive status, focus rings, verified proof points, and primary CTAs.
- **Info / Violet / Warning / Success:** Secondary semantic accents for tags, status chips, and data categories only.

## Typography

Use **Space Grotesk** for display and section headings to create compressed, engineered presence. Use **Inter** for body copy because the page has dense evidence and needs long-form readability. Use **JetBrains Mono** for system labels, terminal copy, metrics, command text, and small uppercase HUD labels.

Display type should be tight and assertive. Body text should be calm and generous. Monospace labels should be uppercase or command-like, but kept short so the interface does not become visually overwhelming.

## Layout

The layout uses a max-width console container around 1280px with large vertical section rhythm. Use 16px and 24px spacing inside cards; use 48px and 88px spacing between content groups and sections.

Keep high-density technical elements grouped in panels. Avoid scattering too many small badges across the page. Long scroll sections should get breathing room and subtle variation through layout, not through additional colors or busy background effects.

## Elevation & Depth

Depth comes from dark-surface luminance steps, thin borders, and restrained glow. Prefer subtle panel fills and hairline borders over heavy shadows. Red and mint glows should be atmospheric and low-opacity, used behind or around content rather than directly behind small text.

Motion should be lightweight: transform-only scroll parallax, cursor companion states, and small hover transitions. Avoid expensive blur/filter animation, large moving SVGs, or continuous repaint effects.

## Shapes

Use sharp-to-modest radii. Buttons and terminal controls use `sm`; cards and HUD panels use `lg`; pills and status tags use `full`. The identity is technical and operational, so avoid overly soft consumer-app rounding.

## Components

- `button-primary` is for the strongest action on a view: resume, contact, or primary proof link.
- `button-secondary` is for GitHub, LinkedIn, README, and supporting navigation actions.
- `card` is the default portfolio evidence container.
- `card-elevated` is reserved for hero identity, dense dashboards, or standout case files.
- `badge-signal` communicates verified/active/available states.
- `badge-alert` communicates brand emphasis, not destructive action.

## Do's and Don'ts

- **Do** keep the background atmospheric, dark, and low-noise.
- **Do** reserve mint for live/verified/interactive moments.
- **Do** use red as the signature identity accent, not as body-copy decoration.
- **Do** protect legibility with dark panels behind dense text.
- **Don't** animate blur, filters, or large SVG paths during scroll.
- **Don't** add new colors without extending the token palette first.
- **Don't** use tiny red text for critical information without checking contrast.
- **Don't** let the HUD concept overpower the evidence; proof of work stays primary.
