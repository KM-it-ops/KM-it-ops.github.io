/* Motion performance gate.
 *
 * The companion to audit.js. That probe proves the page is *correct*; this one
 * proves it is *smooth*. Before this existed, the repo could assert contrast,
 * hit areas, reflow and focus order, and could say nothing at all about whether
 * a scroll engine, a scrubbed WebGL transform and thirty scroll-triggered
 * reveals held their frame budget. "Performance safeguards" was prose.
 *
 * Runs through the same driver as audit.js:
 *   node tools/cdp-eval.mjs 1440 900 1 tools/checks/motion.js
 *
 * Same rules as the other probe: it refuses to score a page it could not
 * measure, and every number it reports is one it actually took.
 */
(async () => {
  const out = {}
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
  const raf = () => new Promise((r) => requestAnimationFrame(r))
  document.documentElement.style.scrollBehavior = 'auto'

  // ---------------------------------------------------------------
  // Preconditions. Identical philosophy to audit.js: measuring a page that
  // has not settled produces numbers that describe a layout nobody will see.
  // ---------------------------------------------------------------
  for (let i = 0; i < 40; i++) {
    if (document.querySelectorAll('body *').length > 50 &&
        document.body.innerText.trim().length > 500) break
    await sleep(250)
  }
  out.domElements = document.querySelectorAll('body *').length
  if (out.domElements < 50) {
    out.PASS = ['probe-precondition']
    out.note = 'DOM never populated — a frame budget measured here means nothing'
    return JSON.stringify(out, null, 1)
  }
  try { if (document.fonts?.ready) await document.fonts.ready } catch { /* no API */ }
  try {
    await Promise.all([...document.images].filter((i) => !i.complete)
      .map((i) => (i.decode ? i.decode().catch(() => {}) : Promise.resolve())))
  } catch { /* a broken image must not take the probe down */ }

  out.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // ---------------------------------------------------------------
  // Observers.
  // ---------------------------------------------------------------
  const longTasks = []
  let clsValue = 0
  const observers = []
  const observe = (type, cb, extra = {}) => {
    try {
      const po = new PerformanceObserver((list) => list.getEntries().forEach(cb))
      po.observe({ type, buffered: false, ...extra })
      observers.push(po)
      return true
    } catch { return false }
  }
  out.longTaskObserved = observe('longtask', (e) => longTasks.push(Math.round(e.duration)))
  out.layoutShiftObserved = observe('layout-shift', (e) => {
    if (!e.hadRecentInput) clsValue += e.value
  })

  // ---------------------------------------------------------------
  // Warm-up. The first frames after load carry the intro timeline and lazy
  // module evaluation; scoring those would measure boot, not scrolling.
  // ---------------------------------------------------------------
  window.scrollTo({ top: 0, behavior: 'instant' })
  await sleep(2200)
  longTasks.length = 0
  clsValue = 0

  // ---------------------------------------------------------------
  // The measured run: scroll the page top to bottom one frame at a time,
  // recording how long each frame actually took. This exercises the scroll
  // engine, every ScrollTrigger, and the scrubbed WebGL transform together,
  // which is the combination that no static source check can evaluate.
  // ---------------------------------------------------------------
  const docHeight = document.documentElement.scrollHeight
  const viewport = window.innerHeight
  const distance = Math.max(0, docHeight - viewport)
  const stepPx = Math.max(8, Math.round(viewport / 28))   // ~28 frames per viewport
  const frames = []

  await raf()
  let last = performance.now()
  let y = 0
  let guard = 0
  while (y < distance && guard < 4000) {
    y = Math.min(distance, y + stepPx)
    window.scrollTo({ top: y, behavior: 'instant' })
    await raf()
    const now = performance.now()
    frames.push(now - last)
    last = now
    guard++
  }
  // Let the scrub and any inertia settle, still recording.
  for (let i = 0; i < 30; i++) {
    await raf()
    const now = performance.now()
    frames.push(now - last)
    last = now
  }

  observers.forEach((o) => { try { o.disconnect() } catch { /* already gone */ } })
  window.scrollTo({ top: 0, behavior: 'instant' })

  // ---------------------------------------------------------------
  // Results. A run that sampled too few frames is a failed measurement, not
  // a pass — the same trap as a probe reporting clean against an empty DOM.
  // ---------------------------------------------------------------
  out.framesSampled = frames.length
  out.scrollDistancePx = Math.round(distance)
  if (frames.length < 60 || distance < 200) {
    out.PASS = ['probe-insufficient-frames']
    out.note = `only ${frames.length} frames over ${Math.round(distance)}px — nothing here is a measurement`
    return JSON.stringify(out, null, 1)
  }

  const sorted = [...frames].sort((a, b) => a - b)
  const pct = (p) => +sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))].toFixed(2)
  out.frameMs = {
    p50: pct(0.5),
    p95: pct(0.95),
    p99: pct(0.99),
    worst: +sorted[sorted.length - 1].toFixed(2),
  }
  // A frame over 50ms is a visible hitch, not a rounding artifact.
  out.jankFrames = frames.filter((f) => f > 50).length
  out.jankFramePct = +((out.jankFrames / frames.length) * 100).toFixed(2)
  out.longTasks = longTasks.length
  out.longTaskWorstMs = longTasks.length ? Math.max(...longTasks) : 0
  out.cls = +clsValue.toFixed(4)

  // ---------------------------------------------------------------
  // Thresholds — and what they are and are not.
  //
  // This is a REGRESSION gate, not a 60fps certificate. It scrolls a step every
  // single frame with no idle time, which is harsher than any real reader, and
  // it runs under CDP with a debugger attached. The numbers below are therefore
  // a stress-test floor, not the experience.
  //
  // Calibrated against measured variance over repeated runs at 1440x900, DPR 1.
  // MACHINE LOAD DOMINATES THESE NUMBERS, so both conditions are recorded — the
  // first table written here was taken with builds and back-to-back gate runs in
  // flight and presented as the site's performance, which was wrong in exactly
  // the way this gate exists to prevent:
  //
  //   config                                 p50          p95        jank  longTasks
  //   QUIET MACHINE
  //     reduced motion (no GSAP/Lenis/WebGL)   16.6         16.8-16.9   0     0
  //     full motion as shipped                 16.6-17.0    18.0-30.9   0     0
  //   MACHINE UNDER LOAD
  //     reduced motion                         16.6         17.4        0     0
  //     full motion as shipped                 21.0-23.8    36.5-43.0   1-4   1-2
  //
  // Read that carefully: idle, the motion layer is free at the median — both
  // configurations sit on the 16.6ms vsync frame and it only shows in the p95
  // tail. Under CPU contention the static page still holds 16.6 while the motion
  // page degrades to 21-24 with real hitching. The motion layer has no headroom,
  // and contention is the permanent state of a mid-range phone.
  //
  // Two earlier attributions were measured under load and did NOT reproduce
  // quiet, so do not trust them: that the glass (`transmission`) costs ~2.3ms
  // and owns every long task, and that simplifying the text gradients helped.
  // The second was A/B tested directly — reverting it changed nothing.
  //
  // Thresholds are therefore set to tolerate a CONTENDED machine, not to police
  // the idle number. A gate that flakes whenever a build is running gets
  // ignored, and an ignored gate is worse than no gate. A healthy quiet run
  // should look like p50 ~16.6; if you see 23 with nothing else running, that is
  // a real regression even though it passes.
  //
  // `worst` is reported but deliberately NOT gated: it ranged 29-162ms across
  // identical runs and is noise. p50 is the most stable signal and is gated
  // tightest. If you relax one of these, say why here.
  // ---------------------------------------------------------------
  out.thresholds = { p50FrameMs: 30, p95FrameMs: 52, jankFramePct: 5, longTaskWorstMs: 200, cls: 0.1 }
  out.PASS = []
  if (out.frameMs.p50 > out.thresholds.p50FrameMs) out.PASS.push('frameBudgetMedian')
  if (out.frameMs.p95 > out.thresholds.p95FrameMs) out.PASS.push('frameBudget')
  if (out.jankFramePct > out.thresholds.jankFramePct) out.PASS.push('jankFrames')
  if (out.longTaskWorstMs > out.thresholds.longTaskWorstMs) out.PASS.push('longTask')
  if (out.cls > out.thresholds.cls) out.PASS.push('layoutShift')
  // A metric that cannot be observed must not read as a pass.
  if (!out.longTaskObserved) out.PASS.push('longTaskUnobservable')

  return JSON.stringify(out, null, 1)
})()
