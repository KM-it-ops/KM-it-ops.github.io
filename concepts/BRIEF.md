# CONCEPT BRIEF — Portfolio design variant (read fully before writing code)

You are building ONE standalone design-concept homepage for the portfolio of a real person.
The FACTS below are verified. **Use only these facts. Never invent, exaggerate, or extrapolate
achievements, employers, dates, numbers, or skills.** If your concept needs content you don't
have, restructure — do not fabricate.

## The person
- **Mahmoud ("Michael") Al Kurdi** — Charlotte, NC · open to remote
- Email kurdi.michael.it@gmail.com · Phone (704) 456-8322
- GitHub: github.com/KM-it-ops · LinkedIn: linkedin.com/in/mahmoud-michael-al-kurdi
- Site: km-it-ops.github.io
- **CompTIA Security+ ce (SY0-701)** — issued Jan 7 2025, valid through Jan 7 2028
- **B.S. Information Technologies — Cybersecurity concentration**, Southern New Hampshire
  University. Completed Dec 2025, conferred Jan 1 2026. **Summa Cum Laude, 3.96 GPA**,
  Sigma Psi chapter of Alpha Sigma Lambda.
- **Target roles:** SOC Analyst · Security Operations Analyst · Cybersecurity Analyst ·
  Incident Response Analyst · Junior Detection Engineer · Security Automation
- Available for full-time roles.

## Experience (real, complete list)
- **Aviation Security Operations Crew Chief — American Airlines, Charlotte NC (2015–2023).**
  Federally regulated operations, security clearance + CBP badge endorsement, international
  flight ops under FAA/OSHA/IATA/CBP requirements. Recurrent incident-response and
  safety/security training. High-accountability documentation, identity validation, access control.
- Courier & Logistics Specialist — USPS, Kannapolis NC (2024–2025)
- Delivery Associate — Fossa Logistics LLC (Amazon DSP), Charlotte NC (2025–present)

## Projects (real, public)
1. **AgentForge** — github.com/KM-it-ops/AgentForge. "One spec, many agents": configuration
   framework for agentic AI coding assistants. 6 adapter targets (Claude Code, Codex, Gemini CLI,
   Cursor, Aider, generic). Published to npm as @kmitops/agentforge@0.3.1. Proof: adapter
   round-trip tests, install smoke tests, doctor CLI, readiness runbook, live demo
   (km-it-ops.github.io/AgentForge/docs/demo/). MIT license.
2. **AgentForge ATT&CKLens Benchmark** — github.com/KM-it-ops/AgentForge-ATT-CKLens-Benchmark.
   Reproducible DEFENSIVE cybersecurity benchmark: can AI coding agents build secure,
   uncertainty-aware, MITRE ATT&CK-aligned defensive tooling? 7 agent artifacts scored against a
   rubric of 100: Cursor 100, Claude Code 98, Hermes Nemotron 98, Codex 96, Lovable Repaired 76,
   Mistral Vibe 75, Lovable Original 40. Graded: ATT&CK mapping discipline, prompt-injection
   resistance, evidence citation, uncertainty handling ("No Clear Mapping"), detection ideas,
   remediation guidance, analyst follow-up questions. One branch per agent; harness re-runs via
   benchmark-all.ps1. MIT. If you feature ATT&CK prominently, include: "MITRE ATT&CK® is a
   registered trademark of The MITRE Corporation" acknowledgement.
3. **Vulnerability Management Mini Program** — Python/Flask/SQLite dashboard: CRUD, KPI cards,
   search, filtering, severity states.
4. **Security Log Anomaly Detection** — Python/pandas/NumPy; rule-based + statistical detection
   for authentication and network anomaly triage.

## Skills (verbatim pool — pick what fits your layout)
- SOC/SecOps: alert triage, security monitoring, incident documentation, log analysis, evidence
  review, authentication events, DNS investigation, vulnerability awareness, remediation planning,
  escalation notes
- Cybersecurity: MITRE ATT&CK, defensive security, prompt-injection resistance, access control,
  least privilege, security documentation, confidence scoring, "No Clear Mapping" handling
- AI/Automation: AI coding-agent evaluation, reproducible benchmark design, rubric-based scoring,
  prompt architecture, safety rules, acceptance criteria, automated reporting
- Tools: Python, Gradio, JavaScript, Node.js, PowerShell, Bash, Git/GitHub, Markdown, JSON, YAML,
  HTML/CSS, pytest, npm

## Content & tone requirements
- **Sell the analyst first, projects second.** The person is the flagship; AgentForge and
  ATT&CKLens are the receipts. Lead with: 8 years of federally regulated security operations,
  the credential, the degree, the evidence-first work ethic.
- Tone: **confident, not cocky.** Grounded claims. The ethos everywhere: every claim maps to a
  public repo, credential, or document.
- ALL security content framed DEFENSIVELY (detection/mitigation) — this is a portfolio, never
  offensive tooling.
- Audience: recruiters, hiring managers, and security engineers.

## Technical requirements (hard)
- ONE fully self-contained HTML file. All CSS + JS inline. Only external requests: Google Fonts.
- All five areas as in-page sections with working nav: Hero/Home, About, Projects, Resume, Contact.
- Resume PDF link: `../../assets/Michael_Kurdi_Resume_2026.pdf`
- Mobile responsive (down to 375px). Honor `prefers-reduced-motion`. Semantic HTML, visible focus
  states, meaningful contrast.
- No frameworks, no build step, no external JS/CSS libraries.
- Typography must be distinctive: NO Inter, Roboto, Arial, Space Grotesk, or system fonts.

## Differentiation (hard)
The client's current site is a "SOC console / TRUE POSITIVE" concept: dark, phosphor/electric
CRT terminal, scanlines, Sigma-rule cards, radar. **Your concept must NOT resemble it.**
No terminal chrome, no scanlines, no CRT effects unless your assigned concept explicitly says so.
Clean-sheet reimagining. Commit fully to YOUR assigned aesthetic — you are competing against
9 other concepts and will be judged on distinctiveness, craft, and how well the design serves
the content.
