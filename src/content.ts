/** BRIEF facts only — see ../content/BRIEF.md + MASTER_CAREER_CONTEXT */

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
  role: 'IT Support / SOC Analyst',
  available: 'Available for full-time roles',
  targets: [
    'IT Support',
    'SOC Analyst',
    'Cloud Support Associate',
    'Junior Penetration Tester',
  ],
} as const

export const THROUGHLINE = {
  title: 'Regulated ops → cyber degree → inspectable labs',
  body: [
    'I spent eight years as an Aviation Security Operations Crew Chief at American Airlines — security clearance, CBP badge, identity validation, access control, and incident documentation in a federally regulated environment.',
    'I finished a B.S. in Information Technologies with a cybersecurity concentration at SNHU (Summa Cum Laude, 3.96 GPA), earned CompTIA Security+, and rebuilt my strongest coursework into case files a hiring manager can actually read.',
    'I am targeting IT Support and Tier-1 SOC roles. I do not invent SIEM production tenure. Packet Tracer, GPO labs, SQL, and control briefs are the hands-on proof. Side AI tooling exists — it does not lead.',
  ],
  seeking:
    'Tier-1 SOC or IT Support where documentation discipline, access-control habits, and retest-before-escalate troubleshooting matter.',
} as const

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
      {
        name: 'Network troubleshooting',
        proof: 'Packet Tracer ping loss → retest; WLAN/DHCP/VLAN scavenger',
      },
      {
        name: 'Windows GPO hardening',
        proof: 'Six settings in GNS3 with policy paths + registry keys',
      },
      {
        name: 'MySQL / SQL',
        proof: 'ERD → schema, synthetic load, analytical queries + Docker demo',
      },
    ],
  },
  {
    tier: 'Academic writing',
    items: [
      {
        name: 'Incident analysis (CIA / NIST)',
        proof: 'Payroll integrity brief → least privilege + defense in depth',
      },
      {
        name: 'IAM / CIS Controls',
        proof: 'CIS 5/6/14 + HIPAA-aligned SLA stakeholder brief',
      },
      {
        name: 'Threat modeling',
        proof: 'Comparative attacker models; Bluetooth CVE framing (academic)',
      },
      {
        name: 'Cloud BCDR planning',
        proof: 'Academic ops plan with RTO/RPO, DR drills, vendor tiers',
      },
    ],
  },
  {
    tier: 'Exposure',
    items: [
      {
        name: 'SIEM vocabulary',
        proof: 'Splunk/Sentinel concepts from recommendations — not production tenure',
      },
      {
        name: 'Intro Python',
        proof: 'Variables, branching, loops — developing, not portfolio automation yet',
      },
    ],
  },
]

export const OPERATING = [
  {
    title: 'Retest before you close',
    source: 'CYB-210 Packet Tracer',
    body: 'First ping looked flaky. I repeated the test, compared pairs, and documented both the anomaly and the recovery — the same habit Tier-1 support and SOC need.',
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
      'Federally regulated operations under FAA, OSHA, IATA, and CBP. Security clearance with CBP badge endorsement. Recurrent incident-response and safety/security training. High-accountability documentation, identity validation, and access control.',
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
      'High-tempo logistics — route prioritization, customer exceptions, hard time windows — while finishing the degree and lab portfolio.',
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
    bestFor: 'IT Support / SOC',
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
      'Same muscle as helpdesk/SOC: retest, compare, document before you escalate or close.',
  },
  {
    id: 'cyb-220',
    course: 'CYB-220',
    name: 'Windows GPO hardening in GNS3',
    bestFor: 'IT Support / SOC',
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
    bestFor: 'Cloud / Automation',
    problem:
      'Stand up QuantigrationUpdates from an ERD — Customers, Orders, RMA — load data cleanly, and produce analytical SQL under lab constraints.',
    method: [
      'DDL from ERD with supporting Regions data',
      'LOAD DATA patterns with explicit terminators (synthetic demo seed in portfolio)',
      'Geographic counts, RMA updates, returns-style queries',
      'Docker Compose MySQL 8 one-command local demo',
    ],
    evidence: ['schema.md', 'sql/ run order', 'docker-compose.yml', 'MIT LICENSE'],
    result:
      'Working schema + documented queries a reviewer can re-run locally.',
    hireSignal:
      'Data-model → DDL → load → analysis discipline for support engineering and cloud-adjacent roles.',
  },
  {
    id: 'cyb-260',
    course: 'CYB-260',
    name: 'CIS Controls + HIPAA-aligned SLA brief',
    bestFor: 'SOC / Cloud Support',
    problem:
      'Fit-vantage needed Helios Health Insurance SLA confidence while a data-sharing partnership raised privacy ethics flags.',
    method: [
      'Scoped CIS Controls 5, 6, and 14 to IAM, least privilege, MFA, time-bound elevation, automated joiner/mover/leaver',
      'Proposed measurable phishing simulations and LMS-tracked awareness',
      'Mapped CCPA/GDPR/HIPAA fair information practices; pushed explicit opt-in / BAA-style safeguards',
    ],
    evidence: [
      'case-study.md — control → implementation → SLA table',
      'Privacy / ethics appendix',
    ],
    result:
      'Board-ready academic brief tying technical controls to SLA language without pretending ethics are optional.',
    hireSignal:
      'Identity/access and compliance conversation skills for SOC and cloud support interviews.',
  },
  {
    id: 'cyb-250',
    course: 'CYB-250',
    name: 'Bluetooth headset security strategy',
    bestFor: 'SOC / Jr PenTest',
    problem:
      'Mid-sized manufacturer Bluetooth headset system needed a defensive strategy against MitM and malware risk — academic case, not a client engagement.',
    method: [
      'Built comparative threat models (Sony/OPM/Target; banking MitM; Bluetooth CVE-2018-5383 framing)',
      'Combined awareness training, VPN-encrypted paths (IPSec/SSL; AES/RSA discussion), and EDR monitoring',
      'Mapped impacts to CIA objectives',
    ],
    evidence: [
      'case-study.md — architecture + threat tables + strategy',
      'Explicit “not a pen test” banner',
    ],
    result:
      'Coherent defensive strategy document with adversarial framing and honest scope limits.',
    hireSignal:
      'Threat-modeling muscle for SOC/Jr PenTest interviews — without claiming live exploit portfolio.',
  },
]

/** Kept for older design previews */
export const LABS = CASE_FILES.map((c) => ({
  course: c.course,
  name: c.name,
  line: c.problem,
  bestFor: c.bestFor,
}))

export type SideProject = {
  name: string
  line: string
  href: string
}

export const SIDE_PROJECTS: SideProject[] = [
  {
    name: 'AgentForge',
    line: 'Config framework for agentic coding assistants — secondary to coursework proof.',
    href: 'https://github.com/KM-it-ops/AgentForge',
  },
  {
    name: 'ATT&CKLens Benchmark',
    line: 'Defensive MITRE ATT&CK-aligned agent benchmark — secondary.',
    href: 'https://github.com/KM-it-ops/AgentForge-ATT-CKLens-Benchmark',
  },
]

export const RESUME_PDF = '/Michael_Kurdi_Resume_2026.pdf'

export const ETHOS =
  'Every claim maps to a coursework writeup, credential, or public repo. Hands-on vs exposure is labeled.'
