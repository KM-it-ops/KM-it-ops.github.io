# What `build-awwwards-quality-sites` does not cover

Produced by running the skill for real against this repo on 2026-08-28. Every
item below is backed by something observed in that run, not by reading the skill
and imagining a hole. Ordered by how much it would have helped today.

The run itself: GSAP 3.15 + ScrollTrigger + Lenis 1.3.26 replaced Framer Motion,
a hero intro timeline and one scrubbed WebGL sequence were added, and the gate
was re-run across ten palettes, three widths and a reduced-motion pass.

---

## Status after the follow-up pass

Every gap below was worked, not just written up. Each new assertion is
mutation-tested — broken on purpose, confirmed to fail by name, restored.

| # | Gap | Status |
|---|---|---|
| 1 | No motion performance gate | **Built** — `tools/checks/motion.js`, variance-calibrated, mutation-tested |
| 2 | "Measured too early" false passes | **Closed** — fonts + images + layout-settle preconditions, `layoutNeverSettled` assertion |
| 3 | Gradient text contrast unverifiable | **Built and fixed** — `gradientTextContrast` found five failing palettes (worst stop 1.00); text now uses `--metal-*-text`, all ten clean, gradient min 4.25 |
| 4 | Scroll-driven CSS unowned | **Documented + measured** — support verified; the "it replaces smooth scroll" premise corrected |
| 5 | Skill assumes greenfield | **Written** — brownfield adapter, `motion-on-gated-sites` skill |
| 6 | Animation libs vs a11y gates | **Closed** — `hiddenTextAfterPass`; proved a count-based check misses it entirely |
| 7 | Route / page transitions | **Not closed** — single-page site, nothing to exercise it against. Recorded as an open hole in the new skill rather than guessed at. |

The lab-side items (4, 5, 6, and the rule from 2) are folded into a new skill at
`C:\AI\host-skills\claude\.claude\skills\motion-on-gated-sites\`, because the
`design-taste` copy lives in a plugin cache and edits there are overwritten on
update.

**One item genuinely could not be closed here.** Gap 7 needs a multi-page target;
writing authoritative guidance for an API this run never exercised would be the
same mistake as a contrast number nobody measured.

---

## 1. There is no runnable performance gate for motion — the biggest hole

**Evidence.** This session added a scroll engine, a scroll-linked WebGL transform
and ~30 scroll-triggered reveals on top of a hero chunk that is 897 KB
(242 KB gzip) and already trips Vite's chunk warning. At the end of it I could
prove the page was *correct* — contrast, hit areas, reflow, focus order, reduced
motion, all measured — and I could not prove it was *smooth*. Nothing in the
skill or the repo measures a frame.

`tools/checks/audit.js` asserts craft and accessibility. `audit_motion.py` in the
skill checks for `transition: all`, `ease-in`, ungated hover and missing
reduced-motion — all static source smells. Neither one has ever timed anything.

This matters more here than the wording suggests: the whole discipline of this
repo is *prefer the runnable check to the prose*, and motion is the one area
where the prose still wins by default.

**What to build.** A CDP probe alongside `audit.js`: start `Tracing`, drive a
scripted scroll from top to bottom, stop, then assert on p95 frame duration,
count of long tasks over 50 ms, and forced-reflow count. Mutation-test it by
animating `top` instead of `transform` and confirming it fails by name.

## 2. "Measured too early" is a whole class of false pass, and nothing owns it

**Evidence.** The gate reported `PASS: []` at HEAD on nav links that are 23 px
tall. They measure 25 px in the fallback face and 23 px in Figtree, and the probe
was evaluating before the webfont swapped. Worse, the padding rule it was passing
had a comment reading *"The primary nav links measured 16px tall"* — a previous
session had calibrated the fix against fallback metrics too. Two independent
errors, same root cause, neither visible to anyone reading the code or the site.

This generalises past fonts: any assertion taken before webfonts, images, or late
layout settle is a rumour. The repo already had this instinct for one case — it
refuses to run against an empty DOM — but only that one.

**Done here.** `audit.js` now awaits `document.fonts.ready` as a second
precondition and reports `fontsStatus`. The nav rule pins `min-height: 24px`
instead of counting pixels against whichever font wins the race. Mutation-tested:
removing the `min-height` makes the gate fail by name as `hitArea`.

**For the lab.** Promote "settle before you measure" to a named rule with a
checklist — fonts, images, `ResizeObserver` quiet, animation idle — because the
next probe anyone writes will have the same hole.

## 3. Gradient-clipped text has never had its contrast verified

**Evidence.** Eight entries in `contrastUnmeasured` on every palette, including
**the hero name, every `h2`, and every `em`.** These use
`background: <gradient>; background-clip: text; color: transparent`, so computed
style yields a transparent foreground and the probe correctly refuses to invent a
number. It is honest, and it is a blind spot: the largest, most prominent type on
the site is the type nobody has ever measured.

**What to build.** Sample the rendered gradient at glyph positions (or assert the
gradient's worst stop against the composited backdrop) and score that. Until then
the site's headline contrast is an assumption on all ten palettes.

## 4. Scroll-driven CSS is shipping, capable, and unowned — and it is not what people think

**Measured, not assumed.** In Chrome 151 on this machine:
`CSS.supports('animation-timeline', 'scroll()')` → **true**;
`view()` → **true**; `animation-range: entry 0% cover 40%` → **true**.

**The correction that matters:** scroll-driven CSS does **not** replace a
smooth-scroll engine. They solve different problems — `animation-timeline` links
*animation progress* to scroll position, while Lenis changes *scroll inertia*.
Reaching for one expecting the other is a category error, and the brief for this
session carried that assumption.

What it *can* replace is ScrollTrigger's `scrub`, off the main thread, at zero JS
cost. This run used ScrollTrigger for its one scrubbed sequence to keep a single
animation system, which is the right call at this size — but for a page whose
only need is scrub, the correct answer is now CSS and no library at all.

No skill in the lab mentions `animation-timeline`, `scroll()`, `view()`, or
`animation-range`.

## 5. The skill assumes greenfield, and says nothing about brownfield

**Evidence.** §1 opens with *"Generate a materially new identity, layout, copy
system, imagery, and interaction language."* This site is live, content-complete,
gated, and carries a shipped ten-palette feature. Followed literally, §1 destroys
all three. Nothing in the skill distinguishes "art-direct a new site" from
"art-direct a site that already exists and is working."

Every judgement that made this run safe — keep the palette system because it *is*
the differentiating idea, put the direction work into motion instead, treat the
gate baseline as a contract — had to be derived. A brownfield adapter belongs in
the skill: inventory what is load-bearing, name what is protected, decide
evolve-vs-replace *before* §1, and re-baseline every gate the change can reach.

## 6. Nothing warns that animation libraries and accessibility gates interact

Two traps hit in one session, neither mentioned anywhere:

- **Faded text disappears from measurement.** `visible()` in the probe skips
  `opacity: 0`, so a scroll-reveal that fades a heading silently removes it from
  the contrast sample. Coverage shrinks and nothing fails. The fix is structural —
  animate opacity only on wrappers that hold no text of their own — and it has to
  be known *before* writing the reveal, not discovered after.
- **Splitting text destroys it too.** `SplitText` moves text into child spans and
  marks them `aria-hidden`; the heading loses its direct text node and the children
  are skipped, so every split heading vanishes from contrast coverage. This is why
  §4's "reveal major headings word by word" was **not** implemented as written here.

Coverage was tracked as a number for exactly this reason: `textElementsChecked`
held at 199 desktop / 193 mobile from baseline to final across all ten palettes.
**Any motion work on a gated site should track that metric explicitly** — it is
the one that degrades silently.

## 7. Route and page transitions — a roster gap, not a measured one

Checked against the installed design roster: `animate` covers a single effect,
`animation-systems` covers app-wide defaults, `apple-design` covers gestures and
springs. None covers navigation choreography — the View Transitions API,
cross-document transitions, or a Barba-style router.

Flagged honestly as **unexercised**: this portfolio is a single page, so nothing
in this run tested it. It is a hole in coverage, not a defect reproduced here.

---

## Corrections to the brief this session started from

- *"The portfolio has zero motion"* — already corrected in the inbound handoff, and
  correct to have corrected: R3F hero, Framer reveals, 3 keyframes and 4
  reduced-motion blocks were all present.
- *"Re-run `validate_palette.js`"* — **that file does not exist.** Per-palette
  validation is `node tools/cdp-eval.mjs <w> <h> <dpr> tools/checks/audit.js` with
  `SITE_URL` carrying `?palette=<id>`.
- *"Test `animation-timeline: scroll()` before adding a JS smooth-scroll engine"* —
  reasonable instruction, false premise. See §4: they are not alternatives.
- *"The hidden state is applied by GSAP, so a no-JS load renders the full page"* —
  **mine, and wrong.** Measured `textLen: 0` without JavaScript, before and after
  this work: the app is client-rendered with no prerender step. A `<noscript>`
  block now carries the contact essentials. Prerendering is the real fix.
- *"A resting `translate(0px, 0px)` was shrinking the nav hit areas"* — **also mine,
  also wrong.** `clearProps` was added on that theory and the failure persisted
  unchanged; the cause was the webfont race in §2. The call is kept as hygiene,
  and the code comments now say so rather than carrying the false story forward.
- *"The motion layer costs ~6ms at the median, and the lens glass owns every long
  task"* — **mine, and measured under load.** Those figures came from runs taken
  with builds and back-to-back gate invocations in flight. On a quiet machine the
  static page and the full-motion page both sit on the 16.6ms vsync frame with
  zero jank and zero long tasks; the cost only appears in the p95 tail. The real
  finding is better than the wrong one: **the motion layer is free at the median
  when the CPU is free, and is the first thing to degrade under contention** —
  which is the permanent state of a mid-range phone. Both conditions are now
  recorded in `motion.js` and `tools/README.md`.
- *"Simplifying the text gradients improved frame time"* — **mine, and wrong.**
  It looked true because the improvement appeared in the same window. A direct
  A/B — reverting the six selectors to the decorative gradients and re-measuring —
  changed nothing. This is the third wrong attribution in one session, and all
  three shared a cause: a number taken under conditions nobody wrote down.
