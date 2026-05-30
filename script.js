(function () {
  'use strict';

  const commands = [
    { title: 'Evidence', hint: '#evidence', action: () => scrollToId('evidence') },
    { title: 'Case files', hint: '#projects', action: () => scrollToId('projects') },
    { title: 'Stack', hint: '#stack', action: () => scrollToId('stack') },
    { title: 'Timeline', hint: '#timeline', action: () => scrollToId('timeline') },
    { title: 'Contact', hint: '#contact', action: () => scrollToId('contact') },
    { title: 'Resume PDF', hint: 'download', action: () => window.open('assets/Michael_Kurdi_Resume_2026.pdf', '_blank', 'noopener') },
    { title: 'GitHub profile', hint: 'github.com/KM-it-ops', action: () => window.open('https://github.com/KM-it-ops', '_blank', 'noopener') },
    { title: 'LinkedIn profile', hint: 'linkedin.com/in/michael-kurdi', action: () => window.open('https://linkedin.com/in/michael-kurdi', '_blank', 'noopener') },
    { title: 'Email Michael', hint: 'kurdi.michael.it@gmail.com', action: () => { window.location.href = 'mailto:kurdi.michael.it@gmail.com?subject=Opportunity%20-%20Mahmoud%20Michael%20Al%20Kurdi'; } },
    { title: 'Phishing classifier repo', hint: '99.68% F1', action: () => window.open('https://github.com/KM-it-ops/phishing-email-classifier', '_blank', 'noopener') },
    { title: 'Log anomaly repo', hint: 'SOC detection', action: () => window.open('https://github.com/KM-it-ops/security-log-anomaly-detection', '_blank', 'noopener') },
    { title: 'Vulnerability dashboard repo', hint: 'Flask + SQLite', action: () => window.open('https://github.com/KM-it-ops/Vulnerability-Management-Mini-Program', '_blank', 'noopener') },
    { title: 'StockPath Navigator repo', hint: 'expert system', action: () => window.open('https://github.com/KM-it-ops/StockPath-Navigator', '_blank', 'noopener') }
  ];

  let activeIndex = 0;
  let filteredCommands = commands.slice();

  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initScrollProgress();
    initCommandPalette();
  });

  function initNav() {
    const nav = document.getElementById('navbar');
    const menuButton = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const links = Array.from(document.querySelectorAll('.nav-links a, .mobile-menu a'));
    const sections = links
      .map((link) => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);

    const setScrolled = () => {
      nav.classList.toggle('scrolled', window.scrollY > 12);
    };

    setScrolled();
    window.addEventListener('scroll', setScrolled, { passive: true });

    menuButton.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
    });

    mobileMenu.addEventListener('click', (event) => {
      if (event.target.matches('a')) {
        mobileMenu.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
      }
    });

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      links.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + visible.target.id);
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: [0.1, 0.25, 0.5] });

    sections.forEach((section) => observer.observe(section));
  }

  function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? window.scrollY / max : 0;
      bar.style.transform = 'scaleX(' + Math.min(1, Math.max(0, pct)) + ')';
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }

  function initCommandPalette() {
    const dialog = document.getElementById('cmdk');
    const trigger = document.getElementById('cmdkTrigger');
    const input = document.getElementById('cmdkInput');
    const list = document.getElementById('cmdkList');

    const open = () => {
      dialog.hidden = false;
      filteredCommands = commands.slice();
      activeIndex = 0;
      input.value = '';
      renderList(list);
      requestAnimationFrame(() => input.focus());
    };

    const close = () => {
      dialog.hidden = true;
      trigger.focus();
    };

    trigger.addEventListener('click', open);

    dialog.addEventListener('click', (event) => {
      if (event.target.hasAttribute('data-close-cmdk')) close();
    });

    input.addEventListener('input', () => {
      const query = input.value.trim().toLowerCase();
      filteredCommands = commands.filter((item) => {
        return item.title.toLowerCase().includes(query) || item.hint.toLowerCase().includes(query);
      });
      activeIndex = 0;
      renderList(list);
    });

    document.addEventListener('keydown', (event) => {
      const wantsPalette = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k';
      if (wantsPalette) {
        event.preventDefault();
        dialog.hidden ? open() : close();
        return;
      }

      if (dialog.hidden) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        close();
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        activeIndex = Math.min(filteredCommands.length - 1, activeIndex + 1);
        renderList(list);
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        activeIndex = Math.max(0, activeIndex - 1);
        renderList(list);
      }

      if (event.key === 'Enter' && filteredCommands[activeIndex]) {
        event.preventDefault();
        const command = filteredCommands[activeIndex];
        close();
        command.action();
      }
    });
  }

  function renderList(list) {
    list.innerHTML = '';

    if (!filteredCommands.length) {
      const empty = document.createElement('div');
      empty.className = 'cmdk-item';
      empty.textContent = 'No matching result';
      list.appendChild(empty);
      return;
    }

    filteredCommands.forEach((command, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'cmdk-item' + (index === activeIndex ? ' active' : '');
      button.setAttribute('role', 'option');
      button.setAttribute('aria-selected', String(index === activeIndex));
      button.innerHTML = '<strong>' + escapeHtml(command.title) + '</strong><span>' + escapeHtml(command.hint) + '</span>';
      button.addEventListener('mouseenter', () => {
        activeIndex = index;
        renderList(list);
      });
      button.addEventListener('click', () => {
        document.getElementById('cmdk').hidden = true;
        command.action();
      });
      list.appendChild(button);
    });
  }

  function scrollToId(id) {
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
})();
