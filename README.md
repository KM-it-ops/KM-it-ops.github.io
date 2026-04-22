# km-it-ops.github.io

Personal site for **Mahmoud (&ldquo;Michael&rdquo;) Al Kurdi** &mdash; static HTML, CSS, and vanilla JavaScript. No build step, no runtime deps.

## Live

- Site &middot; <https://km-it-ops.github.io/>
- PDF r&eacute;sum&eacute; &middot; [`assets/Mahmoud_Al_Kurdi_Resume_2026.pdf`](https://km-it-ops.github.io/assets/Mahmoud_Al_Kurdi_Resume_2026.pdf)
- Web r&eacute;sum&eacute; (print-friendly) &middot; <https://km-it-ops.github.io/resume/>

## Shortcuts

| Keys                | Action                           |
|---------------------|----------------------------------|
| `⌘K` / `Ctrl+K`    | Open command palette             |
| `/`                 | Open command palette             |
| `↑` / `↓`           | Navigate palette / shell history |
| `Tab`               | Shell autocomplete               |
| `Enter`             | Run selected command             |
| `Esc`               | Close palette / mobile menu      |
| `Ctrl+L`            | Clear the shell                  |
| `↑↑↓↓←→←→BA`        | &mdash;                          |

Try `neofetch`, `matrix`, or `theme` in the in-page shell.

## Structure

| Path                                                                  | Purpose                                    |
|-----------------------------------------------------------------------|--------------------------------------------|
| [`index.html`](index.html)                                            | Landing page                               |
| [`styles.css`](styles.css)                                            | Design tokens, layout, responsive, a11y    |
| [`script.js`](script.js)                                              | Canvas, typing, palette, shell, effects    |
| [`assets/Mahmoud_Al_Kurdi_Resume_2026.pdf`](assets/)                  | Canonical PDF r&eacute;sum&eacute;         |
| [`assets/og-image.svg`](assets/og-image.svg)                          | Social share card                          |
| [`assets/favicon.svg`](assets/favicon.svg)                            | Favicon                                    |
| [`resume/`](resume/)                                                  | Print-friendly web r&eacute;sum&eacute;    |
| `robots.txt`, `sitemap.xml`, `site.webmanifest`                       | SEO / PWA                                  |
| [`PROFILE_README.md`](PROFILE_README.md)                              | GitHub profile README                      |

## Updating the r&eacute;sum&eacute;

Copy the authoritative PDF into `assets/Mahmoud_Al_Kurdi_Resume_2026.pdf`, adjust [`resume/index.html`](resume/index.html) if the wording changed, commit, push.

## Local preview

```bash
npx --yes serve -p 5173 .
```

## License

© 2026 Mahmoud (&ldquo;Michael&rdquo;) Al Kurdi. All rights reserved.
