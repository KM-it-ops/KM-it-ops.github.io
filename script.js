/* ============================================================
   km-it-ops :: AI Systems Architect — HUD console
   Cursor mask · animated metrics · live clock · interactive terminal
   ============================================================ */

(function () {
  'use strict';

  /* ------------- Cursor Mask (Guy Fawkes companion) ------------- */
  (function initCursorMask() {
    const el = document.getElementById('cursorMask');
    if (!el) return;
    if (matchMedia('(pointer: coarse)').matches) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let tx = -100, ty = -100;
    let mx = -100, my = -100;
    let active = false;

    const clickableSelector = [
      'a', 'button', 'input', 'textarea', 'select', 'summary',
      '[role="button"]', '[role="link"]', '[onclick]',
      '[tabindex]:not([tabindex="-1"])', '.hud-btn'
    ].join(',');

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      const clickable = Boolean(e.target.closest(clickableSelector));
      el.classList.toggle('is-clickable', clickable);
      if (!active) {
        active = true;
        el.classList.add('active');
      }
    };
    const onLeave = () => {
      active = false;
      el.classList.remove('active', 'is-clickable');
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', () => { active = true; el.classList.add('active'); });

    const FOLLOW_SPEED = 0.18; // lag factor — lower = more shadowy delay
    const OFFSET_X = 14;       // shadow trailing offset
    const OFFSET_Y = 14;

    function loop() {
      tx += (mx - OFFSET_X - tx) * FOLLOW_SPEED;
      ty += (my - OFFSET_Y - ty) * FOLLOW_SPEED;
      el.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0)`;
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  })();

  /* ------------- Scroll-reactive background signal ------------- */
  (function initScrollSignalBg() {
    const bg = document.getElementById('scrollSignalBg');
    if (!bg) return;

    const root = document.documentElement;
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    let ticking = false;
    let lastUpdate = 0;
    const UPDATE_EVERY_MS = 80;

    const update = () => {
      const max = Math.max(1, document.body.scrollHeight - innerHeight);
      const progress = Math.min(1, Math.max(0, scrollY / max));
      root.style.setProperty('--scroll-progress', progress.toFixed(4));
      root.style.setProperty('--scroll-shift', `${Math.round(scrollY * 0.14)}px`);
      root.style.setProperty('--scroll-tilt', `${((progress - 0.5) * 2.2).toFixed(2)}deg`);
      lastUpdate = performance.now();
      ticking = false;
    };

    const requestUpdate = () => {
      const now = performance.now();
      if (now - lastUpdate < UPDATE_EVERY_MS) return;
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    addEventListener('scroll', requestUpdate, { passive: true });
    addEventListener('resize', requestUpdate, { passive: true });
  })();

  /* ------------- Live HUD clock ------------- */
  (function initClock() {
    const el = document.getElementById('hudClock');
    if (!el) return;
    const update = () => {
      const d = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      el.textContent = `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())} UTC`;
    };
    update();
    setInterval(update, 1000);
  })();

  /* ------------- Animated metric counters (values exist in DOM immediately for a11y/SEO) ------------- */
  (function initMetrics() {
    const metrics = document.querySelectorAll('.hud-metric');
    if (!metrics.length) return;

    const animateCounter = (el) => {
      const target = parseFloat(el.dataset.counter || '0');
      const suffix = el.dataset.suffix || '';
      const isFloat = String(el.dataset.counter || '').includes('.');
      const duration = 1200;
      const startValue = target > 0 ? target * 0.82 : 0;
      const start = performance.now();

      function step(now) {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
        const cur = startValue + (target - startValue) * eased;
        el.textContent = (isFloat ? cur.toFixed(2) : Math.round(cur)) + suffix;
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = (isFloat ? target.toFixed(2) : target) + suffix;
      }
      requestAnimationFrame(step);
    };

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          const val = e.target.querySelector('.hud-metric-value');
          if (val && !val.dataset.done) {
            val.dataset.done = '1';
            animateCounter(val);
          }
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -80px 0px' });

    metrics.forEach((m) => io.observe(m));
  })();

  /* ------------- Threat feed shuffler ------------- */
  (function initFeedShuffle() {
    const list = document.getElementById('threatFeed');
    if (!list) return;
    const extras = [
      { sev: 'ok',   msg: 'Phishing classifier regression passed · F1 0.9968' },
      { sev: 'info', msg: 'Open channel · AI Security / Detection Engineering' },
      { sev: 'warn', msg: 'Z-score volume spike · 3.4σ at gateway' },
      { sev: 'ok',   msg: 'Zero Trust policy reload · 1,204 rules valid' },
      { sev: 'info', msg: 'STIX/TAXII feed sync · 89 new indicators' },
      { sev: 'crit', msg: 'Brute force pattern · 5 attempts / 60s · blocked' },
      { sev: 'info', msg: 'Masked signal · operator verified' },
    ];
    const sevClass = { info: 'hud-sev-info', warn: 'hud-sev-warn', crit: 'hud-sev-crit', ok: 'hud-sev-ok' };
    let idx = 0;

    function rotate() {
      const next = extras[idx % extras.length];
      idx++;
      const li = document.createElement('li');
      li.className = 'hud-feed-item';
      li.innerHTML = `<span class="hud-feed-sev ${sevClass[next.sev]}">${next.sev.toUpperCase()}</span><span class="hud-feed-msg">${next.msg}</span>`;
      li.style.opacity = '0';
      list.insertBefore(li, list.firstChild);
      requestAnimationFrame(() => { li.style.transition = 'opacity 0.5s'; li.style.opacity = '1'; });
      while (list.children.length > 5) list.removeChild(list.lastChild);
    }
    setInterval(rotate, 5200);
  })();

  /* ------------- Interactive terminal ------------- */
  (function initTerminal() {
    const form  = document.getElementById('itermForm');
    const input = document.getElementById('itermInput');
    const out   = document.getElementById('itermOut');
    const body  = document.getElementById('itermBody');
    if (!form || !input || !out || !body) return;

    const append = (text, cls = '') => {
      const div = document.createElement('div');
      div.className = 'line ' + cls;
      div.innerHTML = text;
      out.appendChild(div);
      body.scrollTop = body.scrollHeight;
    };

    const history = [];
    let histIdx = -1;

    const commands = {
      help: () => `Available commands:
  about            Operator manifest
  builds           List shipped builds (GitHub)
  playbooks        List playbook portfolio
  metrics          Show key operational metrics
  skills           Stack proficiency overview
  contact          Open channels
  resume           Download resume.pdf
  clear            Clear terminal
  whoami           Print operator identity
  sudo hire-me     Initiate hiring sequence
  manifesto        Signal doctrine
  signal           Role/contact status
  mask             Symbol note
  casefiles        Shipped build evidence
  konami           ???`,

      about: () => `MAHMOUD ("MICHAEL") AL KURDI
  role:    AI Systems Architect
  loc:     Charlotte, NC · remote OK
  edu:     B.S. IT Cybersecurity · SNHU · Summa Cum Laude · 3.96 GPA
  cert:    CompTIA Security+ ce (2025)  ·  OSCP candidate (Q3 2026)
  exp:     8 yrs federally regulated, cleared ops (FAA/OSHA/IATA/CBP)
  ships:   ML-driven security automation, AI workflow tooling`,

      builds: () => `Open-source builds at <a href="https://github.com/KM-it-ops" target="_blank" rel="noopener">github.com/KM-it-ops</a>:
  BUILD_01  phishing-email-classifier       · 99.68% F1   · ML
  BUILD_02  security-log-anomaly-detection · 100% detect  · Rules+Stats
  BUILD_03  StockPath-Navigator            · 17 prompts   · AI System
  BUILD_04  Vulnerability-Management-Mini  · Flask/REST   · Full-stack`,

      playbooks: () => `Independent portfolio research:
  PB_01  incident-response-playbooks   · ISO 27035 + NIST 800-61 (CSF 2.0)
  PB_02  cyber-defense-playbook        · CISA AIS, YARA, MITRE ATT&CK`,

      metrics: () => `OPERATIONAL METRICS:
  phishing F1 ............ 99.68%   (5-fold CV)
  detection rate ......... 100%     (6 SOC threat categories)
  prompt techniques ...... 17       (CoT · ReAct · ToT · self-consistency)
  cleared ops ............ 8 yrs    (FAA/OSHA/IATA/CBP)
  compliance findings .... 0        (8-yr supervisory tenure)
  GPA .................... 3.96     (SNHU · Summa Cum Laude)
  Dean's List ............ 8 / 8    (Alpha Sigma Lambda)`,

      skills: () => `LANGUAGES & DATA: Python, SQL, MySQL, SQLite, JS/TS, Bash
ML & AI: scikit-learn, pandas, NumPy, TF-IDF, Random Forest, Prompt Eng., LLM Orchestration
SECURITY OPS: Threat Detection, IR, Log Analysis, IAM, SIEM, IDS/IPS, Zero Trust, MITRE ATT&CK
TOOLS & CLOUD: Wireshark, Nmap, Darktrace, YARA, CISA AIS, AWS (EC2, IAM), Azure, Flask, React
COMPLIANCE: NIST CSF, NIST SP 800-53, CIS Controls, ISO 27001, FISMA, GDPR, DevSecOps`,

      contact: () => `<a href="mailto:kurdi.michael.it@gmail.com">email</a>
<a href="https://www.linkedin.com/in/mahmoud-michael-al-kurdi/" target="_blank" rel="noopener">linkedin</a>
<a href="https://github.com/KM-it-ops" target="_blank" rel="noopener">github</a>`,

      resume: () => {
        const a = document.createElement('a');
        a.href = 'assets/Michael_Kurdi_Resume_2026.pdf';
        a.download = 'Michael_Kurdi_Resume_2026.pdf';
        document.body.appendChild(a); a.click(); a.remove();
        return 'Initiating download → Michael_Kurdi_Resume_2026.pdf';
      },

      clear: () => { out.innerHTML = ''; return null; },

      manifesto: () => `No theater. No slideware.
Detection systems, response playbooks, and AI workflows
built for the moment when quiet failures become visible.`,

      signal: () => `STATUS: OPEN TO ROLES
TARGET: AI Security / Detection Engineering / Security Automation
LOCATION: Charlotte, NC / Remote
CONTACT: <a href="mailto:kurdi.michael.it@gmail.com">kurdi.michael.it@gmail.com</a>`,

      mask: () => `The mask is not concealment.
It is a reminder: systems should be judged by what they reveal.
This is an original masked-signal motif — resistance energy, not fan art.`,

      casefiles: () => commands.builds(),

      whoami: () => 'michael@kurdi · masked-signal · ai-security-builder',

      'sudo hire-me': () => `[sudo] password for recruiter: ********
✓ access granted
✓ initiating opportunity protocol
✓ secure channel: <a href="mailto:kurdi.michael.it@gmail.com">kurdi.michael.it@gmail.com</a>
✓ status: open to AI Security &amp; Automation roles`,

      konami: () => {
        confetti();
        return '🎉  cheat code accepted';
      },
    };

    function exec(raw) {
      const trimmed = raw.trim();
      if (!trimmed) return;
      append(`<span class="tk-user">michael</span><span class="tk-at">@</span><span class="tk-host">kurdi</span><span class="tk-path">:~</span><span class="tk-sym">$</span> ${escapeHtml(trimmed)}`, 'cmd');

      const cmd = trimmed.toLowerCase();
      const fn = commands[cmd];
      if (fn) {
        const result = fn();
        if (result !== null && result !== undefined) append(result);
      } else {
        append(`command not found: ${escapeHtml(trimmed)} — try <code>help</code>`, 'err');
      }
    }

    function escapeHtml(s) {
      return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }

    append(`<span class="tk-comment"># km-it-ops :: zsh sandbox · type <code>help</code></span>`);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const v = input.value;
      if (v.trim()) {
        history.push(v);
        histIdx = history.length;
      }
      exec(v);
      input.value = '';
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (histIdx > 0) { histIdx--; input.value = history[histIdx] || ''; }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (histIdx < history.length - 1) { histIdx++; input.value = history[histIdx] || ''; }
        else { histIdx = history.length; input.value = ''; }
      } else if (e.ctrlKey && e.key === 'l') {
        e.preventDefault(); out.innerHTML = '';
      }
    });

    body.addEventListener('click', () => input.focus());
  })();

  /* ------------- Konami easter egg ------------- */
  (function initKonami() {
    const seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let pos = 0;
    document.addEventListener('keydown', (e) => {
      const expected = seq[pos];
      if (e.key === expected || e.key.toLowerCase() === expected) {
        pos++;
        if (pos >= seq.length) { confetti(); pos = 0; }
      } else { pos = 0; }
    });
  })();

  /* ------------- Confetti (lightweight, no canvas) ------------- */
  function confetti() {
    const N = 80;
    const colors = ['#7cf0c1', '#6fb3ff', '#b07cff', '#ffb547', '#ff7ac6'];
    for (let i = 0; i < N; i++) {
      const c = document.createElement('div');
      c.style.cssText = `
        position: fixed; top: -10px;
        left: ${Math.random() * 100}vw;
        width: 8px; height: 8px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        z-index: 10001;
        pointer-events: none;
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        transform: rotate(${Math.random() * 360}deg);
        transition: transform 2.4s cubic-bezier(.2,.6,.25,1), top 2.4s cubic-bezier(.2,.6,.25,1), opacity 2.4s;
      `;
      document.body.appendChild(c);
      requestAnimationFrame(() => {
        c.style.top = `${60 + Math.random() * 40}vh`;
        c.style.transform = `translate(${(Math.random() - 0.5) * 200}px, 0) rotate(${Math.random() * 720}deg)`;
        c.style.opacity = '0';
      });
      setTimeout(() => c.remove(), 2600);
    }
  }

  /* ------------- Smooth-scroll for anchor links ------------- */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (history && history.pushState) history.pushState(null, '', '#' + id);
    }
  });

  /* ------------- Build hash randomizer (stylistic) ------------- */
  (function() {
    const el = document.getElementById('footerHash');
    if (!el) return;
    const hex = '0123456789abcdef';
    let s = '';
    for (let i = 0; i < 7; i++) s += hex[Math.floor(Math.random() * 16)];
    el.textContent = s;
  })();

  /* ------------- Console signature ------------- */
  if (typeof console !== 'undefined' && console.log) {
    const styles = [
      'color: #d0182f; font-family: monospace; font-weight: 700; font-size: 14px;',
      'color: #f2eadc; font-family: monospace; font-size: 12px;',
      'color: #8a93a8; font-family: monospace; font-size: 11px;',
    ];
    console.log('%c[ km-it-ops ]%c :: MASKED_SIGNAL // AI Security', styles[0], styles[1]);
    console.log('%cMahmoud (Michael) Al Kurdi  ·  github.com/KM-it-ops', styles[2]);
    console.log('%ckurdi.michael.it@gmail.com', styles[2]);
  }
})();
