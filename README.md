# mahmoud@al-kurdi:~$ portfolio-brief

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-live-79e8bd?style=flat-square&logo=github&labelColor=080b10)](https://km-it-ops.github.io/)
[![Built with](https://img.shields.io/badge/built%20with-HTML%20%2B%20CSS%20%2B%20vanilla%20JS-7ba7ff?style=flat-square&labelColor=080b10)](https://km-it-ops.github.io/)
[![0 deps](https://img.shields.io/badge/dependencies-0-f2b84b?style=flat-square&labelColor=080b10)](https://km-it-ops.github.io/)
[![Resume](https://img.shields.io/badge/resume-.pdf-ef6d6d?style=flat-square&labelColor=080b10)](https://km-it-ops.github.io/assets/Michael_Kurdi_Resume_2026.pdf)

Personal portfolio for **Mahmoud ("Michael") Al Kurdi** - SOC / cybersecurity analyst and security engineer. Static HTML, CSS, and vanilla JavaScript. **Zero build step, zero runtime dependencies.**

## Live

- Site: <https://km-it-ops.github.io/>
- PDF resume: [`assets/Michael_Kurdi_Resume_2026.pdf`](https://km-it-ops.github.io/assets/Michael_Kurdi_Resume_2026.pdf)
- Web resume: <https://km-it-ops.github.io/resume/>

## Current Design

The site now uses a **Case Evidence Briefing** structure: a recruiter-ready cybersecurity brief that foregrounds profile, credentials, security evidence, and repository review paths.

Highlights:

- Briefing-style hero with profile portrait, role target, location, availability, and direct CTAs.
- Evidence tiles for phishing ML, log anomaly detection, and vulnerability workflow delivery.
- Case-file project panels organized as `Problem`, `Method`, `Evidence`, and `Repo`.
- Compact stack, timeline, and contact sections tuned for fast scanning.
- Command palette for section and link navigation.
- Accessibility basics: skip link, semantic landmarks, focus states, keyboard-accessible dialog, and `prefers-reduced-motion` support.
- SEO metadata, JSON-LD `Person`, Open Graph image, Twitter card, `robots.txt`, `sitemap.xml`, and canonical URL.

## Structure

| Path | Purpose |
| --- | --- |
| [`index.html`](index.html) | Main portfolio page |
| [`styles.css`](styles.css) | Case Evidence Briefing visual system and responsive layout |
| [`script.js`](script.js) | Navigation state, scroll progress, mobile menu, and command palette |
| [`assets/profile-portrait.png`](assets/profile-portrait.png) | Profile portrait used in the hero |
| [`assets/Michael_Kurdi_Resume_2026.pdf`](assets/) | Canonical PDF resume |
| [`assets/og-image.svg`](assets/og-image.svg) | Social share card |
| [`resume/`](resume/) | Print-friendly web resume |
| [`robots.txt`](robots.txt), [`sitemap.xml`](sitemap.xml) | SEO |
| [`site.webmanifest`](site.webmanifest) | PWA manifest |
| [`PROFILE_README.md`](PROFILE_README.md) | Copy for GitHub profile README |

## Local Preview

Open `index.html` directly, or serve it:

```bash
python -m http.server 8000 --bind 127.0.0.1
```

## License

Copyright 2026 Mahmoud ("Michael") Al Kurdi. All rights reserved.
