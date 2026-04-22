# Mahmoud ("Michael") Kurdi — portfolio (GitHub Pages)

Cybersecurity-focused portfolio, **canonical PDF résumé**, and print-friendly web resume: **static HTML, CSS, and vanilla JavaScript** — no build step.

## Live site

[https://km-it-ops.github.io/](https://km-it-ops.github.io/) · **PDF résumé:** [assets/Michael_Kurdi_Resume_2026.pdf](https://km-it-ops.github.io/assets/Michael_Kurdi_Resume_2026.pdf) · Web resume: [https://km-it-ops.github.io/resume/](https://km-it-ops.github.io/resume/) (also **Print / Save as PDF** from the browser).

## Updating the PDF

Authoritative source is your local `Michael_Kurdi_Resume_2026.pdf`. After you revise it, **copy** the file into this repo as [assets/Michael_Kurdi_Resume_2026.pdf](assets/Michael_Kurdi_Resume_2026.pdf), then adjust [resume/index.html](resume/index.html) if the wording changed, commit, and push.

## Structure

| Path | Purpose |
|------|---------|
| [assets/Michael_Kurdi_Resume_2026.pdf](assets/Michael_Kurdi_Resume_2026.pdf) | Canonical résumé PDF served by Pages |
| [index.html](index.html) | Landing page: hero, about, projects, toolkit, credentials, contact |
| [styles.css](styles.css) | Design tokens, layout, responsive rules |
| [script.js](script.js) | Hero canvas, typing effect, scroll reveal, nav, technique cards |
| [resume/](resume/) | Web resume aligned with the PDF + print CSS |
| [PROFILE_README.md](PROFILE_README.md) | Copy for GitHub profile README (`KM-it-ops/KM-it-ops` repo) |
| [docs/REPO_CLEANUP.md](docs/REPO_CLEANUP.md) | Repo inventory and archive/pin guidance |
| [docs/DEPLOY.md](docs/DEPLOY.md) | GitHub Pages deployment notes |

## Local preview

Open `index.html` in a browser, or from this directory:

```bash
npx --yes serve -p 5173
```

## License

© 2026 Mahmoud (Michael) Kurdi. All rights reserved.
