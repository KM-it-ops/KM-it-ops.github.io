# Motion direction — "Instrument, not ornament"

Written before implementation, per `build-awwwards-quality-sites` §1.
Target: the live portfolio at `KM-it-ops.github.io`, HEAD `16645df`.

## Visual thesis

The site is a security analyst's case file, and its own copy already says so:
*"What I can prove"*, *"Work under inspection"*, *"no inflated SIEM years"*. The
motion must read as **instrumentation** — things resolve, settle, and hold still
so they can be read. Nothing bounces, drifts, or decorates. A hiring manager
scanning on a phone must never wait on an animation to read a sentence.

## Art direction: evolve, do not replace

Direction was open to revision. I am choosing to **keep the ten-look system as
the identity** rather than generate a new one, because it *is* the distinctive
idea: colour and layout travel together across ten named looks, with a pinned
preference. That is uncommon, it is shipped, and it is the thing that makes this
not a template. Replacing it would trade a real differentiator for a generic one.

The direction work therefore goes where the site is genuinely generic: **the
motion narrative and the hero's first ten seconds.**

Consequence that shapes every decision below: **motion must be palette-independent.**
Transform and opacity only, never colour. A motion system that varied by look would
multiply the ten-palette gate surface by ten and put the known-good baseline at risk.

## Motion narrative

1. **Hero intro** (GSAP timeline, ~1.1s): nav → kicker → name → throughline → CTAs → hire rail.
   Everything is readable and clickable before it finishes.
2. **The lens withdraws.** The existing WebGL lens scrubs from full presence to
   recessed as the hero scrolls away — the instrument focuses, then hands over to
   the evidence. This is the one scrubbed sequence.
3. **Section by section**, headings settle first, supporting copy and cards follow
   on a restrained cascade.
4. **Marquee and net stay CSS.** They work; churn adds risk, not quality.

## Decisions

| Decision | Choice | Why |
|---|---|---|
| Animation system | **GSAP 3.15** | Skill §4. Replaces Framer Motion entirely — one system, not two. |
| Smooth scroll | **Lenis 1.3.26**, desktop fine-pointer only | Smaller than Locomotive 5, actively maintained, and it does **not** wrap the DOM in a transformed container — which would break the `position: fixed` WebGL canvas and the looks panel. Never both engines. |
| Split text | **Not used** | See "What the gate forbids" below. The hero name is already two spans; stagger those. |
| Three.js | **Unchanged, scroll-linked** | §5: it already exists and now earns a clear responsibility. No new shaders. |
| Pinned sections | **None** | Pinning changes scrollHeight and hurts scanability on a content-dense CV. One scrub is enough. |
| New assets | **None** | Nothing to source; no avatars, no logo wall, no invented proof. §2 satisfied by not adding dishonest assets. |

## What the gate forbids — constraints derived from `tools/checks/audit.js`

These are not style preferences. Each one is a false-pass or a failure the probe
would produce, found by reading the probe before writing code.

1. **Never put animated opacity on an element that directly contains text.**
   `visible()` excludes `opacity: 0`, so a faded heading silently drops out of the
   contrast sample and *coverage shrinks without failing*. Opacity goes on a
   wrapper with no text node of its own — which is what the Framer version did.
   **Tracked metric: `textElementsChecked` must stay ≥ 199.**
2. **No `translateX` anywhere.** Reflow is asserted as `scrollWidth > innerWidth + 1`,
   before and after the scroll pass. A card resting off the right edge fails it.
3. **No `SplitText` on headings.** Splitting moves the text into child spans and
   marks them `aria-hidden`, so the heading loses its direct text node and the
   children are skipped — every split heading would vanish from contrast coverage.
4. **No new `<span>` inside `.mash-hero h1`.** The hero-name assertion selects
   `.mash-hero h1 span`; a wrapper span would be measured as a name word.
   Animate the two existing spans with **transform only**, and put the fade on the `h1`.
5. **Motion adds no new JS dependency to readability.** The hidden state is applied
   by GSAP at runtime and never in CSS, so nothing here is invisible without
   scripting. **Corrected after measuring:** I first wrote that this meant a no-JS
   load "renders the full page". It does not. The app is client-rendered with no
   prerender step, so `#root` is empty and a scriptless visit measured
   `textLen: 0` — before this work as much as after. The motion system is not the
   cause and does not make it worse, but the claim was wrong. A `<noscript>` block
   in `index.html` now carries the contact essentials; prerendering is the real
   fix and is out of scope for a motion pass.

## Validation plan

Production build, then the gate at **320 / 375 / 1440 across all ten palettes**,
plus a reduced-motion pass. `PASS: []` everywhere and `textElementsChecked` at or
above baseline. Anything less is a regression, not a trade-off.
