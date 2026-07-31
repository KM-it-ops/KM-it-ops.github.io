/** BRIEF facts only — see ../content/BRIEF.md */

export const PERSON = {
  name: 'Mahmoud (“Michael”) Al Kurdi',
  short: 'Michael Al Kurdi',
  city: 'Charlotte, NC',
  remote: true,
  email: 'kurdi.michael.it@gmail.com',
  phone: '(704) 456-8322',
  phoneTel: '+17044568322',
  github: 'https://github.com/KM-it-ops',
  linkedin: 'https://www.linkedin.com/in/mahmoud-michael-al-kurdi',
  role: 'Security Operations Analyst',
  available: 'Available for full-time roles',
  targets: [
    'SOC Analyst',
    'Security Operations Analyst',
    'Cybersecurity Analyst',
    'Incident Response Analyst',
    'Junior Detection Engineer',
    'Security Automation',
  ],
} as const

export const CREDENTIALS = {
  secPlus: 'CompTIA Security+ ce (SY0-701)',
  secPlusDates: 'Issued Jan 7, 2025 · Valid through Jan 7, 2028',
  degree:
    'B.S. Information Technologies — Cybersecurity concentration, Southern New Hampshire University',
  degreeDates: 'Completed Dec 2025 · Conferred Jan 1, 2026',
  honors: 'Summa Cum Laude · 3.96 GPA · Alpha Sigma Lambda (Sigma Psi)',
} as const

export const EXPERIENCE = [
  {
    title: 'Aviation Security Operations Crew Chief',
    org: 'American Airlines',
    loc: 'Charlotte, NC',
    dates: '2015–2023',
    detail:
      'Federally regulated operations under FAA, OSHA, IATA, and CBP. Security clearance with CBP badge endorsement. Recurrent incident-response and safety/security training. High-accountability documentation, identity validation, and access control.',
  },
  {
    title: 'Courier & Logistics Specialist',
    org: 'USPS',
    loc: 'Kannapolis, NC',
    dates: '2024–2025',
    detail: 'Time-critical courier and logistics operations.',
  },
  {
    title: 'Delivery Associate',
    org: 'Fossa Logistics LLC (Amazon DSP)',
    loc: 'Charlotte, NC',
    dates: '2025–present',
    detail: 'Active role while pursuing full-time security operations.',
  },
] as const

export type Project = {
  name: string
  line: string
  links: { label: string; href: string }[]
  scores?: { agent: string; score: number }[]
  trademark?: string
}

export const PROJECTS: Project[] = [
  {
    name: 'AgentForge',
    line: 'One spec, many agents — configuration framework for agentic AI coding assistants. Six adapters. npm @kmitops/agentforge@0.3.1. MIT.',
    links: [
      { label: 'GitHub', href: 'https://github.com/KM-it-ops/AgentForge' },
      { label: 'npm', href: 'https://www.npmjs.com/package/@kmitops/agentforge' },
    ],
  },
  {
    name: 'ATT&CKLens Benchmark',
    line: 'Defensive benchmark: can AI coding agents build secure, uncertainty-aware, MITRE ATT&CK-aligned tooling? Seven agents. Rubric of 100. MIT.',
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/KM-it-ops/AgentForge-ATT-CKLens-Benchmark',
      },
    ],
    scores: [
      { agent: 'Cursor', score: 100 },
      { agent: 'Claude Code', score: 98 },
      { agent: 'Hermes Nemotron', score: 98 },
      { agent: 'Codex', score: 96 },
      { agent: 'Lovable (Repaired)', score: 76 },
      { agent: 'Mistral Vibe', score: 75 },
      { agent: 'Lovable (Original)', score: 40 },
    ],
    trademark:
      'MITRE ATT&CK® is a registered trademark of The MITRE Corporation.',
  },
  {
    name: 'Vulnerability Management Mini',
    line: 'Python / Flask / SQLite dashboard — CRUD, KPI cards, search, filtering, severity states. Workshop project.',
    links: [],
  },
  {
    name: 'Security Log Anomaly Detection',
    line: 'Python / pandas / NumPy — rule-based and statistical detection for authentication and network anomaly triage. Workshop project.',
    links: [],
  },
]

export const RESUME_PDF = '/Michael_Kurdi_Resume_2026.pdf'

export const ETHOS =
  'Every claim maps to a public repo, credential, or document. Defensive security only.'
