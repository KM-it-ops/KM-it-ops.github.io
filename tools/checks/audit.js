(async () => {
  const out = {}
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
  document.documentElement.style.scrollBehavior = 'auto'

  // Precondition. A probe that finds nothing must fail loudly, not report a
  // clean PASS — an empty DOM scores zero failures on every assertion below.
  // Vite's cold dep-optimization triggers a full reload that blanks the page
  // at exactly the moment the driver evaluates, and the first run of this
  // probe did report PASS against 0 elements.
  for (let i = 0; i < 40; i++) {
    if (document.querySelectorAll('body *').length > 50 &&
        document.body.innerText.trim().length > 500) break
    await sleep(250)
  }
  out.domElements = document.querySelectorAll('body *').length
  out.domTextLen = document.body.innerText.trim().length
  if (out.domElements < 50 || out.domTextLen < 500) {
    out.PASS = ['probe-precondition']
    out.note = 'DOM never populated — every result below would be a false pass'
    return JSON.stringify(out, null, 1)
  }

  // ---------------------------------------------------------------
  // Colour math. Alpha is composited, not discarded — discarding it is
  // exactly the bug that let ultra-design-lab's gate score every rgba()
  // text colour as pure white and report 17.49 for a pair measuring 6.22.
  // ---------------------------------------------------------------
  const unknownColor = []
  const parse = (c) => {
    if (!c || c === 'transparent') return [0, 0, 0, 0]
    const s = c.trim()
    const n = (s.match(/[\d.]+/g) || []).map(Number)
    if (n.length < 3) return [0, 0, 0, 0]
    // CSS Color 4. getComputedStyle returns color(srgb r g b / a) with the
    // components in 0..1, not 0..255. Reading them as 0..255 turns this site's
    // cream header into near-black and invents a 2.85 failure on nav links that
    // actually measure 4.89 — the same class of bug as discarding alpha.
    if (/^color\(\s*srgb/i.test(s)) {
      return [n[0] * 255, n[1] * 255, n[2] * 255, n[3] === undefined ? 1 : n[3]]
    }
    if (!/^rgba?\(/i.test(s)) {
      unknownColor.push(s.slice(0, 40))
      return [0, 0, 0, 0]
    }
    return [n[0], n[1], n[2], n[3] === undefined ? 1 : n[3]]
  }
  const lin = (v) => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  }
  const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
  const ratioOf = (fg, bg) => {
    const a = lum(fg), b = lum(bg)
    const hi = Math.max(a, b), lo = Math.min(a, b)
    return +(((hi + 0.05) / (lo + 0.05)).toFixed(2))
  }
  const over = (fg, bg) => fg.slice(0, 3).map((c, i) => fg[3] * c + (1 - fg[3]) * bg[i])

  // Effective background: composite ancestor background-colors until opaque.
  // A background-image anywhere in that chain means the true backdrop is a
  // gradient/photo we cannot resolve from computed style — report it as
  // unmeasured rather than inventing a number.
  const effBg = (el) => {
    const stack = []
    let node = el, img = false, imgOn = null
    while (node && node.nodeType === 1) {
      const cs = getComputedStyle(node)
      if (cs.backgroundImage && cs.backgroundImage !== 'none') {
        img = true
        if (!imgOn) imgOn = node.className || node.tagName
      }
      const c = parse(cs.backgroundColor)
      if (c[3] > 0) {
        stack.push(c)
        if (c[3] === 1) break
      }
      node = node.parentElement
    }
    if (!stack.length) stack.push([255, 255, 255, 1])
    let bg = stack[stack.length - 1].slice(0, 3)
    for (let i = stack.length - 2; i >= 0; i--) bg = over(stack[i], bg)
    return { bg, img, imgOn: imgOn ? String(imgOn).slice(0, 40) : null }
  }

  const label = (el) => {
    const cls = String(el.className || '').trim().split(/\s+/).filter(Boolean).slice(0, 2).join('.')
    return el.tagName.toLowerCase() + (cls ? '.' + cls : '')
  }

  const visible = (el) => {
    const cs = getComputedStyle(el)
    if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return false
    const r = el.getBoundingClientRect()
    return r.width > 0 && r.height > 0
  }

  // ---------------------------------------------------------------
  // 1. Contrast over every element that actually renders its own text.
  // ---------------------------------------------------------------
  const textEls = [...document.querySelectorAll('body *')].filter((el) => {
    if (el.closest('[aria-hidden="true"],[aria-hidden]')) return false
    if (['SCRIPT', 'STYLE', 'CANVAS', 'SVG', 'PATH', 'NOSCRIPT'].includes(el.tagName)) return false
    if (el.closest('svg')) return false
    const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1)
    return own && visible(el)
  })

  const samples = textEls.map((el) => {
    const cs = getComputedStyle(el)
    const fg = parse(cs.color)
    const { bg, img, imgOn } = effBg(el)
    const composited = over(fg, bg)
    const px = parseFloat(cs.fontSize)
    const w = parseFloat(cs.fontWeight) || 400
    const large = px >= 24 || (px >= 18.66 && w >= 700)
    const need = large ? 3 : 4.5
    const ratio = ratioOf(composited, bg)
    return {
      sel: label(el), px: +px.toFixed(1), weight: w, alpha: fg[3],
      ratio, need, ok: ratio >= need, unmeasured: img, bgFrom: imgOn,
      text: el.textContent.trim().slice(0, 32),
    }
  })

  out.textElementsChecked = samples.length
  out.contrastFails = samples.filter((s) => !s.ok && !s.unmeasured)
    .map((s) => `${s.sel} ${s.px}px a=${s.alpha} = ${s.ratio} (need ${s.need}) "${s.text}"`)
  out.contrastUnmeasured = [...new Set(samples.filter((s) => s.unmeasured && !s.ok)
    .map((s) => `${s.sel} = ${s.ratio} over solid stops (need ${s.need}) — real backdrop is ${s.bgFrom}`))]
  out.contrastMin = samples.filter((s) => !s.unmeasured).reduce((m, s) => Math.min(m, s.ratio), 99)

  // ---------------------------------------------------------------
  // 2. Hit areas — WCAG 2.5.8 wants 24x24 CSS px. Pseudo-element
  //    extensions do not show in getBoundingClientRect, so measure the
  //    ::before/::after inset box too before calling anything a failure.
  // ---------------------------------------------------------------
  const interactive = [...document.querySelectorAll('a[href],button,[role="button"],input,select,textarea,[tabindex]:not([tabindex="-1"])')]
    .filter(visible)

  const pseudoBox = (el, r) => {
    let best = { w: r.width, h: r.height }
    for (const p of ['::before', '::after']) {
      const cs = getComputedStyle(el, p)
      if (!cs || cs.content === 'none') continue
      if (cs.position !== 'absolute') continue
      const num = (v) => (v && v.endsWith('px') ? parseFloat(v) : 0)
      const w = r.width - num(cs.left) - num(cs.right)
      const h = r.height - num(cs.top) - num(cs.bottom)
      if (w > best.w) best.w = w
      if (h > best.h) best.h = h
    }
    return best
  }

  // 2.5.8 exempts an inline target "in a sentence, or [whose] size is otherwise
  // constrained by the line-height of non-target text". Test that condition
  // rather than reporting every short inline link — a gate that cries wolf on
  // conformant markup gets ignored, or "fixed" by breaking the text rhythm.
  const inlineExempt = (el) => {
    if (getComputedStyle(el).display !== 'inline') return false
    const p = el.parentElement
    if (!p) return false
    return [...p.childNodes].some((n) =>
      (n.nodeType === 3 && n.textContent.trim().length > 1) ||
      (n.nodeType === 1 && n !== el && !n.matches('a[href],button') && n.textContent.trim().length > 1))
  }

  out.interactiveCount = interactive.length
  const hits = interactive.map((el) => {
    const r = el.getBoundingClientRect()
    const b = pseudoBox(el, r)
    return { sel: label(el), w: Math.round(b.w), h: Math.round(b.h), exempt: inlineExempt(el),
             text: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 28) }
  }).filter((x) => x.w < 24 || x.h < 24)
  out.hitAreaFails = hits.filter((x) => !x.exempt).map((x) => `${x.sel} ${x.w}x${x.h} "${x.text}"`)
  out.hitAreaInlineExempt = hits.filter((x) => x.exempt).map((x) => `${x.sel} ${x.w}x${x.h} "${x.text}"`)

  // ---------------------------------------------------------------
  // 3. Reflow — WCAG 1.4.10. No horizontal scroll at the tested width.
  // ---------------------------------------------------------------
  out.innerWidth = window.innerWidth
  out.scrollWidth = document.documentElement.scrollWidth
  out.reflowOverflow = out.scrollWidth > out.innerWidth + 1
  if (out.reflowOverflow) {
    out.overflowingEls = [...document.querySelectorAll('body *')].filter(visible)
      .filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1)
      .slice(0, 8).map((el) => `${label(el)} right=${Math.round(el.getBoundingClientRect().right)}`)
  }

  // Scroll the page so lazy/intersection content mounts, then re-check width.
  const h = document.documentElement.scrollHeight
  for (let y = 0; y < h; y += Math.round(window.innerHeight / 2)) {
    window.scrollTo({ top: y, behavior: 'instant' })
    await sleep(70)
  }
  await sleep(400)
  out.scrollWidthAfterPass = document.documentElement.scrollWidth
  out.reflowOverflowAfterPass = out.scrollWidthAfterPass > out.innerWidth + 1
  window.scrollTo({ top: 0, behavior: 'instant' })

  // ---------------------------------------------------------------
  // 4. Focusable content inside an aria-hidden subtree — the defect that
  //    put invisible CTAs in the lab's tab order.
  // ---------------------------------------------------------------
  out.focusableInAriaHidden = [...document.querySelectorAll('[aria-hidden="true"],[aria-hidden=""]')]
    .flatMap((h) => [...h.querySelectorAll('a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"])')])
    .map(label)

  // ---------------------------------------------------------------
  // 5. The hero name must stay on one line per word and never break
  //    mid-word. MICHAEL measures 7.42x its font-size; when the size
  //    tracked the viewport rather than its own column it wanted 926px
  //    inside a 604px column and split across two lines at every common
  //    desktop width. Measure the nowrap width against the column so this
  //    fails on the cause, not on a screenshot someone has to eyeball.
  // ---------------------------------------------------------------
  const copy = document.querySelector('.mash-hero-copy')
  const nameSpans = [...document.querySelectorAll('.mash-hero h1 span')]
  out.heroName = []
  if (copy && nameSpans.length) {
    const cw = copy.getBoundingClientRect().width
    out.heroName = nameSpans.map((s) => {
      const cs = getComputedStyle(s)
      const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 0.88
      const lines = Math.round(s.getBoundingClientRect().height / lh)
      const p = document.createElement('span')
      p.textContent = s.textContent
      p.style.cssText = `position:absolute;visibility:hidden;white-space:nowrap;display:inline-block;` +
        `font-family:${cs.fontFamily};font-size:${cs.fontSize};font-weight:${cs.fontWeight};` +
        `letter-spacing:${cs.letterSpacing};text-transform:${cs.textTransform};font-style:${cs.fontStyle}`
      document.body.appendChild(p)
      const tw = p.getBoundingClientRect().width
      p.remove()
      return { word: s.textContent, lines, fits: tw <= cw + 0.5, overflowPx: Math.round(tw - cw) }
    })
  }
  out.heroNameFails = out.heroName.filter((n) => n.lines > 1 || !n.fits)
    .map((n) => `"${n.word}" ${n.lines} line(s), ${n.overflowPx > 0 ? `overflows column by ${n.overflowPx}px` : 'fits'}`)

  // A colour syntax this probe cannot parse must surface, not silently score 0.
  out.unknownColorSyntax = [...new Set(unknownColor)]

  out.PASS = []
  if (!out.heroName.length) out.PASS.push('heroNameNotFound')
  if (out.heroNameFails.length) out.PASS.push('heroName')
  if (out.unknownColorSyntax.length) out.PASS.push('unknownColorSyntax')
  if (out.contrastFails.length) out.PASS.push('contrast')
  if (out.hitAreaFails.length) out.PASS.push('hitArea')
  if (out.reflowOverflow || out.reflowOverflowAfterPass) out.PASS.push('reflow')
  if (out.focusableInAriaHidden.length) out.PASS.push('focusableInAriaHidden')

  return JSON.stringify(out, null, 1)
})()
