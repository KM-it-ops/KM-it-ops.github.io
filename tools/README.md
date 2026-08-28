# Gate

One probe, driven over CDP against the dev server. It asserts the things that
have actually broken on this site, and it is built so that a failure to measure
reports as a failure rather than as a pass.

## Run

Two terminals. The Chrome window must stay **visible** — a backgrounded tab
never initialises WebGL and the hero canvas stays at its 300x150 default.

```powershell
$env:Path = "C:\Program Files\nodejs;" + $env:Path
cd C:\AI\projects\KM-it-ops.github.io
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

```powershell
& "C:\Program Files\Google\Chrome\Application\chrome.exe" `
  --remote-debugging-port=9222 --user-data-dir=$env:TEMP\gate-profile `
  --no-first-run --window-size=1440,900 about:blank
```

Then, per width:

```powershell
$env:SITE_URL = "http://127.0.0.1:5173/"
node tools/cdp-eval.mjs 1440 900 1 tools/checks/audit.js
```

`cdp-eval.mjs <width> <height> <dpr> <probe> [reduced]`. Widths worth running:
**320 568 2**, **375 812 3**, **1440 900 1**. A fourth argument of `reduced`
emulates `prefers-reduced-motion`.

The palette is a URL parameter, and contrast is per-palette — a pass on the
default says nothing about the other nine:

```powershell
$env:SITE_URL = "http://127.0.0.1:5173/?palette=mineral"
```

Palettes: `grit` (default) `clubroom` `forest` `mermaid` `mineral` `mocha`
`mono` `mood` `restorative` `twilight`.

## Reading the output

`PASS` is the verdict: **an empty array is clean**, and any entry names the
assertion that failed. Everything else in the JSON is evidence.

| Key | Means |
|---|---|
| `contrastFails` | Composited fg/bg under 4.5 (or 3.0 for large text) |
| `contrastUnmeasured` | Text over a gradient/image the probe cannot resolve — reported, never scored |
| `hitAreaFails` | Interactive target under 24x24 (WCAG 2.5.8) |
| `hitAreaInlineExempt` | Under 24x24 but inline in a sentence, which 2.5.8 exempts |
| `heroNameFails` | A name word wrapped, or overflowed its column |
| `reflowOverflow*` | Horizontal scroll at the tested width (WCAG 1.4.10) |
| `focusableInAriaHidden` | Focusable content inside an `aria-hidden` subtree |
| `unknownColorSyntax` | A colour the probe could not parse — treat as a failure, not a pass |

## Why it is shaped this way

Three traps are designed out, each because it bit:

- **It refuses to run against an empty page.** Vite's cold dep-optimization
  triggers a full reload; the first version of this probe evaluated during that
  reload, found zero elements, and reported a clean `PASS`. There is now a
  precondition that waits for the DOM and fails loudly as `probe-precondition`.
- **It parses `color(srgb ...)`.** getComputedStyle returns CSS Color 4 syntax
  with components in 0..1. Reading them as 0..255 turned this site's cream nav
  into near-black and invented a 2.85 failure on links that measure 4.89. Any
  colour it still cannot parse surfaces as `unknownColorSyntax` instead of
  silently scoring zero.
- **It composites alpha.** The predecessor of this probe, in
  `ultra-design-lab`, read r/g/b and discarded the alpha channel, so every
  `rgba()` text colour scored as pure white and the gate could not fail. Three
  handoffs recorded a contrast number that was not a measurement of anything.

The rule those share: **a check that cannot fail is worse than no check**, and a
number nobody has mutation-tested is a rumour. When adding an assertion, break
the fix on purpose and confirm the gate names it.

## Known-good baseline

At the time this landed, all ten palettes at 320 / 375 / 1440 return
`"PASS": []`, with contrast minimums from 4.68 (`restorative`) to 7.72
(`clubroom`). The three side-project links measure 18px tall and appear under
`hitAreaInlineExempt`; they are inline in a sentence and conformant. Do not
"fix" them by forcing 24px — that breaks the text rhythm for no gain.
