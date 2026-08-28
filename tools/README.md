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
| `gradientTextFails` | `background-clip: text` glyphs whose **worst gradient stop** is under the floor |
| `gradientTextUnmeasured` | Gradient text with stacked background layers — reported, never scored |
| `hiddenTextAfterPass` | Text still under an `opacity: 0` ancestor after a full scroll — a reveal that never fired |
| `layoutSettled` | False means the page was still moving when measured; scored as a failure |
| `fontsStatus` / `imagesPending` | Evidence that the settle preconditions actually held |
| `hitAreaFails` | Interactive target under 24x24 (WCAG 2.5.8) |
| `hitAreaInlineExempt` | Under 24x24 but inline in a sentence, which 2.5.8 exempts |
| `heroNameFails` | A name word wrapped, or overflowed its column |
| `chartEncodingFails` | A chart mark whose rendered size does not match the value it claims |
| `reflowOverflow*` | Horizontal scroll at the tested width (WCAG 1.4.10) |
| `focusableInAriaHidden` | Focusable content inside an `aria-hidden` subtree |
| `unknownColorSyntax` | A colour the probe could not parse — treat as a failure, not a pass |

## Why it is shaped this way

Four traps are designed out, each because it bit:

- **It refuses to run against an empty page.** Vite's cold dep-optimization
  triggers a full reload; the first version of this probe evaluated during that
  reload, found zero elements, and reported a clean `PASS`. There is now a
  precondition that waits for the DOM and fails loudly as `probe-precondition`.
- **It parses `color(srgb ...)`.** getComputedStyle returns CSS Color 4 syntax
  with components in 0..1. Reading them as 0..255 turned this site's cream nav
  into near-black and invented a 2.85 failure on links that measure 4.89. Any
  colour it still cannot parse surfaces as `unknownColorSyntax` instead of
  silently scoring zero.
- **It measures charts instead of trusting them.** A bar whose rendered size does
  not match its value is the worst chart defect: it looks fine and it lies. Three
  columns of 25/16/18 once rendered at near-identical heights because their
  percentage heights resolved inside a flex box that also held the labels.
- **It composites alpha.** The predecessor of this probe, in
  `ultra-design-lab`, read r/g/b and discarded the alpha channel, so every
  `rgba()` text colour scored as pure white and the gate could not fail. Three
  handoffs recorded a contrast number that was not a measurement of anything.

The rule those share: **a check that cannot fail is worse than no check**, and a
number nobody has mutation-tested is a rumour. When adding an assertion, break
the fix on purpose and confirm the gate names it.

## Settle before you measure

Two preconditions run before any assertion, and both exist because the gate got
this wrong in a way that produced a clean `PASS` over a real defect:

1. **The DOM must be populated.** Vite's cold dep-optimization blanks the page.
2. **Fonts, images and layout must have stopped moving.** The primary nav links
   are 25px tall in the fallback face and 23px in Figtree. The probe used to
   evaluate before the swap, so it scored a hit area no visitor ever sees — and
   the padding rule it was passing had been calibrated against the fallback too.
   Two errors, one root cause, neither visible in the code or on screen.

The general rule, and the one to apply to any new assertion: **a measurement
taken before the page settles is a rumour.** `layoutSettled`, `fontsStatus` and
`imagesPending` are reported so you can see the preconditions held.

## Motion gate — `tools/checks/motion.js`

`audit.js` proves the page is *correct*. `motion.js` proves it is *smooth*, and
runs through the same driver:

```powershell
$env:SITE_URL = "http://127.0.0.1:5173/?palette=grit"
node tools/cdp-eval.mjs 1440 900 1 tools/checks/motion.js
```

It scrolls the page top to bottom one frame at a time and records frame
durations, long tasks and layout shift. That is a **stress test, not a 60fps
certificate** — it scrolls every frame with no idle, which is harsher than any
real reader.

**Machine load dominates these numbers.** Both conditions are recorded, because
the first version of this table was taken with builds and back-to-back gate runs
in flight and written down as the site's performance — the same error the font
race was, one layer up. Measured at 1440x900, DPR 1, over repeated runs:

| Condition | Config | p50 | p95 | jank | long tasks |
|---|---|---|---|---|---|
| **Quiet** | reduced motion (floor) | 16.6 | 16.8–16.9 | 0 | 0 |
| **Quiet** | **full motion as shipped** | **16.6–17.0** | **18.0–30.9** | **0** | **0** |
| Under load | reduced motion | 16.6 | 17.4 | 0 | 0 |
| Under load | full motion as shipped | 21.0–23.8 | 36.5–43.0 | 1–4 | 1–2 |

Idle, the motion layer is **free at the median** — both configs sit on the 16.6ms
vsync frame and the cost only appears in the p95 tail. Under CPU contention the
static page still holds 16.6 while the motion page degrades to 21–24 with real
hitching. **The motion layer has no headroom, and contention is the permanent
state of a mid-range phone.** That is the honest summary.

Two attributions measured under load did **not** reproduce on a quiet machine, so
do not trust them: that the lens glass costs ~2.3ms and owns every long task, and
that simplifying the text gradients improved frame time. The second was A/B
tested directly — reverting it changed nothing.

Thresholds tolerate a **contended** machine rather than policing the idle number,
so the gate does not flake whenever a build is running. A healthy quiet run should
look like p50 ~16.6; p50 of 23 with nothing else running is a real regression even
though it passes. `worst` ranged 29–162ms across identical runs — reported, never
gated.

Mutation-tested: injecting 30ms of synchronous work per scroll event moves p50
from 23.5 to 34.9 and fails by name as `frameBudgetMedian`.

## Known-good baseline

All ten palettes at 320 / 375 / 1440 return `"PASS": []` on every assertion, with
contrast minimums from 4.68 (`restorative`) to 7.72 (`clubroom`),
**gradient-text** minimums from 4.25 (`restorative`) to 13.52 (`clubroom`), and
`textElementsChecked` at 199 desktop / 193 mobile. Treat that coverage count as a
tracked number: motion work degrades it silently, which is what
`hiddenTextAfterPass` now catches.

**Gradient text was fixed, not grandfathered.** When `gradientTextContrast`
first ran it failed on five palettes with worst stops of 1.00–2.41 — the second
hero name word, the "Hire me" heading and all three credential stats, confirmed
by screenshot as near-white on near-white. The cause was six selectors painting
text with `--metal-coral` / `--metal-cyan` / `--metal-gold`, which are
**decorative** fills written to sit on dark panels. Text now uses
`--metal-*-text`, defined per `[data-theme]` from tokens already verified as text
colours on that background, so an eleventh palette inherits the safe version.
A previous session fixed `--cyan` on `mineral` for exactly this reason and could
only reach the solid colours, because gradients had no assertion until now.

The three side-project links measure 18px tall and appear under
`hitAreaInlineExempt`; they are inline in a sentence and conformant. Do not
"fix" them by forcing 24px — that breaks the text rhythm for no gain.

## Chart encoding — the opt-in contract

`chartEncodingFails` checks that a mark's rendered size matches the value it claims.
It is deliberately **opt-in and class-agnostic**, so it works on any page rather than
one page's markup. Tag each mark:

```html
<div class="bar-fill"
     data-encode-group="memory-buckets"   <!-- groups one chart -->
     data-encode="width"                  <!-- width | height -->
     data-encode-value="30"               <!-- the value this mark claims -->
     data-encode-label="Project"          <!-- optional, for the failure message -->
     style="width:100%"></div>
```

The largest value in a group defines full scale; every other mark is checked
proportionally against it. Tolerance is 4% of full scale or 2px, whichever is larger,
which absorbs sub-pixel rounding and a `min-height` floor on a near-zero bar.

A group with fewer than two marks is skipped — one mark encodes nothing to compare.
**A page with no marks at all adds nothing to `PASS`**: having no charts is a
legitimate state, unlike an empty DOM, which invalidates every other assertion.

Mutation-tested: flattening the columns to equal heights, and widening one bar,
each make the gate fail by name.
