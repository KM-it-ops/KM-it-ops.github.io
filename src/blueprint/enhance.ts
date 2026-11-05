/* Blueprint Schematic progressive enhancement. Ported from the Concept 3 prototype app.js. */
/* eslint-disable @typescript-eslint/no-explicit-any */
export function enhance(): void {

  const d = document.documentElement;
  const $ = (s: string, r: ParentNode = document): any => r.querySelector(s);
  const $$ = (s: string, r: ParentNode = document): any[] => [...r.querySelectorAll(s)];
  const mqReduce = matchMedia('(prefers-reduced-motion: reduce)');
  const mqLight = matchMedia('(prefers-color-scheme: light)');
  const mqFine = matchMedia('(hover: hover) and (pointer: fine)');
  const KEY = 'kmBlueprintPaper';
  let reduce = mqReduce.matches;
  d.classList.add('app');

  /* ---------- paper (theme) toggle ---------- */
  const paper = $('#paper');
  const saved = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
  function applyTheme(t: string, save: boolean) {
    d.setAttribute('data-theme', t);
    paper.setAttribute('aria-pressed', String(t === 'light'));
    if (save) { try { localStorage.setItem(KEY, t); } catch {} }
  }
  paper.hidden = false;
  applyTheme(d.getAttribute('data-theme') || (mqLight.matches ? 'light' : 'dark'), false);
  paper.addEventListener('click', () => applyTheme(d.getAttribute('data-theme') === 'light' ? 'dark' : 'light', true));
  mqLight.addEventListener('change', (e: any) => { if (!saved()) applyTheme(e.matches ? 'light' : 'dark', false); });

  /* ---------- sheet reveal (IntersectionObserver) ---------- */
  const sheets = $$('.sheet');
  const revealAll = () => sheets.forEach((s: any) => s.classList.add('in'));
  let revealIO: IntersectionObserver | null = null;
  function setupReveal() {
    if (reduce || !('IntersectionObserver' in window)) { revealAll(); return; }
    const vh = innerHeight;
    sheets.forEach((s: any) => { const r = s.getBoundingClientRect(); if (r.top < vh * 0.92) s.classList.add('in'); });
    d.classList.add('rv-on');
    revealIO = new IntersectionObserver((es: any) => {
      es.forEach((e: any) => { if (e.isIntersecting) { e.target.classList.add('in'); revealIO!.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.04 });
    sheets.forEach((s: any) => { if (!s.classList.contains('in')) revealIO!.observe(s); });
  }

  /* ---------- sheet index: current sheet ---------- */
  const navLinks = $$('.index-nav a');
  if ('IntersectionObserver' in window) {
    const cur = new IntersectionObserver((es: any) => {
      es.forEach((e: any) => {
        if (!e.isIntersecting) return;
        navLinks.forEach((a: any) => a.getAttribute('href') === '#' + e.target.id ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'));
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sheets.forEach((s: any) => cur.observe(s));
  }

  /* ---------- deep grid parallax (scroll, rAF, transform only) ---------- */
  const deep = $('.deep');
  let pxTick = false;
  function onScroll() {
    if (reduce || pxTick) return;
    pxTick = true;
    requestAnimationFrame(() => { deep.style.transform = 'translate3d(0,' + (-(scrollY * 0.06) % 120).toFixed(1) + 'px,0)'; pxTick = false; });
  }
  addEventListener('scroll', onScroll, { passive: true });

  /* ---------- decorative measuring crosshair (aria-hidden) ---------- */
  const cover = $('#sheet-01'), xh = $('.xhair'), xhR = $('.xh-r');
  let xhRect: DOMRect | null = null, xhTick = false, xhX = 0, xhY = 0;
  cover.addEventListener('pointerenter', (e: any) => { if (e.pointerType !== 'mouse' || reduce || !mqFine.matches) return; xhRect = cover.getBoundingClientRect(); xh.classList.add('on'); }, { passive: true });
  cover.addEventListener('pointermove', (e: any) => {
    if (!xhRect || e.pointerType !== 'mouse') return;
    xhX = e.clientX - xhRect.left; xhY = e.clientY - xhRect.top;
    if (xhTick) return; xhTick = true;
    requestAnimationFrame(() => {
      xh.style.setProperty('--x', xhX + 'px'); xh.style.setProperty('--y', xhY + 'px');
      xhR.textContent = 'X ' + String(Math.round(xhX)).padStart(4, '0') + ' · Y ' + String(Math.round(xhY)).padStart(4, '0');
      xhTick = false;
    });
  }, { passive: true });
  const xhOff = () => { xhRect = null; xh.classList.remove('on'); };
  cover.addEventListener('pointerleave', xhOff, { passive: true });
  addEventListener('scroll', () => { if (xhRect) xhRect = cover.getBoundingClientRect(); }, { passive: true });

  /* ---------- skills → evidence → lanes schematic ---------- */
  const schem = $('#schem'), cols = $('.schem-cols', schem), svg = $('.wires', schem);
  const panel = $('#schem-panel'), pKind = $('#panel-kind'), pTitle = $('#panel-title'), pBody = $('#panel-body'), pClear = $('#schem-clear');
  const N = new Map<string, any>();
  $$('.ni', schem).forEach((li: any) => {
    const id = li.dataset.id;
    const btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'node'; btn.id = 'b-' + id;
    btn.setAttribute('aria-pressed', 'false'); btn.setAttribute('aria-describedby', 'schem-hint');
    const nn = $('.nn', li), lvl = $('.lvl', li);
    btn.append(nn); if (lvl) btn.append(lvl);
    li.prepend(btn);
    li.childNodes.forEach((n: any) => { if (n.nodeType === 3) n.remove(); });
    N.set(id, {
      id, li, btn, name: nn.textContent, kind: li.dataset.kind, level: li.dataset.level || '', l: li.dataset.l || '',
      note: ($('.note', li) || {}).textContent || '', connText: ($('.conn', li) || {}).textContent || '',
      href: li.dataset.href || '', to: (li.dataset.to || '').split(/\s+/).filter(Boolean), from: []
    });
  });
  const edges: any[] = [];
  N.forEach((n: any) => n.to.forEach((t: any) => { const m = N.get(t); if (m) { m.from.push(n.id); edges.push({ a: n.id, b: t, cls: n.l }); } }));
  const colLists = $$('.nodes', schem).map((ol: any) => $$('.node', ol));
  colLists.forEach((list: any) => list.forEach((b: any, i: number) => b.tabIndex = i === 0 ? 0 : -1));
  panel.hidden = false;

  const SVGNS = 'http://www.w3.org/2000/svg';
  edges.forEach((e: any) => {
    const p = document.createElementNS(SVGNS, 'path');
    p.setAttribute('class', 'wire ' + (e.cls === 'acad' ? 'acad' : e.cls === 'exp' ? 'exp' : ''));
    svg.append(p); e.el = p;
  });
  function layout() {
    const base = cols.getBoundingClientRect();
    const rects = new Map<string, DOMRect>();
    N.forEach((n: any) => rects.set(n.id, n.btn.getBoundingClientRect())); // batch reads
    svg.setAttribute('viewBox', '0 0 ' + base.width.toFixed(0) + ' ' + base.height.toFixed(0));
    edges.forEach((e: any) => {                                                // then writes
      const A = rects.get(e.a)!, B = rects.get(e.b)!;
      let dd: string;
      if (B.left >= A.right - 2) {
        const x1 = A.right - base.left, y1 = A.top + A.height / 2 - base.top, x2 = B.left - base.left, y2 = B.top + B.height / 2 - base.top, mx = (x1 + x2) / 2;
        dd = `M${x1.toFixed(1)} ${y1.toFixed(1)}C${mx.toFixed(1)} ${y1.toFixed(1)} ${mx.toFixed(1)} ${y2.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
      } else {
        const x1 = A.left + A.width / 2 - base.left, y1 = A.bottom - base.top, x2 = B.left + B.width / 2 - base.left, y2 = B.top - base.top, my = (y1 + y2) / 2;
        dd = `M${x1.toFixed(1)} ${y1.toFixed(1)}C${x1.toFixed(1)} ${my.toFixed(1)} ${x2.toFixed(1)} ${my.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
      }
      e.el.setAttribute('d', dd);
    });
  }
  let layTick = false;
  const relayout = () => { if (layTick) return; layTick = true; requestAnimationFrame(() => { layout(); layTick = false; }); };
  if ('ResizeObserver' in window) new ResizeObserver(relayout).observe(cols); else addEventListener('resize', relayout, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
  relayout();

  let pinned: string | null = null;
  function closure(id: string, dir: string, set: Set<string>): Set<string> { N.get(id)[dir].forEach((x: any) => { if (!set.has(x)) { set.add(x); closure(x, dir, set); } }); return set; }
  function paint(id: string | null) {
    const lit = new Set<string>();
    if (id) { lit.add(id); closure(id, 'to', lit); closure(id, 'from', lit); }
    schem.classList.toggle('has-active', !!id);
    N.forEach((n: any) => { n.btn.classList.toggle('lit', lit.has(n.id)); n.btn.classList.toggle('act', n.id === id); });
    edges.forEach((e: any) => e.el.classList.toggle('on', !!id && lit.has(e.a) && lit.has(e.b)));
    renderPanel(id);
  }
  function renderPanel(id: string | null) {
    pBody.textContent = '';
    panel.classList.toggle('idle', !id);
    if (!id) {
      pKind.textContent = 'Detail callout'; pTitle.textContent = 'Select a node';
      const p = document.createElement('p'); p.textContent = 'Pick a skill to see the public evidence behind it, or pick a project to see which skills and lane it belongs to.'; pBody.append(p);
      return;
    }
    const n = N.get(id);
    pKind.textContent = n.kind + (n.level ? ' · ' + n.level : '');
    pTitle.textContent = n.name;
    const note = document.createElement('p'); note.textContent = n.note; pBody.append(note);
    const nb = [...n.from, ...n.to];
    if (nb.length) {
      const h = document.createElement('p'); h.className = 'lbl'; h.textContent = 'Connects to (' + nb.length + ')'; pBody.append(h);
      const ul = document.createElement('ul');
      nb.forEach((x: any) => {
        const m = N.get(x), li = document.createElement('li'), b = document.createElement('button');
        b.type = 'button'; b.className = 'chipbtn'; b.dataset.go = x;
        const t = document.createElement('span'); t.textContent = m.name;
        const k = document.createElement('span'); k.className = 'lbl'; k.textContent = m.level || m.kind;
        b.append(t, k); li.append(b); ul.append(li);
      });
      pBody.append(ul);
    } else if (n.connText) {
      const p = document.createElement('p'); p.className = 'lbl'; p.textContent = n.connText; pBody.append(p);
    }
    const links = n.href ? [n] : n.to.concat(n.from).map((x: any) => N.get(x)).filter((m: any) => m.href && m.href.startsWith('http'));
    links.slice(0, 4).forEach((m: any) => {
      const a = document.createElement('a'); a.className = 'open'; a.href = m.href;
      a.textContent = m === n ? (m.href.startsWith('http') ? 'Open repo →' : 'Go to the write-up →') : 'Open ' + m.name + ' repo →';
      const p = document.createElement('p'); p.append(a); pBody.append(p);
    });
  }
  function pin(id: string, focusNode?: boolean) {
    pinned = pinned === id ? null : id;
    N.forEach((n: any) => n.btn.setAttribute('aria-pressed', String(n.id === pinned)));
    pClear.disabled = !pinned;
    paint(pinned);
    if (focusNode && pinned) { rove(N.get(pinned).btn); N.get(pinned).btn.focus(); }
  }
  function clear() { pinned = null; N.forEach((n: any) => n.btn.setAttribute('aria-pressed', 'false')); pClear.disabled = true; paint(null); }
  function rove(btn: any) { colLists.forEach((l: any) => { if (l.includes(btn)) l.forEach((b: any) => b.tabIndex = b === btn ? 0 : -1); }); }
  // Preview on keyboard focus and real mouse hover only. Touch/pen taps go straight to pin on click,
  // so the panel never resizes under a finger between touchstart and click.
  let pointerFocus = 0;
  N.forEach((n: any) => {
    n.btn.addEventListener('pointerdown', () => { pointerFocus = Date.now(); }, { passive: true });
    n.btn.addEventListener('click', () => { rove(n.btn); pin(n.id); });
    n.btn.addEventListener('focus', () => { rove(n.btn); if (!pinned && Date.now() - pointerFocus > 600) paint(n.id); });
    n.btn.addEventListener('pointerenter', (e: any) => { if (e.pointerType === 'mouse' && !pinned) paint(n.id); }, { passive: true });
    n.btn.addEventListener('pointerleave', (e: any) => { if (e.pointerType === 'mouse' && !pinned && document.activeElement !== n.btn && !panel.contains(document.activeElement)) paint(null); }, { passive: true });
  });
  cols.addEventListener('focusout', (e: any) => { if (!pinned && !cols.contains(e.relatedTarget) && !panel.contains(e.relatedTarget)) paint(null); });
  panel.addEventListener('focusout', (e: any) => { if (!pinned && !panel.contains(e.relatedTarget) && !cols.contains(e.relatedTarget)) paint(null); });
  pBody.addEventListener('click', (e: any) => { const b = e.target.closest('[data-go]'); if (!b) return; pinned = null; pin(b.dataset.go, true); });
  pClear.addEventListener('click', () => { const was = pinned; clear(); if (was) N.get(was).btn.focus(); });
  schem.addEventListener('keydown', (e: any) => {
    if (e.key === 'Escape') { if (pinned || schem.classList.contains('has-active')) { e.preventDefault(); const was = pinned; clear(); if (was && panel.contains(document.activeElement)) N.get(was).btn.focus(); } return; }
    const b = e.target.closest('.node'); if (!b) return;
    const ci = colLists.findIndex((l: any) => l.includes(b)), list = colLists[ci], i = list.indexOf(b);
    let t = null;
    if (e.key === 'ArrowDown') t = list[Math.min(i + 1, list.length - 1)];
    else if (e.key === 'ArrowUp') t = list[Math.max(i - 1, 0)];
    else if (e.key === 'Home') t = list[0];
    else if (e.key === 'End') t = list[list.length - 1];
    else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const nc = colLists[ci + (e.key === 'ArrowRight' ? 1 : -1)]; if (!nc) return;
      const n = N.get(b.id.slice(2)), link = (e.key === 'ArrowRight' ? n.to : n.from)[0];
      t = link ? N.get(link).btn : nc[Math.min(i, nc.length - 1)];
    }
    if (t) { e.preventDefault(); rove(t); t.focus(); }
  });

  /* ---------- exploded assembly ---------- */
  const asm = $('.asm'), stage = $('#asm-stage'), range = $('#explode'), allBtn = $('#parts-all');
  const parts = $$('#parts .part'), dets = parts.map((p: any) => $('details', p)), sums = dets.map((x: any) => $('summary', x));
  $('.asm-controls').hidden = false;
  const pws = parts.map((p: any, i: number) => {
    const w = document.createElement('div'); w.className = 'pw' + (p.classList.contains('part-arch') ? ' arch' : ''); w.style.setProperty("--i", String(i));
    w.innerHTML = '<span class="plate"></span><span class="pl"><span class="ptick"></span><span class="pcode"></span></span>';
    $('.pcode', w).textContent = $('.pno', p).textContent + (p.classList.contains('part-arch') ? ' · Archived' : '');
    w.addEventListener('click', () => { if (dragMoved) return; openPart(i); });
    w.addEventListener('mouseenter', () => mark(i), true);
    stage.append(w); return w;
  });
  const setEx = (v: number) => { stage.style.setProperty('--ex', (v / 100).toFixed(2)); };
  setEx(+range.value);
  range.addEventListener('input', () => setEx(+range.value));
  let current = -1;
  function mark(i: number) {
    current = i;
    pws.forEach((w: any, j: number) => w.classList.toggle('on', j === i));
    parts.forEach((p: any, j: number) => p.classList.toggle('hl', j === i));
  }
  function openPart(i: number) {
    dets[i].open = true; mark(i);
    sums[i].focus({ preventScroll: true });
    parts[i].scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
  }
  dets.forEach((x: any, i: number) => x.addEventListener('toggle', () => {
    if (x.open) mark(i); else if (current === i) { const o = dets.findIndex((y: any) => y.open); mark(o); }
    allBtn.setAttribute('aria-pressed', String(dets.every((y: any) => y.open)));
  }));
  sums.forEach((s: any, i: number) => {
    s.addEventListener('focus', () => mark(i));
    s.addEventListener('mouseenter', () => mark(i));
  });
  $('#parts').addEventListener('mouseleave', () => mark(dets.findIndex((y: any) => y.open)));
  $('#parts').addEventListener('keydown', (e: any) => {
    const i = sums.indexOf(e.target); if (i < 0) return;
    let t = -1;
    if (e.key === 'ArrowDown') t = Math.min(i + 1, sums.length - 1);
    else if (e.key === 'ArrowUp') t = Math.max(i - 1, 0);
    else if (e.key === 'Home') t = 0; else if (e.key === 'End') t = sums.length - 1;
    if (t >= 0) { e.preventDefault(); sums[t].focus(); }
  });
  allBtn.addEventListener('click', () => {
    const open = !dets.every((y: any) => y.open);
    dets.forEach((y: any) => y.open = open); allBtn.setAttribute('aria-pressed', String(open));
  });
  // drag to explode (mouse / pen). Touch scrolls the page; touch users use the slider or tap a part.
  let drag: any = null, dragMoved = false;
  stage.addEventListener('pointerdown', (e: any) => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    drag = { y: e.clientY, v: +range.value, id: e.pointerId }; dragMoved = false;
  });
  stage.addEventListener('pointermove', (e: any) => {
    if (!drag) return;
    const dy = e.clientY - drag.y;
    if (!dragMoved && Math.abs(dy) > 4) { dragMoved = true; asm.classList.add('dragging'); try { stage.setPointerCapture(drag.id); } catch {} }
    if (!dragMoved) return;
    const v = Math.max(0, Math.min(100, Math.round(drag.v + dy / 3)));
    if (v !== +range.value) { range.value = v; requestAnimationFrame(() => setEx(v)); }
  }, { passive: true });
  const endDrag = () => { drag = null; asm.classList.remove('dragging'); setTimeout(() => { dragMoved = false; }, 0); };
  stage.addEventListener('pointerup', endDrag); stage.addEventListener('pointercancel', endDrag);

  /* ---------- print: plot every part open ---------- */
  let preOpen: boolean[] | null = null;
  addEventListener('beforeprint', () => { preOpen = dets.map((x: any) => x.open); dets.forEach((x: any) => x.open = true); revealAll(); });
  addEventListener('afterprint', () => { if (preOpen) dets.forEach((x: any, i: number) => x.open = preOpen![i]); });

  /* ---------- reduced motion: react live ---------- */
  function setMotion() {
    reduce = mqReduce.matches;
    d.classList.toggle('motion-ok', !reduce);
    if (reduce) { revealAll(); deep.style.transform = ''; xhOff(); }
  }
  mqReduce.addEventListener('change', setMotion);
  setMotion();
  setupReveal();

  /* ---------- contact form: send via fetch (falls back to a native POST with no JS) ---------- */
  const form = $('.bp-form') as HTMLFormElement | null, status = $('#bp-form-status');
  if (form) form.addEventListener('submit', async (ev: Event) => {
    ev.preventDefault();
    const btn = $('button[type=submit]', form); btn.disabled = true; status.textContent = 'Sending…';
    try {
      const res = await fetch(form.action, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(form) as any)) });
      const reply = await res.json();
      if (res.ok && reply.success) { form.reset(); status.textContent = 'Thanks. Your message is on its way, and I will reply by email.'; }
      else status.textContent = 'Not sent: ' + (reply.message || 'the form service refused it') + '. Try again or use LinkedIn.';
    } catch { status.textContent = 'Not sent: the network request failed. Try again or use LinkedIn.'; }
    btn.disabled = false;
  });
}
