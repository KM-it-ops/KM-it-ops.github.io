/** BRIEF facts only. See ../content/BRIEF.md */

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
  title: 'From aviation security ops to security analysis',
  body: [
    'I spent eight years as an Aviation Security Operations Crew Chief at American Airlines. The job was CBP-badged identity checks, access control, and incident notes in a federally regulated environment, where a sloppy write-up had real consequences.',
    'After that, while working logistics jobs, I finished a B.S. in Information Technologies with a Cybersecurity concentration at SNHU, Summa Cum Laude with a 3.96 GPA, and earned CompTIA Security+. I also shipped three public Python projects: a log anomaly detector, a phishing classifier, and a vulnerability tracker.',
    'Proofhouse and AgentForge are side projects that show I can design and ship software. My coursework labs are labeled as labs. Where I only have classroom exposure to a tool, I say so rather than dress it up as experience.',
  ],
  seeking:
    'Looking for a junior security analyst, security operations, vulnerability management, or IT risk role in Charlotte or remote.',
} as const

export const HIRE_BRIEF = [
  {
    label: 'What I want',
    text: 'A junior security analyst, security operations, VM, or IT risk seat where I triage, document, and learn the stack from the inside.',
  },
  {
    label: 'What I bring',
    text: 'Eight years of regulated-ops habits, Security+, a 3.96 Summa finish, and public detection and VM projects you can clone and run.',
  },
  {
    label: 'What I won\'t claim',
    text: 'Enterprise SIEM tenure or production detection ownership I have not done yet.',
  },
] as const

export const CREDENTIALS = {
  secPlus: 'CompTIA Security+ ce (SY0-701)',
  secPlusDates: 'Issued Jan 7, 2025 · Valid through Jan 7, 2028',
  degree:
    'B.S. Information Technologies, Cybersecurity concentration, Southern New Hampshire University',
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
      { name: 'Network troubleshooting', proof: 'Packet Tracer ping loss, retest, and a WLAN/DHCP/VLAN config scavenger' },
      { name: 'Windows GPO hardening', proof: 'Six settings applied in GNS3, each with its policy path and registry key' },
      { name: 'MySQL / SQL', proof: 'ERD to schema, synthetic load, analytical queries, and a Docker demo' },
    ],
  },
  {
    tier: 'Academic writing',
    items: [
      { name: 'Incident analysis (CIA / NIST)', proof: 'Payroll integrity brief arguing for least privilege and defense in depth' },
      { name: 'IAM / CIS Controls', proof: 'CIS 5/6/14 mapped to a HIPAA-aligned SLA for stakeholders' },
      { name: 'Threat modeling', proof: 'Comparative attacker models and a Bluetooth CVE case (academic)' },
      { name: 'Cloud BCDR planning', proof: 'Academic ops plan with RTO/RPO targets, DR drills, and vendor tiers' },
    ],
  },
  {
    tier: 'Exposure',
    items: [
      { name: 'SIEM vocabulary', proof: 'Splunk and Sentinel concepts from study, not production tenure' },
      { name: 'Python security tooling', proof: 'Log anomaly detector, phishing classifier, and Flask vuln tracker, all public' },
    ],
  },
]

export const OPERATING = [
  {
    title: 'Retest before you close',
    source: 'CYB-210 Packet Tracer',
    body: 'The first ping dropped a packet. Instead of calling it a pass or a fail, I repeated the test, compared host pairs, and wrote up both the anomaly and the recovery. That is the same habit a junior analyst needs before closing a ticket.',
  },
  {
    title: 'Map intent to the real control',
    source: 'CYB-220 GPO lab',
    body: 'The lab gave me hardening outcomes with no click-paths. I used the Microsoft policy reference to find the User versus Machine locations and the registry keys behind each setting, then verified every change in the guest.',
  },
  {
    title: 'Name the broken property first',
    source: 'CYB-200 incident brief',
    body: 'On a payroll abuse scenario I argued that integrity was the CIA property under attack, then chose least privilege and defense in depth as the controls. Not a shopping list of tools.',
  },
  {
    title: 'Brief stakeholders without watering down controls',
    source: 'CYB-260 CIS / HIPAA',
    body: 'I tied CIS Controls 5, 6, and 14 to SLA language a business reader could sign, and added an ethics appendix that refused "anonymized is fine" as a shortcut.',
  },
] as const

export const EXPERIENCE = [
  {
    title: 'Aviation Security Operations Crew Chief',
    org: 'American Airlines',
    loc: 'Charlotte, NC',
    dates: '2015–2023',
    detail:
      'Federally regulated operations under FAA, OSHA, IATA, and CBP, with a CBP badge endorsement. Recurrent incident-response and safety/security training. Daily identity validation, access control, and documentation that had to hold up to inspection.',
    transfer: [
      'Ticket-quality documentation under inspection pressure',
      'Identity validation and access control habits',
      'Escalation with clear facts and a timed response',
    ],
  },
  {
    title: 'Courier & Logistics Specialist',
    org: 'USPS',
    loc: 'Kannapolis, NC',
    dates: '2024–2025',
    detail: 'Time-critical courier and logistics work while finishing the degree.',
    transfer: ['Hard time windows', 'Exception handling'],
  },
  {
    title: 'Delivery Associate',
    org: 'Fossa Logistics LLC (Amazon DSP)',
    loc: 'Charlotte, NC',
    dates: '2025–present',
    detail:
      'High-tempo logistics with route prioritization, customer exceptions, and hard time windows, alongside finishing the degree and the security portfolio.',
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
      'Validate marketing and advertising LAN reachability in Packet Tracer after the first ping from PC1_Marketing to PC3_Marketing dropped a packet, then inventory a live lab topology from the CLI.',
    method: [
      'Did not treat a single flaky ping as the final answer',
      'Retested and compared the required host pairs, including the printer and advertising checks',
      'Documented wireless DHCP, guest WLAN limits, static LAN IPs, admin-down ports, VLANs 35/65/99, and ASA adjacency',
    ],
    evidence: [
      'troubleshooting.md: failure and recovery',
      'scavenger-findings.md: addressing tables',
      'topology.md: mermaid lab map',
    ],
    result:
      'The retest succeeded with all packets received. The write-up shows the anomaly and the recovery, not just a clean pass.',
    hireSignal:
      'Retest, compare, and document before you escalate or close. Same muscle a junior analyst uses every shift.',
  },
  {
    id: 'cyb-220',
    course: 'CYB-220',
    name: 'Windows GPO hardening in GNS3',
    bestFor: 'Security analyst',
    problem:
      'Apply six endpoint restrictions on a GNS3 Windows guest from outcome descriptions alone, with no click-by-click instructions.',
    method: [
      'Mapped each outcome to its User or Machine policy path using the Microsoft policy reference',
      'Applied Control Panel hide, Task Manager disable, Recycle Bin icon removal, delete-notification off, HTTP printing off, and IE menu bar on',
      'Recorded the registry key behind each setting and verified the behavior in the guest',
    ],
    evidence: [
      'gpo-checklist.md: setting, path, registry key, observed effect',
      'All six hardenings documented',
    ],
    result:
      'A complete checklist showing that a hardening requirement can be turned into concrete GPO and registry controls.',
    hireSignal:
      'Desktop support and baseline hardening skill. Not a claim of managing GPMC across an enterprise fleet.',
  },
  {
    id: 'dad-220',
    course: 'DAD-220',
    name: 'MySQL QuantigrationUpdates',
    bestFor: 'Systems / data',
    problem:
      'Stand up the QuantigrationUpdates database from an ERD (Customers, Orders, RMA), load data cleanly, and write analytical SQL under lab constraints.',
    method: [
      'Wrote DDL from the ERD, with supporting Regions data',
      'Used LOAD DATA with explicit terminators (the portfolio ships a synthetic seed)',
      'Wrote geographic counts, RMA updates, and returns-style queries',
      'Added a Docker Compose MySQL 8 setup so the demo starts with one command',
    ],
    evidence: ['schema.md', 'sql/ run order', 'docker-compose.yml', 'MIT LICENSE'],
    result: 'A working schema and documented queries a reviewer can re-run locally.',
    hireSignal: 'Data model to DDL to load to analysis, the discipline support engineering and cloud-adjacent roles expect.',
  },
  {
    id: 'cyb-260',
    course: 'CYB-260',
    name: 'CIS Controls + HIPAA-aligned SLA brief',
    bestFor: 'IT risk / GRC',
    problem:
      'Fit-vantage needed confidence in its Helios Health Insurance SLA while a data-sharing partnership raised privacy and ethics questions.',
    method: [
      'Scoped CIS Controls 5, 6, and 14 to IAM, least privilege, MFA, time-bound elevation, and automated joiner/mover/leaver',
      'Proposed measurable phishing simulations and LMS-tracked awareness training',
      'Mapped CCPA, GDPR, and HIPAA fair information practices, and pushed for explicit opt-in and BAA-style safeguards',
    ],
    evidence: ['case-study.md: control, implementation, SLA table', 'Privacy and ethics appendix'],
    result: 'A board-ready academic brief that ties technical controls to SLA language without treating ethics as optional.',
    hireSignal: 'The identity, access, and compliance conversation you have in analyst and GRC interviews.',
  },
  {
    id: 'cyb-250',
    course: 'CYB-250',
    name: 'Bluetooth headset security strategy',
    bestFor: 'Threat modeling',
    problem:
      'A mid-sized manufacturer needed a defensive strategy for its Bluetooth headset system against MitM and malware risk. Academic case, not a client engagement.',
    method: [
      'Built comparative threat models (Sony, OPM, Target; banking MitM; Bluetooth CVE-2018-5383)',
      'Combined awareness training, VPN-encrypted paths (IPSec/SSL with an AES/RSA discussion), and EDR monitoring',
      'Mapped each impact to a CIA objective',
    ],
    evidence: ['case-study.md: architecture, threat tables, strategy', 'Explicit "not a pen test" banner'],
    result: 'A coherent defensive strategy with adversarial framing and honest scope limits.',
    hireSignal: 'Threat-modeling practice for analyst interviews, without pretending to a live exploit portfolio.',
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
    line: 'A rule-based and statistical detector for brute force, port scans, off-hours file access, and privilege escalation. Writes severity-ranked JSON alerts you can hand to anything downstream.',
    href: 'https://github.com/KM-it-ops/security-log-anomaly-detection',
    favorite: true,
  },
  {
    id: 'phishing',
    name: 'Phishing email classifier',
    tag: 'Detection',
    line: 'Pulls URL, PII, and typosquat features out of email text, adds TF-IDF, and trains a Random Forest. The train/test split and cross-validation are in the repo, not just the headline number.',
    href: 'https://github.com/KM-it-ops/phishing-email-classifier',
  },
  {
    id: 'vulntrack',
    name: 'VulnTrack dashboard',
    tag: 'Vulnerability management',
    line: 'A Flask and SQLite tracker with severity KPIs, a status workflow, and a small REST API. The ticket pattern VM teams live in, at a size one person can read end to end.',
    href: 'https://github.com/KM-it-ops/Vulnerability-Management-Mini-Program',
  },
  {
    id: 'proofhouse',
    name: 'Proofhouse',
    tag: 'Engineering / PromptOps',
    line: 'A local prompt toolkit I wrote in Python, currently 0.2.1. Two CLIs: proofhouse-compiler turns requirements into a model-specific prompt offline, and proofhouse runs evals against JSONL cases and YAML rubrics. The certified path never touches the network and needs no API key. Ships a Cursor skill. Not a hosted product, no benchmark claims, and not a stand-in for operations experience.',
    href: 'https://github.com/KM-it-ops/Proofhouse',
  },
]

export type SideProject = {
  name: string
  line: string
  href: string
}

export const SIDE_PROJECTS: SideProject[] = [
  { name: 'AgentForge', line: 'Config framework for agentic coding assistants, with adapters for several hosts.', href: 'https://github.com/KM-it-ops/AgentForge' },
  { name: 'OFG Dairy Site', line: 'A small client-facing site for a dairy business.', href: 'https://ofg-sites.vercel.app/' },
]

export const RESUME_PDF = '/resume.html'
export const RESUME_LABEL = 'Resume PDF'
export const ETHOS =
  'Every claim on this page maps to a course write-up, a credential, or a public repo. Hands-on work and classroom exposure are labeled differently. Nothing here is padded.'
