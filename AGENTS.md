# AGENTS.md

## Cursor Cloud specific instructions

This is a **zero-dependency static website** (HTML + CSS + vanilla JS). There is no build step, no package manager, and no backend service.

### Running the dev server

```bash
npx --yes serve -p 5173 .
```

This serves the site at `http://localhost:5173/`. The `--yes` flag auto-accepts the npx prompt so it works non-interactively.

### Key paths

- `index.html` — main page with all sections
- `script.js` — canvas, terminal REPL, command palette, easter eggs
- `styles.css` — design tokens, layout, responsive, a11y
- `resume/` — print-friendly web résumé sub-page
- `assets/` — SVG images and PDF résumé

### Testing

There are no automated tests or linters configured. Verification is done by serving the site and confirming pages load (HTTP 200 for `/`, `/styles.css`, `/script.js`, `/resume/`).

### Notes

- No `node_modules`, no `package.json`, no lock files exist. The only Node usage is `npx serve` for local preview.
- The command palette activates with `Ctrl+K` (or `⌘K` on Mac) and `/`.
- The interactive terminal REPL is at the bottom of the page; type `help` for available commands.
