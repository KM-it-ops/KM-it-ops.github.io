/* =========================================
   AI Portfolio — script.js
   Particles, typing, scroll reveals, nav,
   technique cards, count-up animations
   ========================================= */

(function () {
  'use strict';

  /* ---- DOM Ready ---- */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initParticles();
    initTypingEffect();
    initScrollReveal();
    initNavbar();
    initMobileMenu();
    initTechniqueCards();
    initCountUp();
  }

  /* ==============================================
     1. PARTICLE / CONSTELLATION CANVAS
     ============================================== */
  function initParticles() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height, particles, mouse;
    const PARTICLE_COUNT = 70;
    const CONNECT_DIST = 140;
    const MOUSE_DIST = 180;

    mouse = { x: -9999, y: -9999 };

    function resize() {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    }

    function createParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 1.8 + 0.5,
          alpha: Math.random() * 0.5 + 0.2,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 229, 255, ${0.08 * (1 - dist / CONNECT_DIST)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw particles & mouse interaction
      for (const p of particles) {
        // Mouse repulsion
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < MOUSE_DIST && mDist > 0) {
          const force = (MOUSE_DIST - mDist) / MOUSE_DIST * 0.02;
          p.vx += (mdx / mDist) * force;
          p.vy += (mdy / mDist) * force;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Damping
        p.vx *= 0.998;
        p.vy *= 0.998;

        // Wrap edges
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 229, 255, ${p.alpha})`;
        ctx.fill();
      }

      requestAnimationFrame(draw);
    }

    canvas.addEventListener('mousemove', function (e) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', function () {
      mouse.x = -9999;
      mouse.y = -9999;
    });

    window.addEventListener('resize', function () {
      resize();
    });

    resize();
    createParticles();
    draw();
  }

  /* ==============================================
     2. TYPING EFFECT
     ============================================== */
  function initTypingEffect() {
    const el = document.getElementById('heroTyped');
    if (!el) return;

    const phrases = [
      'AI Systems Architect',
      'Prompt Engineer',
      'Building Expert Systems with Language Models',
      'Turning LLMs into Domain Specialists',
    ];

    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    const TYPE_SPEED = 70;
    const DELETE_SPEED = 40;
    const PAUSE_END = 2000;
    const PAUSE_START = 400;

    function tick() {
      const current = phrases[phraseIdx];

      if (!isDeleting) {
        charIdx++;
        el.textContent = current.substring(0, charIdx);
        if (charIdx === current.length) {
          setTimeout(function () {
            isDeleting = true;
            tick();
          }, PAUSE_END);
          return;
        }
        setTimeout(tick, TYPE_SPEED);
      } else {
        charIdx--;
        el.textContent = current.substring(0, charIdx);
        if (charIdx === 0) {
          isDeleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          setTimeout(tick, PAUSE_START);
          return;
        }
        setTimeout(tick, DELETE_SPEED);
      }
    }

    // Start after hero fade-in animation
    setTimeout(tick, 900);
  }

  /* ==============================================
     3. SCROLL REVEAL (Intersection Observer)
     ============================================== */
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    // Check for reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      reveals.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach(function (el) { observer.observe(el); });
  }

  /* ==============================================
     4. NAVBAR — Scroll shadow & active section
     ============================================== */
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id]');

    // Add shadow on scroll
    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      // Highlight active section
      let current = '';
      sections.forEach(function (section) {
        const top = section.offsetTop - 100;
        if (window.scrollY >= top) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(function (link) {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        }
      });
    });
  }

  /* ==============================================
     5. MOBILE MENU
     ============================================== */
  function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileOverlay');
    const links = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

    function toggle() {
      const isOpen = mobileMenu.classList.contains('open');
      mobileMenu.classList.toggle('open');
      overlay.classList.toggle('open');
      hamburger.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(!isOpen));
      document.body.style.overflow = isOpen ? '' : 'hidden';
    }

    function close() {
      mobileMenu.classList.remove('open');
      overlay.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    if (hamburger) hamburger.addEventListener('click', toggle);
    if (overlay) overlay.addEventListener('click', close);
    links.forEach(function (link) {
      link.addEventListener('click', close);
    });
  }

  /* ==============================================
     6. TECHNIQUE CARDS — Expand / Collapse
     ============================================== */
  function initTechniqueCards() {
    const cards = document.querySelectorAll('.technique-card');

    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        const wasActive = card.classList.contains('active');

        // Close all others
        cards.forEach(function (c) {
          c.classList.remove('active');
          c.setAttribute('aria-expanded', 'false');
        });

        // Toggle clicked card
        if (!wasActive) {
          card.classList.add('active');
          card.setAttribute('aria-expanded', 'true');
        }
      });

      // Keyboard support
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });
  }

  /* ==============================================
     7. COUNT-UP ANIMATION
     ============================================== */
  function initCountUp() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    if (!statNumbers.length) return;

    let animated = false;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !animated) {
            animated = true;
            statNumbers.forEach(function (el) {
              animateNumber(el);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    // Observe the stats row container
    const statsRow = document.querySelector('.stats-row');
    if (statsRow) observer.observe(statsRow);

    function animateNumber(el) {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1500;
      const start = performance.now();

      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        el.textContent = current + suffix;

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }

      requestAnimationFrame(step);
    }
  }
})();
