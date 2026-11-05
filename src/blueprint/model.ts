/**
 * Blueprint Schematic view model. Everything here is derived from ../content.ts.
 * The only hand-written data is *structure* (which artifact a skill's `proof`
 * string names, and display order). No copy is invented here.
 */
import {
  CASE_FILES,
  FEATURED_PROJECTS,
  OPERATING,
  SIDE_PROJECTS,
  SKILL_BANDS,
  type FeaturedProject,
  type SideProject,
} from '../content'

export type Project = (FeaturedProject | SideProject) & { openLabel?: string }

const cyb200 = OPERATING[2]
const ALL: Project[] = [...FEATURED_PROJECTS, ...SIDE_PROJECTS]
const byId = (id: string): Project => {
  const p = ALL.find((x) => x.id === id)
  if (!p) throw new Error(`Unknown project id ${id}`)
  return p
}

/**
 * ONE ordered array drives the exploded assembly (Sheet 03) order.
 * Change the order here, nothing else. Current order = content.ts order with
 * the favorite (log anomaly detection) first and archived AgentForge last.
 */
export const PROJECT_ORDER = [
  'logdetect',
  'phishing',
  'vulntrack',
  'sniffoutpro',
  'attcklens',
  'proofhouse',
  'ir-playbooks',
  'cdp',
  'ofg',
  'agentforge',
] as const

export const PARTS = PROJECT_ORDER.map((id, i) => {
  const p = byId(id)
  return {
    p,
    no: `P-${String(i + 1).padStart(2, '0')}`,
    archived: p.tag === 'Archived',
    start: 'favorite' in p && !!p.favorite,
    href: p.live ?? p.href,
    linkLabel: p.openLabel ?? (p.tag === 'Archived' ? 'Open archived repo →' : 'Open repo →'),
  }
})

export const FEATURED = FEATURED_PROJECTS.find((p) => p.favorite) ?? FEATURED_PROJECTS[0]
export const firstSentence = (s: string) => (s.match(/^.*?[.!?](\s|$)/)?.[0] ?? s).trim()

export type Level = 'hands' | 'acad' | 'exp'
const LEVEL: Record<string, Level> = { 'Hands-on lab': 'hands', 'Academic writing': 'acad', Exposure: 'exp' }

export type Node = {
  id: string
  name: string
  kind: string
  level?: string
  l?: Level
  note: string
  to: string[]
  href?: string
  /** evidence links shown in the no-JS view */
  ev?: { href: string; label: string }[]
  connLabel?: string
}

/** Skill → evidence edges, each one named in that skill's `proof` string (SPEC §4). */
const SKILL_EDGES: Record<string, string[]> = {
  'Network troubleshooting': ['e-cyb210'],
  'Windows GPO hardening': ['e-cyb220'],
  'MySQL / SQL': ['e-dad220'],
  'Incident analysis (CIA / NIST)': ['e-cyb200'],
  'IAM / CIS Controls': ['e-cyb260'],
  'Threat modeling': ['e-cyb250'],
  'Cloud BCDR planning': [],
  'SIEM vocabulary': [],
  'Python security tooling': ['e-logdetect', 'e-phishing', 'e-vulntrack'],
  'Vulnerability scanning': ['e-sniffoutpro'],
}
/** Stable short DOM ids (match the prototype + its QA script). */
const SKILL_IDS: Record<string, string> = {
  'Network troubleshooting': 's-net',
  'Windows GPO hardening': 's-gpo',
  'MySQL / SQL': 's-sql',
  'Incident analysis (CIA / NIST)': 's-ir',
  'IAM / CIS Controls': 's-iam',
  'Threat modeling': 's-tm',
  'Cloud BCDR planning': 's-bcdr',
  'SIEM vocabulary': 's-siem',
  'Python security tooling': 's-py',
  'Vulnerability scanning': 's-vs',
}
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
/** project id → short DOM id */
export const shortId = (pid: string) => ({ 'ir-playbooks': 'ir' } as Record<string, string>)[pid] ?? pid
const labId = (cid: string) => `e-${cid.replace('-', '')}`

/** Lanes = project tags verbatim, with one presentation merge (SPEC §4 / Q3). */
const LANES: { id: string; name: string; note: string; from: string[] }[] = [
  { id: 'l-secops', name: 'Security operations', note: `Tag on: ${byId('logdetect').name}.`, from: ['logdetect'] },
  {
    id: 'l-detect',
    name: 'Detection',
    note: `Tag on: ${byId('phishing').name} · ${byId('attcklens').name} (${byId('attcklens').tag}).`,
    from: ['phishing', 'attcklens'],
  },
  {
    id: 'l-vm',
    name: 'Vulnerability management / assessment',
    note: `Tags on: ${byId('vulntrack').name} (${byId('vulntrack').tag}) · ${byId('sniffoutpro').name} (${byId('sniffoutpro').tag}).`,
    from: ['vulntrack', 'sniffoutpro'],
  },
  { id: 'l-ir', name: byId('ir-playbooks').tag, note: `Tag on: ${byId('ir-playbooks').name}.`, from: ['ir-playbooks'] },
  { id: 'l-ti', name: byId('cdp').tag, note: `Tag on: ${byId('cdp').name}.`, from: ['cdp'] },
  { id: 'l-eng', name: byId('proofhouse').tag, note: `Tag on: ${byId('proofhouse').name}, my main engineering side project.`, from: ['proofhouse'] },
  { id: 'l-labs', name: 'Coursework labs', note: 'My coursework labs are labeled as labs.', from: [] },
]
const laneOf = (pid: string) => LANES.find((l) => l.from.includes(pid))!.id

/** Evidence column order groups by lane to keep wires short. */
const EVIDENCE_REPOS = ['logdetect', 'phishing', 'attcklens', 'vulntrack', 'sniffoutpro', 'ir-playbooks', 'cdp', 'proofhouse']

export const SKILL_NODES: Node[] = SKILL_BANDS.flatMap((b) =>
  b.items.map((it) => {
    const to = SKILL_EDGES[it.name] ?? []
    return {
      id: SKILL_IDS[it.name] ?? `s-${slug(it.name)}`,
      name: it.name,
      kind: 'Skill',
      level: b.tier,
      l: LEVEL[b.tier],
      note: it.proof,
      to,
      ev: to.map((t) => ({ href: `#n-${t}`, label: evidenceName(t) })),
    }
  }),
)

const repoNode = (pid: string): Node => {
  const p = byId(pid)
  return { id: `e-${shortId(pid)}`, name: p.name, kind: 'Public repo', note: p.line, to: [laneOf(pid)], href: p.href }
}
const labHref = (id: string, i: number) => (i === 0 ? '#detail-a' : `#lab-${id}`)
const labNodes: Node[] = CASE_FILES.map((c, i) => ({
  id: labId(c.id),
  name: c.course,
  kind: 'Coursework lab',
  note: `${c.name}. Best for: ${c.bestFor}.`,
  to: ['l-labs'],
  href: labHref(c.id, i),
  connLabel: i === 0 ? 'Read the case file (Detail A) →' : 'See lab schedule →',
}))
const cyb200Node: Node = {
  id: 'e-cyb200',
  name: cyb200.source,
  kind: 'Coursework write-up',
  note: cyb200.body,
  to: ['l-labs'],
  href: '#note-3',
  connLabel: 'See general note 3 →',
}
export const EVIDENCE_NODES: Node[] = [...EVIDENCE_REPOS.map(repoNode), ...labNodes, cyb200Node]
export const LANE_NODES: Node[] = LANES.map((l) => ({ id: l.id, name: l.name, kind: 'Lane', note: l.note, to: [] }))

function evidenceName(id: string): string {
  if (id === 'e-cyb200') return cyb200.source
  const c = CASE_FILES.find((x) => labId(x.id) === id)
  if (c) return c.course
  return ALL.find((p) => `e-${shortId(p.id)}` === id)!.name
}
