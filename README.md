# michael@kurdi:~$ whoami

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-live-7cf0c1?style=flat-square&logo=github&labelColor=05070c)](https://km-it-ops.github.io/)
[![Built with](https://img.shields.io/badge/built%20with-HTML%20%2B%20CSS%20%2B%20vanilla%20JS-7aa2ff?style=flat-square&labelColor=05070c)](https://km-it-ops.github.io/)
[![0 deps](https://img.shields.io/badge/dependencies-0-b07cff?style=flat-square&labelColor=05070c)](https://km-it-ops.github.io/)
[![Resume](https://img.shields.io/badge/resume-.pdf-ffb547?style=flat-square&labelColor=05070c)](https://km-it-ops.github.io/assets/Michael_Kurdi_Resume_2026.pdf)

Personal portfolio for **Mahmoud ("Michael") Al Kurdi** — AI Systems Architect building ML-driven security automation. Static HTML, CSS, and vanilla JavaScript. **Zero build step, zero runtime dependencies.**

## Live

- Site · <https://km-it-ops.github.io/>
- PDF résumé · [`assets/Michael_Kurdi_Resume_2026.pdf`](https://km-it-ops.github.io/assets/Michael_Kurdi_Resume_2026.pdf)
- Web résumé (print-friendly) · <https://km-it-ops.github.io/resume/>

## Features

- **Developer-first UI** — terminal prompt hero, JetBrains Mono + Space Grotesk typography, grid background, violet/mint gradients.
- **Command palette** (`⌘K` / `Ctrl+K` / `/`) — fuzzy search every section, project, and contact link.
- **Interactive terminal** — real REPL with `help`, `about`, `projects`, `skills`, `contact`, `open`, `goto`, `theme`, `matrix`, `sudo hire-me`, arrow-key history, and `Ctrl+L` clear.
- **Live typing + particle constellation** on the hero, paused when off-screen for battery friendliness.
- **Git-log style career timeline** with SHA-style ids and tags.
- **Tech stack panel** with proficiency bars + searchable keyword chips.
- **Scroll progress bar**, active-section nav highlight, glass-morphism navbar.
- **Konami code** → confetti. Console art + contact info on page load.
- **Accessibility** — skip link, keyboard navigation, `prefers-reduced-motion` respect, semantic landmarks, ARIA labels.
- **SEO** — JSON-LD `Person`, Open Graph image, Twitter card, `robots.txt`, `sitemap.xml`, canonical URL.

## Shortcuts

| Keys              | Action                           |
|-------------------|----------------------------------|
| `⌘K` / `Ctrl+K`  | Open command palette             |
| `/`               | Open command palette             |
| `↑` / `↓`         | Navigate palette / terminal hist |
| `Enter`           | Run selected command             |
| `Esc`             | Close palette / mobile menu      |
| `Ctrl+L`          | Clear interactive terminal       |
| `↑↑↓↓←→←→BA`      | Konami confetti                  |

## Structure

| Path                                                         | Purpose                                      |
|--------------------------------------------------------------|----------------------------------------------|
| [`index.html`](index.html)                                   | Landing page with all sections               |
| [`styles.css`](styles.css)                                   | Design tokens, layout, responsive, a11y      |
| [`script.js`](script.js)                                     | Canvas, typing, palette, terminal, easter eggs |
| [`assets/Michael_Kurdi_Resume_2026.pdf`](assets/)            | Canonical PDF résumé                         |
| [`assets/og-image.svg`](assets/og-image.svg)                 | Social share card                            |
| [`resume/`](resume/)                                         | Print-friendly web résumé                    |
| [`robots.txt`](robots.txt), [`sitemap.xml`](sitemap.xml)     | SEO                                          |
| [`site.webmanifest`](site.webmanifest)                       | PWA manifest                                 |
| [`PROFILE_README.md`](PROFILE_README.md)                     | Copy for GitHub profile README               |

## Updating the résumé

Copy the authoritative PDF into `assets/Michael_Kurdi_Resume_2026.pdf`, adjust [`resume/index.html`](resume/index.html) if the wording changed, commit, push.

## Local preview

Open `index.html` directly, or serve it:

```bash
npx --yes serve -p 5173 .
```

## License

© 2026 Mahmoud ("Michael") Al Kurdi. All rights reserved.
