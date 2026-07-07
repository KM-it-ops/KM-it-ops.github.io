# mahmoud@al-kurdi:~$ insert-coin

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-live-79e8bd?style=flat-square&logo=github&labelColor=080b10)](https://km-it-ops.github.io/)
[![Built with](https://img.shields.io/badge/built%20with-HTML%20%2B%20CSS%20%2B%20vanilla%20JS-7ba7ff?style=flat-square&labelColor=080b10)](https://km-it-ops.github.io/)
[![0 deps](https://img.shields.io/badge/dependencies-0-f2b84b?style=flat-square&labelColor=080b10)](https://km-it-ops.github.io/)
[![Resume](https://img.shields.io/badge/resume-.pdf-ef6d6d?style=flat-square&labelColor=080b10)](https://km-it-ops.github.io/assets/Michael_Kurdi_Resume_2026.pdf)

Personal portfolio for **Mahmoud ("Michael") Al Kurdi** — SOC / cybersecurity analyst and security engineer. Static HTML, CSS, and vanilla JavaScript. **Zero build step, zero runtime dependencies.**

**Brand:** [Insert Coin](DESIGN.md) — a retro arcade cabinet, reimagining "evidence-led defensive security" as attract-mode, character stats, and a high-score table instead of a résumé (GitHub + LinkedIn rollout in [`docs/BRAND_ROLLOUT.md`](docs/BRAND_ROLLOUT.md)).

## Live

- Site: <https://km-it-ops.github.io/>
- PDF resume: [`assets/Michael_Kurdi_Resume_2026.pdf`](https://km-it-ops.github.io/assets/Michael_Kurdi_Resume_2026.pdf)
- Alternate design concepts: [`concepts/`](concepts/) — 10 clean-sheet directions (newspaper, brutalist, arcade, blueprint, noir, glassmorphism, industrial HMI, zine, and more) plus the previous "TRUE POSITIVE" design, all built from the same fact sheet and kept for reference.

## Current Design

The site is a single-page **retro arcade cabinet**: attract-mode hero, a player-profile "character sheet," a game-select screen for projects (with the ATT&CKLens benchmark rendered as a HIGH SCORES table), a playable bonus round, a stage-select career timeline, and a continue/contact screen — all navigated via in-page anchors, like scrolling through one cabinet rather than separate pages.

Highlights:

- Attract-mode hero with a staggered "boot" reveal, pixel typography (Press Start 2P / Silkscreen), and a role ticker.
- **Triage Rush** — a playable bonus-round mini-game: classify SOC alerts as TRUE POSITIVE (escalate) or FALSE POSITIVE (dismiss) against a shrinking timer, with lives, a streak multiplier, and a local high score.
- Project cabinets for AgentForge and the ATT&CKLens Benchmark, the latter rendered as a HIGH SCORES table (MITRE ATT&CK® is a registered trademark of The MITRE Corporation; used under MITRE's Terms of Use).
- Career playthrough (stage select) and a continue screen with direct contact channels.
- A Konami-code easter egg, because it's an arcade cabinet.
- Accessibility basics: skip link, semantic landmarks, visible focus states, keyboard-operable game and nav, `aria-live` announcements, and full `prefers-reduced-motion` support.
- SEO metadata, canonical URL, Open Graph + Twitter card, `robots.txt`, `sitemap.xml`.

`about.html`, `projects.html`, `resume.html`, and `contact.html` are thin redirect stubs into the relevant section of `index.html`, kept only so old bookmarks/links still land somewhere sensible — the real site is one page.

## Structure

| Path | Purpose |
| --- | --- |
| [`index.html`](index.html) | The site — single self-contained page, all CSS/JS inline |
| [`about.html`](about.html), [`projects.html`](projects.html), [`resume.html`](resume.html), [`contact.html`](contact.html) | Redirect stubs into `index.html#section` |
| [`404.html`](404.html) | "GAME OVER" not-found page |
| [`concepts/`](concepts/) | Gallery of 10 alternate design directions + the previous design, preserved for reference |
| [`assets/Michael_Kurdi_Resume_2026.pdf`](assets/) | Canonical PDF resume |
| [`assets/og-image.svg`](assets/og-image.svg) | Social share card |
| [`assets/css/style.css`](assets/css/style.css) | Styles for the concepts gallery page only (the live site's CSS is inline) |
| [`robots.txt`](robots.txt), [`sitemap.xml`](sitemap.xml) | SEO |
| [`site.webmanifest`](site.webmanifest) | PWA manifest |
| [`PROFILE_README.md`](PROFILE_README.md) | Source for GitHub profile README (`KM-it-ops/KM-it-ops`) |
| [`linkedin/`](linkedin/) | LinkedIn headline, About, posts, setup checklist |
| [`docs/BRAND_ROLLOUT.md`](docs/BRAND_ROLLOUT.md) | Unified brand rollout guide |
| [`docs/GITHUB_PROFILE_SETUP.md`](docs/GITHUB_PROFILE_SETUP.md) | GitHub bio, pins, profile README deploy |
| [`assets/linkedin-banner.svg`](assets/linkedin-banner.svg) | LinkedIn banner (export to PNG) |
| [`assets/profile-banner.svg`](assets/profile-banner.svg) | GitHub profile README header |

## Local Preview

Open `index.html` directly, or serve it:

```bash
python -m http.server 8000 --bind 127.0.0.1
```

## License

Copyright 2026 Mahmoud ("Michael") Al Kurdi. All rights reserved.
