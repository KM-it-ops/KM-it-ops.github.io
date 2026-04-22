/* =========================================
   Mahmoud (Michael) Al Kurdi — script.js
   ========================================= */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  const isTouch = window.matchMedia('(hover: none)').matches;

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    consoleBanner();
    initHeroCanvas();
    initTypingEffect();
    initScrollReveal();
    initNavbar();
    initScrollProgress();
    initMobileMenu();
    initScrollIndicator();
    initCommandPalette();
    initTerminal();
    initKonami();
    initCursorSpotlight();
    initMagnetic();
    initTilt();
  }

  /* ==============================================
     CONSOLE BANNER
     ============================================== */
  function consoleBanner() {
    try {
      const art = [
        '',
        '  mahmoud ("michael") al kurdi',
        '  github.com/KM-it-ops',
        '',
        '  ⌘K · /  — command palette',
        '  ↓      — interactive shell at #shell',
        '',
      ].join('\n');
      const style = [
        'color:#7cf0c1',
        'font-family:"JetBrains Mono",monospace',
        'font-size:12px',
        'line-height:1.4',
      ].join(';');
      // eslint-disable-next-line no-console
      console.log('%c' + art, style);
    } catch (_) { /* no-op */ }
  }

  /* ==============================================
     HERO CANVAS — constellation
     ============================================== */
  function initHeroCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas || prefersReducedMotion) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0, height = 0, dpr = 1;
    let particles = [];
    const mouse = { x: -9999, y: -9999 };
    const COUNT_BASE = 80;
    const CONNECT = 130;
    const MOUSE_DIST = 170;
    let raf = 0;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function create() {
      particles = [];
      const count = Math.min(
        COUNT_BASE,
        Math.floor((width * height) / 14000)
      );
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.4 + 0.4,
          a: Math.random() * 0.5 + 0.25,
          hue: Math.random() > 0.6 ? 'accent' : 'violet',
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < CONNECT) {
            const alpha = (1 - d / CONNECT) * 0.12;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(124, 240, 193, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const md = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < MOUSE_DIST && md > 0) {
          const f = ((MOUSE_DIST - md) / MOUSE_DIST) * 0.03;
          p.vx += (mdx / md) * f;
          p.vy += (mdy / md) * f;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.995;
        p.vy *= 0.995;

        if (p.x < -5) p.x = width + 5;
        if (p.x > width + 5) p.x = -5;
        if (p.y < -5) p.y = height + 5;
        if (p.y > height + 5) p.y = -5;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        const color =
          p.hue === 'accent'
            ? `rgba(124, 240, 193, ${p.a})`
            : `rgba(176, 124, 255, ${p.a * 0.85})`;
        ctx.fillStyle = color;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);

    let rt;
    window.addEventListener('resize', () => {
      clearTimeout(rt);
      rt = setTimeout(() => { resize(); create(); }, 120);
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            if (!raf) raf = requestAnimationFrame(draw);
          } else {
            if (raf) { cancelAnimationFrame(raf); raf = 0; }
          }
        });
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    resize();
    create();
    draw();
  }

  /* ==============================================
     TYPING EFFECT (short, understated)
     ============================================== */
  function initTypingEffect() {
    const el = document.getElementById('heroTyped');
    if (!el) return;

    const phrases = [
      'Mahmoud Al Kurdi. a.k.a. Michael.',
      'security engineer · python · ml',
      'ships detection tooling & llm expert systems',
      'Charlotte, NC · remote',
    ];

    if (prefersReducedMotion) {
      el.textContent = phrases[0];
      return;
    }

    let pi = 0, ci = 0, deleting = false;
    const TYPE = 55, DEL = 28, END = 1800, START = 400;

    function tick() {
      const cur = phrases[pi];
      if (!deleting) {
        ci++;
        el.textContent = cur.substring(0, ci);
        if (ci === cur.length) {
          setTimeout(() => { deleting = true; tick(); }, END);
          return;
        }
        setTimeout(tick, TYPE);
      } else {
        ci--;
        el.textContent = cur.substring(0, ci);
        if (ci === 0) {
          deleting = false;
          pi = (pi + 1) % phrases.length;
          setTimeout(tick, START);
          return;
        }
        setTimeout(tick, DEL);
      }
    }
    setTimeout(tick, 700);
  }

  /* ==============================================
     SCROLL REVEAL
     ============================================== */
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    if (prefersReducedMotion) {
      reveals.forEach((el) => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach((el) => observer.observe(el));
  }

  /* ==============================================
     NAV
     ============================================== */
  function initNavbar() {
    const nav = document.getElementById('navbar');
    const links = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('main > section[id]');
    if (!nav) return;

    let ticking = false;
    function update() {
      ticking = false;
      if (window.scrollY > 10) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');

      let current = '';
      sections.forEach((s) => {
        const top = s.offsetTop - 120;
        if (window.scrollY >= top) current = s.getAttribute('id');
      });
      links.forEach((l) => {
        l.classList.remove('active');
        if (l.getAttribute('href') === '#' + current) l.classList.add('active');
      });
    }
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ==============================================
     SCROLL PROGRESS
     ============================================== */
  function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;
    let ticking = false;
    function update() {
      ticking = false;
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      const pct = total > 0 ? window.scrollY / total : 0;
      bar.style.transform = `scaleX(${pct.toFixed(4)})`;
    }
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ==============================================
     SCROLL INDICATOR
     ============================================== */
  function initScrollIndicator() {
    const btn = document.querySelector('.scroll-indicator');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const target = document.getElementById('about');
      if (target) target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ==============================================
     MOBILE MENU
     ============================================== */
  function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const menu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileOverlay');
    if (!hamburger || !menu || !overlay) return;

    const links = menu.querySelectorAll('a');

    function toggle() {
      const open = menu.classList.contains('open');
      menu.classList.toggle('open');
      overlay.classList.toggle('open');
      hamburger.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(!open));
      document.body.style.overflow = open ? '' : 'hidden';
    }
    function close() {
      menu.classList.remove('open');
      overlay.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', toggle);
    overlay.addEventListener('click', close);
    links.forEach((l) => l.addEventListener('click', close));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) close();
    });
  }

  /* ==============================================
     COMMAND PALETTE
     ============================================== */
  const COMMANDS = [
    { id: 'nav-about',     title: 'Go to About',       hint: '#about',    icon: '→', section: 'navigate', run: () => scrollTo('about') },
    { id: 'nav-work',      title: 'Go to Work',        hint: '#work',     icon: '→', section: 'navigate', run: () => scrollTo('work') },
    { id: 'nav-stack',     title: 'Go to Stack',       hint: '#stack',    icon: '→', section: 'navigate', run: () => scrollTo('stack') },
    { id: 'nav-log',       title: 'Go to Log',         hint: '#log',      icon: '→', section: 'navigate', run: () => scrollTo('log') },
    { id: 'nav-shell',     title: 'Go to Shell',       hint: '#shell',    icon: '→', section: 'navigate', run: () => scrollTo('shell') },
    { id: 'nav-contact',   title: 'Go to Contact',     hint: '#contact',  icon: '→', section: 'navigate', run: () => scrollTo('contact') },
    { id: 'top',           title: 'Scroll to top',     hint: 'home',      icon: '↑', section: 'navigate', run: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },

    { id: 'email',         title: 'Send email',                       hint: 'kurdi.michael.it@gmail.com',    icon: '@',   section: 'contact', run: () => window.location.href = 'mailto:kurdi.michael.it@gmail.com' },
    { id: 'github',        title: 'Open GitHub',                      hint: 'github.com/KM-it-ops',          icon: 'gh',  section: 'contact', run: () => openExt('https://github.com/KM-it-ops') },
    { id: 'linkedin',      title: 'Open LinkedIn',                    hint: 'linkedin.com/in/michael-kurdi', icon: 'in',  section: 'contact', run: () => openExt('https://linkedin.com/in/michael-kurdi') },
    { id: 'resume-pdf',    title: 'Download resume.pdf',              hint: 'PDF',                           icon: '↓',   section: 'links',   run: () => openExt('assets/Mahmoud_Al_Kurdi_Resume_2026.pdf') },
    { id: 'resume-web',    title: 'Open web resume',                  hint: '/resume',                       icon: '»',   section: 'links',   run: () => { window.location.href = 'resume/index.html'; } },

    { id: 'proj-stockpath', title: 'StockPath Navigator',             hint: 'trading expert system',         icon: '◈',   section: 'work',    run: () => openExt('https://github.com/KM-it-ops/StockPath-Navigator') },
    { id: 'proj-vulntrack', title: 'VulnTrack',                       hint: 'vuln management dashboard',     icon: '◈',   section: 'work',    run: () => openExt('https://github.com/KM-it-ops/Vulnerability-Management-Mini-Program') },
    { id: 'proj-phishing',  title: 'Phishing Classifier',             hint: 'tf-idf + random forest',        icon: '◈',   section: 'work',    run: () => openExt('https://github.com/KM-it-ops/phishing-email-classifier') },
    { id: 'proj-log',       title: 'Log Anomaly Engine',              hint: 'rules + statistics',            icon: '◈',   section: 'work',    run: () => openExt('https://github.com/KM-it-ops/security-log-anomaly-detection') },

    { id: 'copy-email',    title: 'Copy email',                       hint: 'kurdi.michael.it@gmail.com',    icon: '⧉',   section: 'utility', run: () => copyText('kurdi.michael.it@gmail.com', 'email copied') },
    { id: 'copy-link',     title: 'Copy link',                        hint: window.location.href,            icon: '⧉',   section: 'utility', run: () => copyText(window.location.href, 'link copied') },
    { id: 'view-source',   title: 'View source',                      hint: 'KM-it-ops/KM-it-ops.github.io', icon: '</>', section: 'utility', run: () => openExt('https://github.com/KM-it-ops/KM-it-ops.github.io') },
  ];

  function scrollTo(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  }
  function openExt(url) { window.open(url, '_blank', 'noopener,noreferrer'); }
  function copyText(text, msg) {
    try {
      navigator.clipboard.writeText(text).then(() => toast(msg));
    } catch (_) { toast('copy failed'); }
  }

  let toastTimer;
  function toast(msg) {
    let el = document.getElementById('kToast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'kToast';
      el.setAttribute('role', 'status');
      el.style.cssText = [
        'position:fixed','bottom:24px','left:50%',
        'transform:translateX(-50%) translateY(20px)',
        'background:#0f1220','color:#f5f7fb',
        'padding:10px 16px','border-radius:8px',
        'border:1px solid rgba(124,240,193,0.3)',
        'font-family:"JetBrains Mono",monospace',
        'font-size:0.85rem','z-index:1200','opacity:0',
        'transition:opacity .2s ease, transform .25s ease',
        'pointer-events:none',
        'box-shadow:0 20px 60px rgba(0,0,0,0.45)',
      ].join(';');
      document.body.appendChild(el);
    }
    el.textContent = msg;
    requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateX(-50%) translateY(0)';
    });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateX(-50%) translateY(20px)';
    }, 1800);
  }

  function initCommandPalette() {
    const root = document.getElementById('cmdk');
    const input = document.getElementById('cmdkInput');
    const list = document.getElementById('cmdkList');
    const backdrop = document.getElementById('cmdkBackdrop');
    const trigger = document.getElementById('cmdkTrigger');
    const heroTrigger = document.getElementById('ctaCmdk');
    if (!root || !input || !list) return;

    let filtered = COMMANDS.slice();
    let selected = 0;

    function open() {
      root.hidden = false;
      document.body.style.overflow = 'hidden';
      input.value = '';
      filtered = COMMANDS.slice();
      selected = 0;
      render();
      setTimeout(() => input.focus(), 20);
    }
    function close() {
      root.hidden = true;
      document.body.style.overflow = '';
    }
    function score(q, s) {
      q = q.toLowerCase(); s = s.toLowerCase();
      if (!q) return 1;
      if (s.includes(q)) return 2 - (s.indexOf(q) / s.length);
      let qi = 0;
      for (let i = 0; i < s.length && qi < q.length; i++) {
        if (s[i] === q[qi]) qi++;
      }
      return qi === q.length ? 0.5 : 0;
    }
    function filter(q) {
      if (!q) { filtered = COMMANDS.slice(); return; }
      filtered = COMMANDS
        .map((c) => ({ c, s: Math.max(score(q, c.title), score(q, c.hint || ''), score(q, c.section || '') * 0.8) }))
        .filter((x) => x.s > 0)
        .sort((a, b) => b.s - a.s)
        .map((x) => x.c);
    }
    function render() {
      list.innerHTML = '';
      if (!filtered.length) {
        const empty = document.createElement('li');
        empty.className = 'cmdk-empty';
        empty.textContent = 'no matches — try "work" or "email"';
        list.appendChild(empty);
        return;
      }
      filtered.forEach((c, i) => {
        const li = document.createElement('li');
        li.className = 'cmdk-item';
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', String(i === selected));
        li.innerHTML =
          '<span class="cmdk-icon">' + escapeHtml(c.icon) + '</span>' +
          '<span class="cmdk-text">' +
            '<div class="cmdk-title">' + escapeHtml(c.title) + '</div>' +
            (c.hint ? '<div class="cmdk-hint">' + escapeHtml(c.hint) + '</div>' : '') +
          '</span>' +
          '<span class="cmdk-kbd">' + escapeHtml(c.section || '') + '</span>';
        li.addEventListener('click', () => { run(i); });
        li.addEventListener('mousemove', () => { if (selected !== i) { selected = i; updateSelection(); } });
        list.appendChild(li);
      });
    }
    function updateSelection() {
      list.querySelectorAll('.cmdk-item').forEach((el, i) => {
        const on = i === selected;
        el.setAttribute('aria-selected', String(on));
        if (on) el.scrollIntoView({ block: 'nearest' });
      });
    }
    function run(i) {
      const c = filtered[i];
      if (!c) return;
      close();
      setTimeout(() => { try { c.run(); } catch (_) {} }, 60);
    }

    input.addEventListener('input', () => {
      filter(input.value.trim());
      selected = 0;
      render();
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selected = Math.min(selected + 1, Math.max(0, filtered.length - 1));
        updateSelection();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selected = Math.max(0, selected - 1);
        updateSelection();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        run(selected);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    });

    backdrop.addEventListener('click', close);
    if (trigger) trigger.addEventListener('click', open);
    if (heroTrigger) heroTrigger.addEventListener('click', open);

    document.addEventListener('keydown', (e) => {
      const isMeta = e.metaKey || e.ctrlKey;
      if (isMeta && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        if (root.hidden) open(); else close();
      } else if (e.key === '/') {
        const tag = (document.activeElement && document.activeElement.tagName) || '';
        const editing = document.activeElement && document.activeElement.isContentEditable;
        if (root.hidden && tag !== 'INPUT' && tag !== 'TEXTAREA' && !editing) {
          e.preventDefault();
          open();
        }
      }
    });

    window.__cmdk = { open, close };
  }

  /* ==============================================
     INTERACTIVE TERMINAL
     ============================================== */
  const TERMINAL_COMMANDS = [
    'help', 'about', 'work', 'projects', 'skills', 'stack', 'resume',
    'contact', 'social', 'open', 'github', 'linkedin', 'goto', 'cmdk',
    'palette', 'whoami', 'uname', 'date', 'pwd', 'ls', 'cat', 'echo',
    'theme', 'matrix', 'neofetch', 'clear', 'cls', 'exit',
  ];

  function initTerminal() {
    const body = document.getElementById('itermBody');
    const out = document.getElementById('itermOut');
    const form = document.getElementById('itermForm');
    const input = document.getElementById('itermInput');
    const clockEl = document.getElementById('itermClock');
    if (!body || !out || !form || !input) return;

    const history = [];
    let hIdx = -1;

    if (clockEl) {
      function tickClock() {
        const d = new Date();
        const hh = String(d.getHours()).padStart(2, '0');
        const mm = String(d.getMinutes()).padStart(2, '0');
        const ss = String(d.getSeconds()).padStart(2, '0');
        clockEl.textContent = `${hh}:${mm}:${ss}`;
      }
      tickClock();
      setInterval(tickClock, 1000);
    }

    const BANNER = [
      '',
      'portfolio shell — bash-ish, sandboxed.',
      'type `help` for commands. ↑/↓ history. Tab autocompletes. Ctrl+L clears.',
      '',
    ];

    function write(html, cls) {
      const div = document.createElement('div');
      if (cls) div.className = cls;
      div.innerHTML = html;
      out.appendChild(div);
      body.scrollTop = body.scrollHeight;
    }

    function writeCmd(cmd) {
      write(
        '<span class="iterm-line">' +
          '<span class="term-user">michael</span>' +
          '<span class="term-at">@</span>' +
          '<span class="term-host">kurdi</span>' +
          '<span class="term-path">:~</span>' +
          '<span class="term-sym">$</span>' +
          '<span class="iterm-cmd">' + escapeHtml(cmd) + '</span>' +
        '</span>'
      );
    }

    function row(cmd, desc) {
      return '<div><span class="iterm-ok" style="display:inline-block;min-width:10rem">' +
             escapeHtml(cmd) + '</span><span class="iterm-muted">' +
             escapeHtml(desc) + '</span></div>';
    }

    function help() {
      write(
        '<div><span class="iterm-ok">commands:</span></div>' +
        row('help',         'show this help') +
        row('about',        'short bio') +
        row('work',         'featured projects') +
        row('stack',        'tech stack summary') +
        row('resume',       'download the PDF resume') +
        row('contact',      'email, github, linkedin') +
        row('neofetch',     'system info, terminal-style') +
        row('open <url>',   'open a URL in a new tab') +
        row('goto <id>',    'scroll to a section') +
        row('cmdk',         'open the command palette (⌘K)') +
        row('whoami',       'identify the current user') +
        row('date',         'current date/time') +
        row('echo <text>',  'print text') +
        row('theme',        'cycle accent color') +
        row('matrix',       'matrix rain for 10s') +
        row('clear / cls',  'clear the screen')
      );
    }

    function about() {
      write(
        '<div><span class="iterm-ok">Mahmoud ("Michael") Al Kurdi</span> — security engineer.</div>' +
        '<div class="iterm-muted">CompTIA Security+ · B.S. IT Cybersecurity (SNHU, summa cum laude, 3.96).</div>' +
        '<div class="iterm-muted">8+ yrs cleared, regulated ops (FAA, OSHA, IATA, CBP).</div>' +
        '<div class="iterm-muted">Ships detection code, ML pipelines, and LLM expert systems.</div>' +
        '<div>Location: <span class="iterm-info">Charlotte, NC</span> · Remote: <span class="iterm-ok">yes</span></div>'
      );
    }

    function work() {
      const items = [
        { n: 'StockPath Navigator',     d: 'trading expert system · 17 prompt-eng techniques',  u: 'https://github.com/KM-it-ops/StockPath-Navigator' },
        { n: 'VulnTrack Dashboard',     d: 'Flask + SQLite vulnerability management',           u: 'https://github.com/KM-it-ops/Vulnerability-Management-Mini-Program' },
        { n: 'Phishing Email Classifier', d: 'TF-IDF + Random Forest · 5-fold CV',               u: 'https://github.com/KM-it-ops/phishing-email-classifier' },
        { n: 'Log Anomaly Engine',      d: 'rules + statistics for SOC triage',                 u: 'https://github.com/KM-it-ops/security-log-anomaly-detection' },
      ];
      let html = '<div><span class="iterm-ok">featured:</span></div>';
      items.forEach((it, i) => {
        html += '<div>' +
          '<span class="iterm-info">[' + (i + 1) + ']</span> ' +
          '<a href="' + it.u + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(it.n) + '</a> — ' +
          '<span class="iterm-muted">' + escapeHtml(it.d) + '</span>' +
          '</div>';
      });
      write(html);
    }

    function skills() {
      write(
        '<div><span class="iterm-ok">stack:</span></div>' +
        '<div class="iterm-muted">  languages : python · javascript/ts · bash · sql</div>' +
        '<div class="iterm-muted">  security  : detection eng · incident response · vuln mgmt · access control</div>' +
        '<div class="iterm-muted">  data/ml   : pandas · numpy · scikit-learn · tf-idf · random forest</div>' +
        '<div class="iterm-muted">  frameworks: flask · fastapi · react</div>' +
        '<div class="iterm-muted">  tooling   : git · github actions · docker · linux · regex</div>' +
        '<div class="iterm-muted">  llms      : prompt engineering · react · cot · guardrails</div>'
      );
    }

    function contact() {
      write(
        '<div><span class="iterm-ok">reach:</span></div>' +
        '<div>email    : <a href="mailto:kurdi.michael.it@gmail.com">kurdi.michael.it@gmail.com</a></div>' +
        '<div>github   : <a href="https://github.com/KM-it-ops" target="_blank" rel="noopener noreferrer">github.com/KM-it-ops</a></div>' +
        '<div>linkedin : <a href="https://linkedin.com/in/michael-kurdi" target="_blank" rel="noopener noreferrer">linkedin.com/in/michael-kurdi</a></div>'
      );
    }

    function neofetch() {
      const logo = [
        '        ▄▄▄▄▄▄▄▄▄        ',
        '     ▄██▀       ▀██▄     ',
        '   ▄██   ▄▄▄▄▄▄▄   ██▄   ',
        '  ██   ▄██▀   ▀██▄   ██  ',
        '  ██  ██    *    ██  ██  ',
        '  ██   ▀██▄   ▄██▀   ██  ',
        '   ▀██   ▀▀▀▀▀▀▀   ██▀   ',
        '     ▀██▄       ▄██▀     ',
        '        ▀▀▀▀▀▀▀▀▀        ',
      ].join('\n');

      const info = [
        ['user',   'michael@kurdi'],
        ['os',     'portfolio 1.0.0 (static)'],
        ['shell',  'zsh (sandboxed)'],
        ['wm',     'css grid'],
        ['theme',  'mint/violet/blue on #06070c'],
        ['cpu',    'a few js interpreters'],
        ['memory', 'whatever your browser allots'],
        ['uptime', fmtUptime(performance.now())],
        ['loc',    'Charlotte, NC'],
      ];

      const left = '<pre class="iterm-ascii">' + escapeHtml(logo) + '</pre>';
      let right = '<div style="font-family:var(--font-mono);line-height:1.6">';
      right += '<div><span class="iterm-ok">michael</span><span class="iterm-muted">@</span><span class="iterm-info">kurdi</span></div>';
      right += '<div class="iterm-muted">────────────────────</div>';
      info.forEach(([k, v]) => {
        right += '<div><span class="iterm-ok" style="display:inline-block;min-width:6rem">' +
                 escapeHtml(k) + '</span><span>' + escapeHtml(v) + '</span></div>';
      });
      right += '<div class="iterm-muted" style="margin-top:6px">● ● ●</div>';
      right += '</div>';

      write(
        '<div style="display:flex;gap:1.5rem;flex-wrap:wrap;align-items:flex-start">' +
          '<div style="flex:0 0 auto">' + left + '</div>' +
          '<div style="flex:1 1 240px;min-width:240px">' + right + '</div>' +
        '</div>'
      );
    }

    function fmtUptime(ms) {
      const s = Math.floor(ms / 1000);
      const m = Math.floor(s / 60);
      return (m > 0 ? m + 'm ' : '') + (s % 60) + 's on this tab';
    }

    function openUrl(args) {
      const url = args.join(' ').trim();
      if (!url) { write('<div class="iterm-err">usage: open &lt;url&gt;</div>'); return; }
      const full = /^https?:\/\//.test(url) ? url : 'https://' + url;
      write('<div class="iterm-muted">opening ' + escapeHtml(full) + '…</div>');
      openExt(full);
    }

    function gotoSection(args) {
      const id = (args[0] || '').toLowerCase();
      const valid = ['about', 'work', 'stack', 'log', 'shell', 'contact'];
      if (!valid.includes(id)) {
        write('<div class="iterm-err">unknown section: ' + escapeHtml(id) + '</div>' +
              '<div class="iterm-muted">try: ' + valid.join(', ') + '</div>');
        return;
      }
      scrollTo(id);
      write('<div class="iterm-muted">→ #' + id + '</div>');
    }

    let matrixTimer;
    function matrixRain() {
      if (matrixTimer) { write('<div class="iterm-muted">matrix already running…</div>'); return; }
      write('<div class="iterm-info">matrix rain for 10s — any key to stop.</div>');
      const cv = document.createElement('canvas');
      cv.style.cssText = 'position:fixed;inset:0;z-index:1050;pointer-events:none;background:transparent';
      document.body.appendChild(cv);
      const ctx = cv.getContext('2d');
      let w = cv.width = window.innerWidth;
      let h = cv.height = window.innerHeight;
      const letters = '01▓▒░#$@%&*|/\\';
      const cols = Math.floor(w / 16);
      const drops = Array(cols).fill(1);
      const iv = setInterval(() => {
        ctx.fillStyle = 'rgba(6,7,12,0.2)';
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = '#7cf0c1';
        ctx.font = '14px JetBrains Mono, monospace';
        for (let i = 0; i < drops.length; i++) {
          const text = letters.charAt(Math.floor(Math.random() * letters.length));
          ctx.fillText(text, i * 16, drops[i] * 16);
          if (drops[i] * 16 > h && Math.random() > 0.975) drops[i] = 0;
          drops[i]++;
        }
      }, 50);
      function stop() {
        clearInterval(iv); cv.remove(); matrixTimer = null;
        document.removeEventListener('keydown', stop);
        write('<div class="iterm-muted">matrix off.</div>');
      }
      matrixTimer = setTimeout(stop, 10000);
      document.addEventListener('keydown', stop, { once: true });
      window.addEventListener('resize', () => {
        w = cv.width = window.innerWidth;
        h = cv.height = window.innerHeight;
      }, { once: true });
    }

    function toggleTheme() {
      const root = document.documentElement;
      const current = getComputedStyle(root).getPropertyValue('--accent').trim();
      const palette = ['#7cf0c1', '#7aa2ff', '#b07cff', '#ff7ac6', '#ffb547'];
      const idx = palette.indexOf(current);
      const next = palette[(idx + 1) % palette.length] || palette[0];
      root.style.setProperty('--accent', next);
      root.style.setProperty('--accent-dim', hexToRgba(next, 0.14));
      root.style.setProperty('--accent-glow', hexToRgba(next, 0.38));
      write('<div class="iterm-muted">accent → <span style="color:' + next + '">' + next + '</span></div>');
    }

    function run(raw) {
      const trimmed = raw.trim();
      writeCmd(trimmed);
      if (!trimmed) return;
      history.push(trimmed);
      hIdx = history.length;

      const parts = trimmed.split(/\s+/);
      const cmd = parts[0].toLowerCase();
      const args = parts.slice(1);

      switch (cmd) {
        case 'help':     help(); break;
        case 'about':    about(); break;
        case 'work':
        case 'projects': work(); break;
        case 'skills':
        case 'stack':    skills(); break;
        case 'contact':
        case 'social':   contact(); break;
        case 'neofetch': neofetch(); break;
        case 'resume':
          write('<div class="iterm-muted">downloading resume.pdf…</div>');
          openExt('assets/Mahmoud_Al_Kurdi_Resume_2026.pdf');
          break;
        case 'open':     openUrl(args); break;
        case 'github':   openExt('https://github.com/KM-it-ops'); write('<div class="iterm-muted">opening github…</div>'); break;
        case 'linkedin': openExt('https://linkedin.com/in/michael-kurdi'); write('<div class="iterm-muted">opening linkedin…</div>'); break;
        case 'goto':     gotoSection(args); break;
        case 'cmdk':
        case 'palette':  if (window.__cmdk) window.__cmdk.open(); break;
        case 'whoami':   write('<div class="iterm-ok">michael</div>'); break;
        case 'uname':    write('<div class="iterm-muted">Portfolio 1.0.0 michael@kurdi static-html #1 ' + new Date().toUTCString() + '</div>'); break;
        case 'date':     write('<div>' + new Date().toString() + '</div>'); break;
        case 'pwd':      write('<div>/home/michael</div>'); break;
        case 'ls':       write('<div>about.md  work/  skills.json  resume.pdf  contact.vcf</div>'); break;
        case 'cat':
          if (args[0] === 'about.md') about();
          else if (args[0] === 'skills.json') skills();
          else if (args[0] === 'contact.vcf') contact();
          else write('<div class="iterm-err">cat: ' + escapeHtml(args.join(' ') || '-') + ': no such file</div>');
          break;
        case 'echo':     write('<div>' + escapeHtml(args.join(' ')) + '</div>'); break;
        case 'theme':    toggleTheme(); break;
        case 'matrix':   matrixRain(); break;
        case 'clear':
        case 'cls':      out.innerHTML = ''; break;
        case 'exit':     write('<div class="iterm-muted">nice try — you are still here.</div>'); break;
        default:
          write('<div class="iterm-err">command not found: ' + escapeHtml(cmd) + '</div>' +
                '<div class="iterm-muted">type `help` for the command list.</div>');
      }
    }

    BANNER.forEach((l) => write('<div class="iterm-muted">' + escapeHtml(l) + '</div>'));

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const v = input.value;
      input.value = '';
      run(v);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp') {
        if (!history.length) return;
        e.preventDefault();
        hIdx = Math.max(0, hIdx - 1);
        input.value = history[hIdx] || '';
      } else if (e.key === 'ArrowDown') {
        if (!history.length) return;
        e.preventDefault();
        hIdx = Math.min(history.length, hIdx + 1);
        input.value = history[hIdx] || '';
      } else if (e.key === 'l' && e.ctrlKey) {
        e.preventDefault();
        out.innerHTML = '';
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const val = input.value;
        const parts = val.split(/\s+/);
        const first = parts[0];
        if (!first) return;
        const matches = TERMINAL_COMMANDS.filter((c) => c.startsWith(first.toLowerCase()));
        if (matches.length === 1) {
          input.value = matches[0] + (parts.length > 1 ? ' ' + parts.slice(1).join(' ') : ' ');
        } else if (matches.length > 1) {
          writeCmd(val);
          write('<div class="iterm-muted">' + escapeHtml(matches.join('   ')) + '</div>');
        }
      }
    });

    body.addEventListener('click', (e) => {
      if (e.target && (e.target.tagName === 'A')) return;
      input.focus();
    });
  }

  /* ==============================================
     KONAMI
     ============================================== */
  function initKonami() {
    const seq = [
      'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
      'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
      'b','a',
    ];
    let buf = [];
    document.addEventListener('keydown', (e) => {
      buf.push(e.key);
      if (buf.length > seq.length) buf.shift();
      if (buf.length === seq.length && buf.every((k, i) => k.toLowerCase() === seq[i].toLowerCase())) {
        buf = [];
        toast('🕹 konami');
        confettiBurst();
      }
    });
  }
  function confettiBurst() {
    const cv = document.createElement('canvas');
    cv.style.cssText = 'position:fixed;inset:0;z-index:1200;pointer-events:none';
    document.body.appendChild(cv);
    const ctx = cv.getContext('2d');
    let w = cv.width = window.innerWidth;
    let h = cv.height = window.innerHeight;
    const colors = ['#7cf0c1', '#7aa2ff', '#b07cff', '#ff7ac6', '#ffb547', '#f5d67a'];
    const parts = Array.from({ length: 180 }, () => ({
      x: w / 2, y: h / 3,
      vx: (Math.random() - 0.5) * 12,
      vy: Math.random() * -10 - 4,
      r: Math.random() * 4 + 2,
      c: colors[Math.floor(Math.random() * colors.length)],
      life: 120 + Math.random() * 80,
    }));
    let t = 0;
    (function frame() {
      ctx.clearRect(0, 0, w, h);
      t++;
      parts.forEach((p) => {
        p.vy += 0.25;
        p.x += p.vx; p.y += p.vy;
        p.life--;
        ctx.fillStyle = p.c;
        ctx.globalAlpha = Math.max(0, p.life / 180);
        ctx.fillRect(p.x, p.y, p.r, p.r);
      });
      if (t < 180) requestAnimationFrame(frame);
      else cv.remove();
    })();
    window.addEventListener('resize', () => {
      w = cv.width = window.innerWidth;
      h = cv.height = window.innerHeight;
    }, { once: true });
  }

  /* ==============================================
     CURSOR SPOTLIGHT
     ============================================== */
  function initCursorSpotlight() {
    if (prefersReducedMotion || isTouch) return;
    const spot = document.getElementById('cursorSpot');
    if (!spot) return;
    let x = -9999, y = -9999, tx = -9999, ty = -9999;
    let raf = 0;
    function update() {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      spot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(update);
    }
    window.addEventListener('pointermove', (e) => {
      tx = e.clientX; ty = e.clientY;
      if (!spot.classList.contains('on')) spot.classList.add('on');
      if (!raf) raf = requestAnimationFrame(update);
    }, { passive: true });
    window.addEventListener('pointerleave', () => {
      spot.classList.remove('on');
    });
  }

  /* ==============================================
     MAGNETIC BUTTONS
     ============================================== */
  function initMagnetic() {
    if (prefersReducedMotion || isTouch) return;
    const els = document.querySelectorAll('[data-magnetic]');
    els.forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const strength = 0.25;
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
      el.addEventListener('pointerleave', () => {
        el.style.transform = '';
      });
    });
  }

  /* ==============================================
     3D TILT (project cards)
     ============================================== */
  function initTilt() {
    if (prefersReducedMotion || isTouch) return;
    const cards = document.querySelectorAll('.tilt');
    const MAX = 6; // deg
    cards.forEach((card) => {
      let raf = 0;
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          card.style.transform =
            `perspective(900px) rotateY(${nx * MAX}deg) rotateX(${-ny * MAX}deg) translateY(-4px)`;
        });
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ==============================================
     HELPERS
     ============================================== */
  function escapeHtml(s) {
    if (s === undefined || s === null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
  function hexToRgba(hex, alpha) {
    const h = hex.replace('#', '');
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

})();
