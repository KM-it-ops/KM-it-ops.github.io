(function () {
  'use strict';

  const atlasNodes = [
    {
      id: 'agentforge',
      label: 'AgentForge',
      subtitle: 'AI Agent Framework',
      type: 'core',
      x: 44,
      y: 42,
      status: 'active',
      summary: 'Framework for configuring, evaluating, and benchmarking AI coding agents across real engineering workflows.',
      capabilities: [
        'Agent configuration and verification',
        'Adapters for Claude Code, Codex, and generic agents (Cursor/Gemini on roadmap)',
        'Round-trip verification and smoke tests',
        'Safety guardrails and policy enforcement',
        'Release-ready packaging and documentation'
      ],
      stack: ['JavaScript (Node)', 'YAML specs', 'Bash + PowerShell', 'Zero-dependency emitters', 'GitHub Actions CI'],
      links: [
        ['GitHub Repository', 'https://github.com/KM-it-ops/AgentForge'],
        ['Documentation', 'https://github.com/KM-it-ops/AgentForge#readme'],
        ['Visual demo', 'https://km-it-ops.github.io/AgentForge/docs/demo/'],
        ['Customize spec', 'https://github.com/KM-it-ops/AgentForge/blob/main/spec/CUSTOMIZE.md']
      ]
    },
    {
      id: 'attacklens',
      label: 'ATT&CKLens Benchmark',
      subtitle: 'Detection Coverage & Fidelity',
      type: 'core',
      x: 58,
      y: 43,
      status: 'active',
      summary: 'Benchmark suite that evaluates detection coverage and fidelity across MITRE ATT&CK techniques using synthetic adversary emulation.',
      capabilities: [
        'Technique coverage scoring',
        'No-clear-mapping discipline',
        'Prompt-injection resistance checks',
        'Evidence citation and analyst follow-up questions'
      ],
      stack: ['Python', 'Pandas', 'Pytest', 'MITRE ATT&CK', 'Gradio', 'YAML'],
      links: [
        ['GitHub Repository', 'https://github.com/KM-it-ops/AgentForge-ATT-CKLens-Benchmark'],
        ['Methodology', 'https://github.com/KM-it-ops/AgentForge-ATT-CKLens-Benchmark#readme']
      ]
    },
    {
      id: 'shared-brain',
      label: 'Shared-Brain MCP',
      subtitle: 'Multi-agent memory',
      type: 'core',
      x: 50,
      y: 30,
      status: 'active',
      summary: 'A self-indexing LLM-Wiki plus MCP server (stdio + HTTP hub) that federates one memory across Claude, Cursor, and Codex.',
      capabilities: [
        'MCP server: stdio + Streamable-HTTP hub',
        'Bearer-token auth, write-lock, fail-closed',
        'Lint-on-write (drift / dead-link / secret scan)',
        'Round-trip verified across three agent clients'
      ],
      stack: ['TypeScript', 'MCP', 'Node', 'Vitest', 'Markdown LLM-Wiki'],
      links: [
        ['GitHub Repository', 'https://github.com/KM-it-ops/memory-mcp']
      ]
    },
    { id: 'telemetry', label: 'Telemetry Adapters', subtitle: 'Ingest & Normalize', type: 'capability', x: 44, y: 18, status: 'building' },
    { id: 'detection-rules', label: 'Detection Rules', subtitle: 'Sigma / YARA / Custom', type: 'capability', x: 58, y: 18, status: 'planned' },
    { id: 'cloud-connectors', label: 'Cloud Connectors', subtitle: 'AWS / Azure / GCP / O365', type: 'capability', x: 72, y: 27, status: 'future' },
    { id: 'safety', label: 'Safety Guardrails', subtitle: 'LLM Safety & Policy', type: 'capability', x: 31, y: 28, status: 'active' },
    { id: 'pytest', label: 'Pytest Suites', subtitle: 'Automated Validation', type: 'capability', x: 37, y: 64, status: 'active' },
    { id: 'scorecards', label: 'Scorecards', subtitle: 'Coverage & Quality', type: 'capability', x: 51, y: 69, status: 'active' },
    { id: 'siem', label: 'SIEM Queries', subtitle: 'KQL / SPL / SQL', type: 'capability', x: 65, y: 64, status: 'planned' },
    { id: 'github-actions', label: 'GitHub Actions', subtitle: 'CI/CD & Automation', type: 'evidence', x: 21, y: 43, status: 'active' },
    { id: 'release', label: 'Release Readiness', subtitle: 'Packaging & Publishing', type: 'evidence', x: 25, y: 59, status: 'active' },
    { id: 'reports', label: 'Reports', subtitle: 'Findings & Benchmarks', type: 'evidence', x: 77, y: 51, status: 'active' },
    { id: 'documentation', label: 'Documentation', subtitle: 'Guides / API / Runbooks', type: 'evidence', x: 78, y: 67, status: 'active' },
    { id: 'case-studies', label: 'Case Studies', subtitle: 'Real-world Implementations', type: 'evidence', x: 33, y: 82, status: 'building' },
    { id: 'live-demo', label: 'Live Demo', subtitle: 'Web App / Demo Env', type: 'evidence', x: 47, y: 82, status: 'active' },
    { id: 'resume-proof', label: 'Resume Evidence', subtitle: 'Experience / Impact', type: 'evidence', x: 62, y: 82, status: 'active' },
    {
      id: 'mitre',
      label: 'MITRE ATT&CK',
      subtitle: 'Framework',
      type: 'framework',
      x: 80,
      y: 35,
      status: 'reference',
      summary: 'Reference framework for mapping tactics, techniques, detection logic, and analyst-facing explanations.'
    },
    {
      id: 'security-plus',
      label: 'Security+ ce',
      subtitle: 'Credential',
      type: 'framework',
      x: 80,
      y: 82,
      status: 'certified',
      summary: 'CompTIA Security+ ce, SY0-701. Certified January 7, 2025 and valid through January 7, 2028.'
    },
    {
      id: 'future',
      label: 'Add Node',
      subtitle: 'Future AgentForge capability',
      type: 'future',
      x: 90,
      y: 54,
      status: 'future',
      summary: 'Future modules can be added to the atlas data schema without redesigning the entire page.',
      capabilities: [
        'MCP adapters',
        'Cloud telemetry ingest',
        'Red-team evaluation suites',
        'New case studies',
        'Release evidence packets'
      ]
    }
  ];

  const connections = [
    ['agentforge', 'attacklens'],
    ['agentforge', 'shared-brain'],
    ['agentforge', 'telemetry'],
    ['attacklens', 'detection-rules'],
    ['attacklens', 'cloud-connectors'],
    ['agentforge', 'safety'],
    ['agentforge', 'pytest'],
    ['agentforge', 'scorecards'],
    ['attacklens', 'scorecards'],
    ['attacklens', 'siem'],
    ['agentforge', 'github-actions'],
    ['agentforge', 'release'],
    ['attacklens', 'reports'],
    ['attacklens', 'documentation'],
    ['agentforge', 'case-studies'],
    ['agentforge', 'live-demo'],
    ['attacklens', 'resume-proof'],
    ['attacklens', 'mitre'],
    ['mitre', 'reports'],
    ['security-plus', 'resume-proof'],
    ['reports', 'future'],
    ['cloud-connectors', 'future']
  ];

  const caseFiles = [
    {
      id: 'CASE-001',
      title: 'AgentForge',
      tag: 'AI agent configuration and verification framework',
      problem: 'Teams need repeatable agent setup, readiness proof, and reusable workflow documentation.',
      method: 'Canonical specs, platform adapters, smoke tests, safety rules, and release readiness docs.',
      evidence: 'GitHub repo, visual demo with clone-and-customize path, verify suite, and active development history.',
      link: 'https://km-it-ops.github.io/AgentForge/docs/demo/'
    },
    {
      id: 'CASE-002',
      title: 'ATT&CKLens Benchmark',
      tag: 'Detection coverage and fidelity benchmark',
      problem: 'AI coding agents need to be compared on controlled defensive-security work, not vibes.',
      method: 'One spec, safety rules, acceptance tests, scoring rubric, branch inventory, and final report.',
      evidence: 'Ranked artifacts for MITRE mapping discipline, evidence quality, safety, and app behavior.',
      link: 'https://github.com/KM-it-ops/AgentForge-ATT-CKLens-Benchmark'
    },
    {
      id: 'CASE-003',
      title: 'Shared-Brain MCP (LLM-Wiki)',
      tag: 'Model Context Protocol server · multi-agent memory',
      problem: 'AI coding agents (Claude, Cursor, Codex) each forget what the others learned — knowledge silos per tool.',
      method: 'A self-indexing markdown LLM-Wiki plus an MCP server (stdio + HTTP hub) federating one brain across every agent; bearer-token auth, write-lock, lint-on-write, 34 tests.',
      evidence: 'Round-trip verified across three clients — a note written in one agent is readable in all three.',
      link: 'https://github.com/KM-it-ops/memory-mcp'
    },
    {
      id: 'CASE-004',
      title: 'OSINT Dashboard',
      tag: 'Python · OSINT aggregation & visualization',
      problem: 'Open-source intelligence is scattered across feeds with no unified, analyst-friendly view.',
      method: 'Python pipeline aggregating OSINT sources into an interactive visualization dashboard for triage and pivoting.',
      evidence: 'Public, runnable app demonstrating data-engineering and threat-intel workflow design.',
      link: 'https://github.com/KM-it-ops/osint-dashboard'
    },
    {
      id: 'CASE-005',
      title: 'Cyber Defense Playbook',
      tag: 'Threat intel · CISA AIS · YARA · MITRE ATT&CK',
      problem: 'Defensive teams need layered, framework-aligned controls, not ad-hoc guidance.',
      method: 'Threat-intelligence framework integrating CISA AIS, YARA rules, MITRE ATT&CK mapping, and defense-in-depth controls.',
      evidence: 'Public reference library mapping detections and controls to recognized frameworks.',
      link: 'https://github.com/KM-it-ops/cyber-defense-playbook'
    },
    {
      id: 'CASE-006',
      title: 'Incident Response Playbooks',
      tag: 'ISO/IEC 27035 · NIST SP 800-61r2 · CSF 2.0',
      problem: 'IR processes vary by team and rarely trace cleanly to a recognized standard.',
      method: 'Cross-framework IR playbook library aligning response phases to ISO/IEC 27035:2016 and NIST SP 800-61r2 (CSF 2.0).',
      evidence: 'Public, standard-mapped runbooks usable as SOC reference material.',
      link: 'https://github.com/KM-it-ops/incident-response-playbooks'
    }
  ];

  const signals = [
    ['Detection Engineering', 'Rules, tests, MITRE mapping', 6],
    ['Threat Analysis', 'Case files, TTP mapping, follow-up questions', 6],
    ['Security Automation', 'Python tools, agent workflows, CI checks', 6],
    ['SIEM / Telemetry', 'Adapters, logs, queries, detection logic', 5],
    ['Cloud & Scripting', 'Python, Bash, PowerShell, GitHub Actions', 5],
    ['Documentation', 'README files, scorecards, reports, runbooks', 6]
  ];

  const timeline = [
    ['Jan 2025', 'CompTIA Security+ ce', 'SY0-701 certified; validates security foundations and operational vocabulary.'],
    ['Dec 2025', 'B.S. Information Technologies', 'Graduated Summa Cum Laude from Southern New Hampshire University with GPA 3.96.'],
    ['2026', 'AgentForge', 'Active framework for agent configuration, verification, smoke tests, and documentation.'],
    ['2026', 'ATT&CKLens Benchmark', 'Defensive-security benchmark with safety rules, acceptance tests, and scorecards.'],
    ['Ongoing', 'Expanding capabilities', 'New modules, adapters, reports, demos, and case studies become atlas nodes.']
  ];

  let activeNodeId = 'agentforge';

  document.addEventListener('DOMContentLoaded', () => {
    renderAtlas();
    renderInspector(activeNodeId);
    renderMiniMap();
    renderTimeline();
    renderCases();
    renderSignals();
    initNav();
    window.addEventListener('resize', debounce(drawConnections, 100));
  });

  function renderAtlas() {
    const stage = document.getElementById('atlasStage');
    atlasNodes.forEach((node) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `atlas-node ${node.type}`;
      button.dataset.nodeId = node.id;
      button.style.left = `${node.x}%`;
      button.style.top = `${node.y}%`;
      button.innerHTML = `
        <span class="node-icon" aria-hidden="true">${iconFor(node.type)}</span>
        <strong>${escapeHtml(node.label)}</strong>
        <small>${escapeHtml(node.subtitle)}</small>
        <em>${escapeHtml(node.status)}</em>
      `;
      button.addEventListener('click', () => selectNode(node.id));
      stage.appendChild(button);
    });
    drawConnections();
    setActiveNode(activeNodeId);
  }

  function drawConnections() {
    const svg = document.getElementById('connectionLayer');
    const stage = document.getElementById('atlasStage');
    const rect = stage.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
    svg.innerHTML = '';

    connections.forEach(([fromId, toId]) => {
      const from = document.querySelector(`[data-node-id="${fromId}"]`);
      const to = document.querySelector(`[data-node-id="${toId}"]`);
      if (!from || !to) return;

      const a = centerPoint(from, rect);
      const b = centerPoint(to, rect);
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', a.x);
      line.setAttribute('y1', a.y);
      line.setAttribute('x2', b.x);
      line.setAttribute('y2', b.y);
      line.setAttribute('class', `connection ${toId === 'future' || fromId === 'future' ? 'future-line' : ''}`);
      svg.appendChild(line);
    });
  }

  function centerPoint(element, stageRect) {
    const rect = element.getBoundingClientRect();
    return {
      x: rect.left - stageRect.left + rect.width / 2,
      y: rect.top - stageRect.top + rect.height / 2
    };
  }

  function selectNode(nodeId) {
    activeNodeId = nodeId;
    setActiveNode(nodeId);
    renderInspector(nodeId);
  }

  function setActiveNode(nodeId) {
    document.querySelectorAll('.atlas-node').forEach((node) => {
      node.classList.toggle('active', node.dataset.nodeId === nodeId);
    });
    document.querySelectorAll('[data-focus-node]').forEach((button) => {
      button.classList.toggle('active', button.dataset.focusNode === nodeId);
    });
  }

  function renderInspector(nodeId) {
    const node = atlasNodes.find((item) => item.id === nodeId) || atlasNodes[0];
    const inspector = document.getElementById('inspector');
    const capabilities = node.capabilities || [`${node.label} connects portfolio evidence to recruiter-readable proof.`];
    const stack = node.stack || ['Expandable schema', 'Portfolio evidence', 'Recruiter review path'];
    const links = node.links || [['GitHub Profile', 'https://github.com/KM-it-ops']];

    inspector.innerHTML = `
      <article class="inspector-card ${node.type}">
        <div class="inspector-head">
          <span class="big-icon" aria-hidden="true">${iconFor(node.type)}</span>
          <div>
            <h2>${escapeHtml(node.label)}</h2>
            <p>${escapeHtml(node.subtitle)}</p>
          </div>
          <span class="node-status">${escapeHtml(node.status)}</span>
        </div>
        <p class="inspector-summary">${escapeHtml(node.summary || 'Atlas node for portfolio capabilities, artifacts, and future AgentForge growth.')}</p>
        <div class="detail-block">
          <strong>Key capabilities</strong>
          <ul>${capabilities.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
        </div>
        <div class="detail-block">
          <strong>Tech stack</strong>
          <div class="tag-list">${stack.map((item) => `<span>${escapeHtml(item)}</span>`).join('')}</div>
        </div>
        <div class="detail-block">
          <strong>Evidence & links</strong>
          <div class="link-list">${links.map(([label, href]) => `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`).join('')}</div>
        </div>
      </article>
    `;
  }

  function renderMiniMap() {
    const mini = document.getElementById('miniMap');
    atlasNodes.forEach((node) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `mini-dot ${node.type}`;
      dot.style.left = `${node.x}%`;
      dot.style.top = `${node.y}%`;
      dot.setAttribute('aria-label', `Select ${node.label}`);
      dot.addEventListener('click', () => selectNode(node.id));
      mini.appendChild(dot);
    });
  }

  function renderTimeline() {
    const list = document.getElementById('timelineList');
    timeline.forEach(([date, title, text]) => {
      const item = document.createElement('li');
      item.innerHTML = `<time>${escapeHtml(date)}</time><strong>${escapeHtml(title)}</strong><p>${escapeHtml(text)}</p>`;
      list.appendChild(item);
    });
  }

  function renderCases() {
    const grid = document.getElementById('caseGrid');
    caseFiles.forEach((file) => {
      const article = document.createElement('article');
      article.className = 'case-card';
      article.innerHTML = `
        <header>
          <span>${escapeHtml(file.id)}</span>
          <h3>${escapeHtml(file.title)}</h3>
          <p>${escapeHtml(file.tag)}</p>
        </header>
        <dl>
          <div><dt>Problem</dt><dd>${escapeHtml(file.problem)}</dd></div>
          <div><dt>Method</dt><dd>${escapeHtml(file.method)}</dd></div>
          <div><dt>Evidence</dt><dd>${escapeHtml(file.evidence)}</dd></div>
        </dl>
        <a href="${escapeHtml(file.link)}" target="_blank" rel="noopener noreferrer">Open repository</a>
      `;
      grid.appendChild(article);
    });
  }

  function renderSignals() {
    const table = document.getElementById('signalTable');
    signals.forEach(([capability, evidence, score]) => {
      const row = document.createElement('div');
      row.className = 'signal-row';
      row.innerHTML = `
        <strong>${escapeHtml(capability)}</strong>
        <span>${escapeHtml(evidence)}</span>
        <div class="signal-bars" aria-label="${score} of 6 impact bars">
          ${Array.from({ length: 6 }, (_, index) => `<i class="${index < score ? 'filled' : ''}"></i>`).join('')}
        </div>
      `;
      table.appendChild(row);
    });
  }

  function initNav() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    menuToggle.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(open));
    });
    mobileNav.addEventListener('click', (event) => {
      if (event.target.matches('a')) {
        mobileNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.querySelectorAll('[data-focus-node]').forEach((button) => {
      button.addEventListener('click', () => selectNode(button.dataset.focusNode));
    });
  }

  function iconFor(type) {
    return {
      core: '◎',
      capability: '◇',
      evidence: '▣',
      framework: '⬡',
      future: '+'
    }[type] || '•';
  }

  function debounce(fn, wait) {
    let timeout;
    return function debounced() {
      window.clearTimeout(timeout);
      timeout = window.setTimeout(fn, wait);
    };
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
