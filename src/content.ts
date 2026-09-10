/** BRIEF facts only — see ../content/BRIEF.md */

export const PERSON = {
  name: 'Michael Kurdi',
  short: 'Michael Kurdi',
  legal: 'Mahmoud Al Kurdi',
  city: 'Charlotte, NC',
  remote: true,
  email: 'kurdi.michael.it@gmail.com',
  phone: '(704) 456-8322',
  phoneTel: '+17044568322',
  github: 'https://github.com/KM-it-ops',
  linkedin: 'https://www.linkedin.com/in/mahmoud-michael-al-kurdi',
  role: 'Junior Security Analyst / Security Operations / IT Risk',
  available: 'Available for full-time roles',
  targets: [
    'Junior Security Analyst',
    'Security Operations',
    'Vulnerability Management',
    'IT Risk',
  ],
} as const

export const THROUGHLINE = {
  title: 'From regulated ops to security analysis',
  body: [
    'I spent eight years as an Aviation Security Operations Crew Chief at American Airlines — CBP-badged identity checks, access control, and incident notes in a federally regulated environment.',
    'I finished a B.S. in Information Technologies (Cybersecurity concentration) at SNHU, Summa Cum Laude with a 3.96 GPA, earned CompTIA Security+, and shipped public Python projects in detection, phishing classification, and vulnerability tracking.',
    'PromptRig and AgentForge show engineering discipline. Coursework labs are labeled as labs. I do not claim enterprise SIEM or SAST/DAST tenure I have not earned.',
  ],
  seeking:
    'Looking for junior security analyst, security operations, vulnerability management, and IT risk roles in Charlotte and remote.',
} as const

export const HIRE_BRIEF = [
  {
    label: 'Looking for',
    text: 'Junior security analyst, security operations, VM, or IT risk — triage and document first.',
  },
  {
    label: 'I bring',
    text: 'Regulated-ops habits, Security+, a 3.96 Summa finish, and public detection / VM projects you can run.',
  },
  {
    label: 'I won\'t invent',
    text: 'Enterprise SIEM years or production detection ownership I have not done.',
  },
] as const

export const CREDENTIALS = {
  secPlus: 'CompTIA Security+ ce (SY0-701)',
  secPlusDates: 'Issued Jan 7, 2025 · Valid through Jan 7, 2028',
  degree:
    'B.S. Information Technologies — Cybersecurity concentration, Southern New Hampshire University',
  degreeDates: 'Completed Dec 2025 · Conferred Jan 1, 2026',
  honors: 'Summa Cum Laude · 3.96 GPA · Alpha Sigma Lambda (Sigma Psi)',
  gpa: '3.96',
  honorsShort: 'Summa Cum Laude',
} as const

export type SkillBand = {
  tier: 'Hands-on lab' | 'Academic writing' | 'Exposure'
  items: { name: string; proof: string }[]
}

export const SKILL_BANDS: SkillBand[] = [
  {
    tier: 'Hands-on lab',
    items: [
      { name: 'Network troubleshooting', proof: 'Packet Tracer ping loss → retest; WLAN/DHCP/VLAN scavenger' },
      { name: 'Windows GPO hardening', proof: 'Six settings in GNS3 with policy paths + registry keys' },
      { name: 'MySQL / SQL', proof: 'ERD → schema, synthetic load, analytical queries + Docker demo' },
    ],
  },
  {
    tier: 'Academic writing',
    items: [
      { name: 'Incident analysis (CIA / NIST)', proof: 'Payroll integrity brief → least privilege + defense in depth' },
      { name: 'IAM / CIS Controls', proof: 'CIS 5/6/14 + HIPAA-aligned SLA stakeholder brief' },
      { name: 'Threat modeling', proof: 'Comparative attacker models; Bluetooth CVE framing (academic)' },
      { name: 'Cloud BCDR planning', proof: 'Academic ops plan with RTO/RPO, DR drills, vendor tiers' },
    ],
  },
  {
    tier: 'Exposure',
    items: [
      { name: 'SIEM vocabulary', proof: 'Splunk/Sentinel concepts from study — not production tenure' },
      { name: 'Python security tooling', proof: 'Log anomaly detector, phishing classifier, Flask vuln tracker — public repos' },
    ],
  },
]

export const OPERATING = [
  {
    title: 'Retest before you close',
    source: 'CYB-210 Packet Tracer',
    body: 'First ping looked flaky. I repeated the test, compared pairs, and documented both the anomaly and the recovery — the same habit a junior analyst needs before closing a ticket.',
  },
  {
    title: 'Map intent to the real control',
    source: 'CYB-220 GPO lab',
    body: 'Hardening outcomes arrived without click-paths. I used the Microsoft policy reference to find User vs Machine locations and registry backing keys, then proved each change.',
  },
  {
    title: 'Name the broken property first',
    source: 'CYB-200 incident brief',
    body: 'On a payroll abuse scenario I argued integrity was the CIA hit, then picked least privilege and defense in depth — not a random tool shopping list.',
  },
  {
    title: 'Brief stakeholders without watering down controls',
    source: 'CYB-260 CIS / HIPAA',
    body: 'CIS 5/6/14 tied to SLA language, plus an ethics appendix that refused “anonymized is fine” as a shortcut.',
  },
] as const

export const EXPERIENCE = [
  {
    title: 'Aviation Security Operations Crew Chief',
    org: 'American Airlines',
    loc: 'Charlotte, NC',
    dates: '2015–2023',
    detail:
      'Federally regulated operations under FAA, OSHA, IATA, and CBP. CBP badge endorsement in a federally regulated aviation environment. Recurrent incident-response and safety/security training. High-accountability documentation, identity validation, and access control.',
    transfer: [
      'Ticket-quality documentation under inspection pressure',
      'Identity validation and access control habits',
      'Escalation culture — clear facts, timed response',
    ],
  },
  {
    title: 'Courier & Logistics Specialist',
    org: 'USPS',
    loc: 'Kannapolis, NC',
    dates: '2024–2025',
    detail: 'Time-critical courier and logistics operations during degree completion.',
    transfer: ['Hard time windows', 'Exception handling'],
  },
  {
    title: 'Delivery Associate',
    org: 'Fossa Logistics LLC (Amazon DSP)',
    loc: 'Charlotte, NC',
    dates: '2025–present',
    detail:
      'High-tempo logistics — route prioritization, customer exceptions, hard time windows — while finishing the degree and security portfolio.',
    transfer: ['Prioritization under pressure', 'Customer-facing problem solving'],
  },
] as const

export type CaseFile = {
  id: string
  course: string
  name: string
  bestFor: string
  problem: string
  method: string[]
  evidence: string[]
  result: string
  hireSignal: string
  featured?: boolean
}

export const CASE_FILES: CaseFile[] = [
  {
    id: 'cyb-210',
    course: 'CYB-210',
    name: 'Packet Tracer network lab + config scavenger',
    bestFor: 'Security analyst',
    featured: true,
    problem:
      'Validate marketing/advertising LAN reachability in Packet Tracer when the first ping from PC1_Marketing to PC3_Marketing showed a lost packet — then inventory a live lab topology from the CLI.',
    method: [
      'Refused to treat a single flaky ping as final',
      'Retested and compared required host pairs (including printer / advertising checks)',
      'Documented wireless DHCP, guest WLAN limits, static LAN IPs, admin-down ports, VLAN 35/65/99, and ASA adjacency',
    ],
    evidence: [
      'troubleshooting.md — failure + recovery',
      'scavenger-findings.md — addressing tables',
      'topology.md — mermaid lab map',
    ],
    result:
      'Retest succeeded with all packets received. Writeup shows anomaly and recovery — not only a clean pass.',
    hireSignal:
      'Same muscle as junior analyst: retest, compare, document before you escalate or close.',
  },
  {
    id: 'cyb-220',
    course: 'CYB-220',
    name: 'Windows GPO hardening in GNS3',
    bestFor: 'Security analyst',
    problem:
      'Apply six endpoint restrictions on a GNS3 Windows guest with outcomes specified — not click-by-click instructions.',
    method: [
      'Mapped each outcome to User vs Machine policy paths via Microsoft policy reference',
      'Applied Control Panel hide, Task Manager disable, Recycle Bin icon removal, delete-notification off, HTTP printing off, IE menu bar on',
      'Recorded registry backing keys and verified UI/behavior in-lab',
    ],
    evidence: [
      'gpo-checklist.md — setting → path → registry → effect',
      'All six hardenings documented',
    ],
    result:
      'Complete checklist proving hardening intent can be translated into concrete GPO/registry controls.',
    hireSignal:
      'Desktop support / baseline hardening skill — not a claim of enterprise GPMC fleet ownership.',
  },
  {
    id: 'dad-220',
    course: 'DAD-220',
    name: 'MySQL QuantigrationUpdates',
    bestFor: 'Systems / data',
    problem:
      'Stand up QuantigrationUpdates from an ERD — Customers, Orders, RMA — load data cleanly, and produce analytical SQL under lab constraints.',
    method: [
      'DDL from ERD with supporting Regions data',
      'LOAD DATA patterns with explicit terminators (synthetic demo seed in portfolio)',
      'Geographic counts, RMA updates, returns-style queries',
      'Docker Compose MySQL 8 one-command local demo',
    ],
    evidence: ['schema.md', 'sql/ run order', 'docker-compose.yml', 'MIT LICENSE'],
    result: 'Working schema + documented queries a reviewer can re-run locally.',
    hireSignal: 'Data-model → DDL → load → analysis discipline for support engineering and cloud-adjacent roles.',
  },
  {
    id: 'cyb-260',
    course: 'CYB-260',
    name: 'CIS Controls + HIPAA-aligned SLA brief',
    bestFor: 'IT risk / GRC',
    problem:
      'Fit-vantage needed Helios Health Insurance SLA confidence while a data-sharing partnership raised privacy ethics flags.',
    method: [
      'Scoped CIS Controls 5, 6, and 14 to IAM, least privilege, MFA, time-bound elevation, automated joiner/mover/leaver',
      'Proposed measurable phishing simulations and LMS-tracked awareness',
      'Mapped CCPA/GDPR/HIPAA fair information practices; pushed explicit opt-in / BAA-style safeguards',
    ],
    evidence: ['case-study.md — control → implementation → SLA table', 'Privacy / ethics appendix'],
    result: 'Board-ready academic brief tying technical controls to SLA language without pretending ethics are optional.',
    hireSignal: 'Identity/access and compliance conversation skills for analyst and GRC interviews.',
  },
  {
    id: 'cyb-250',
    course: 'CYB-250',
    name: 'Bluetooth headset security strategy',
    bestFor: 'Threat modeling',
    problem:
      'Mid-sized manufacturer Bluetooth headset system needed a defensive strategy against MitM and malware risk — academic case, not a client engagement.',
    method: [
      'Built comparative threat models (Sony/OPM/Target; banking MitM; Bluetooth CVE-2018-5383 framing)',
      'Combined awareness training, VPN-encrypted paths (IPSec/SSL; AES/RSA discussion), and EDR monitoring',
      'Mapped impacts to CIA objectives',
    ],
    evidence: ['case-study.md — architecture + threat tables + strategy', 'Explicit “not a pen test” banner'],
    result: 'Coherent defensive strategy document with adversarial framing and honest scope limits.',
    hireSignal: 'Threat-modeling muscle for analyst interviews — without claiming live exploit portfolio.',
  },
]

export const LABS = CASE_FILES.map((c) => ({
  course: c.course,
  name: c.name,
  line: c.problem,
  bestFor: c.bestFor,
}))

export type FeaturedProject = {
  id: string
  name: string
  tag: string
  line: string
  href: string
  live?: string
  favorite?: boolean
}

export const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    id: 'logdetect',
    name: 'Log anomaly detection',
    tag: 'Security operations',
    line: 'Rule-plus-statistics detector for brute force, port scans, off-hours file access, and privilege-escalation patterns — with severity-ranked JSON alerts.',
    href: 'https://github.com/KM-it-ops/security-log-anomaly-detection',
    favorite: true,
  },
  {
    id: 'phishing',
    name: 'Phishing email classifier',
    tag: 'Detection',
    line: 'URL, PII, and typosquat features plus TF-IDF into a Random Forest — train/test split and cross-validation in a public repo.',
    href: 'https://github.com/KM-it-ops/phishing-email-classifier',
  },
  {
    id: 'vulntrack',
    name: 'VulnTrack dashboard',
    tag: 'Vulnerability management',
    line: 'Flask/SQLite tracker with severity KPIs, status workflow, and a small REST API — the ticket pattern VM teams use.',
    href: 'https://github.com/KM-it-ops/Vulnerability-Management-Mini-Program',
  },
  {
    id: 'promptrig',
    name: 'PromptRig',
    tag: 'Engineering / PromptOps',
    line: 'Offline eval harness for prompt pipelines (clarify, compile, self-heal). Engineering proof — not a substitute for operations tenure.',
    href: 'https://github.com/KM-it-ops/PromptRig',
  },
]

export type SideProject = {
  name: string
  line: string
  href: string
}

export const SIDE_PROJECTS: SideProject[] = [
  { name: 'PromptRig', line: 'Flagship PromptOps framework v1.3 — model-specific clarify → compile → self-heal; offline eval harness.', href: 'https://github.com/KM-it-ops/PromptRig' },
  { name: 'AgentForge', line: 'Config framework for agentic coding assistants.', href: 'https://github.com/KM-it-ops/AgentForge' },
  { name: 'OFG Dairy Site', line: 'Client-facing dairy business site.', href: 'https://ofg-sites.vercel.app/' },
]

export const RESUME_PDF = '/resume.html'
export const RESUME_LABEL = 'Resume PDF'
export const ETHOS =
  'Every claim maps to coursework, a credential, or a public repo. Hands-on vs exposure is labeled. No invented SIEM tenure.'
