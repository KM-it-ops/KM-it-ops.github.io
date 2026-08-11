import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import {
  CASE_FILES,
  CREDENTIALS,
  ETHOS,
  EXPERIENCE,
  OPERATING,
  PERSON,
  RESUME_PDF,
  SIDE_PROJECTS,
  SKILL_BANDS,
  THROUGHLINE,
} from '../content'
import { Reveal, Toast, useCopyToast } from './shared'
import './mash.css'
import './mash-palettes.css'
import './mash-layouts.css'

const HeroScene = lazy(async () => {
  const mod = await import('../HeroScene')
  return { default: mod.HeroScene }
})

type MashPaletteId =
  | 'mood'
  | 'clubroom'
  | 'forest'
  | 'twilight'
  | 'mermaid'
  | 'mineral'
  | 'restorative'
  | 'mocha'
  | 'grit'
  | 'mono'

const MASH_PALETTES: {
  id: MashPaletteId
  label: string
  layout: string
  theme: 'dark' | 'light'
  chips: [string, string, string]
}[] = [
  {
    id: 'mood',
    label: 'Mood Mode',
    layout: 'Lumen Dash',
    theme: 'dark',
    chips: ['#1c1a27', '#a78bfa', '#00f5d4'],
  },
  {
    id: 'clubroom',
    label: 'Clubroom',
    layout: 'Editorial Void',
    theme: 'dark',
    chips: ['#0a0a0a', '#7dd3fc', '#e2e8f0'],
  },
  {
    id: 'forest',
    label: 'Neon Forest',
    layout: 'Neo-Brutal',
    theme: 'dark',
    chips: ['#06140c', '#4ade80', '#39ff14'],
  },
  {
    id: 'twilight',
    label: 'Twilight',
    layout: 'Retro-Kinetic',
    theme: 'dark',
    chips: ['#0b0a1a', '#ff2d95', '#2ad4ff'],
  },
  {
    id: 'mermaid',
    label: 'Mermaid',
    layout: 'Fluid Mesh',
    theme: 'dark',
    chips: ['#061428', '#5ad4d4', '#00ced1'],
  },
  {
    id: 'mineral',
    label: 'Cool Mineral',
    layout: 'Swiss Grid',
    theme: 'light',
    chips: ['#eef1f4', '#0369a1', '#0ea5e9'],
  },
  {
    id: 'restorative',
    label: 'Restorative',
    layout: 'Soft Minimal',
    theme: 'light',
    chips: ['#f0f0eb', '#52796f', '#354f52'],
  },
  {
    id: 'mocha',
    label: 'Mocha Mousse',
    layout: 'Magazine',
    theme: 'light',
    chips: ['#f3eee8', '#5b21b6', '#6d28d9'],
  },
  {
    id: 'grit',
    label: 'Warm Grit',
    layout: 'Organic Grain',
    theme: 'light',
    chips: ['#faedcd', '#115e59', '#283618'],
  },
  {
    id: 'mono',
    label: 'Mono Pop',
    layout: 'Stamp Brutal',
    theme: 'light',
    chips: ['#f5f5f5', '#2563eb', '#333333'],
  },
]

function initialPalette(): MashPaletteId {
  const raw = new URLSearchParams(window.location.search).get('palette')
  const hit = MASH_PALETTES.find((p) => p.id === raw)
  if (hit) return hit.id
  const i = Math.floor(Math.random() * MASH_PALETTES.length)
  return MASH_PALETTES[i]?.id ?? 'mood'
}

function useDocumentVisible() {
  const [visible, setVisible] = useState(
    () => typeof document === 'undefined' || document.visibilityState === 'visible',
  )
  useEffect(() => {
    const onVis = () => setVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])
  return visible
}

function MashNet({ reduced }: { reduced: boolean }) {
  const ref = useRef<SVGSVGElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced) {
      el.classList.add('is-on')
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          el.classList.add('is-on')
          io.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced])

  return (
    <svg ref={ref} className="mash-net" viewBox="0 0 900 520" aria-hidden>
      <path className="mn-w" d="M60 260 C180 90, 340 90, 450 260 S720 430, 840 250" />
      <path className="mn-w cyan" d="M100 140 L260 210 L420 130 L580 210 L760 150" />
      <path className="mn-w" d="M130 390 L290 300 L470 390 L650 300 L790 360" />
      <circle className="mn-n" cx="450" cy="260" r="11" />
      <circle className="mn-n cyan" cx="260" cy="210" r="7" />
      <circle className="mn-n" cx="580" cy="210" r="7" />
      <circle className="mn-n cyan" cx="290" cy="300" r="7" />
      <circle className="mn-n" cx="650" cy="300" r="7" />
    </svg>
  )
}

export default function MashDesign() {
  const { toast, copy } = useCopyToast()
  const reduced = Boolean(useReducedMotion())
  const pageVisible = useDocumentVisible()
  const featured = CASE_FILES.find((c) => c.featured) ?? CASE_FILES[0]
  const rest = CASE_FILES.filter((c) => c.id !== featured.id)
  const [palette, setPalette] = useState<MashPaletteId>(initialPalette)
  const [looksOpen, setLooksOpen] = useState(false)
  const looksRef = useRef<HTMLDivElement>(null)
  const active = useMemo(
    () => MASH_PALETTES.find((p) => p.id === palette) ?? MASH_PALETTES[0],
    [palette],
  )

  useEffect(() => {
    document.title = `${PERSON.name} — SOC / IT Support`
  }, [])

  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.delete('design')
    url.searchParams.set('palette', palette)
    window.history.replaceState({}, '', url)
    const theme = document.querySelector('meta[name="theme-color"]')
    if (theme) {
      theme.setAttribute('content', active.theme === 'light' ? '#f0f0eb' : '#070b0a')
    }
  }, [palette, active.theme])

  useEffect(() => {
    if (!looksOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLooksOpen(false)
    }
    const onPointer = (e: MouseEvent) => {
      const el = looksRef.current
      if (el && !el.contains(e.target as Node)) setLooksOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('mousedown', onPointer)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('mousedown', onPointer)
    }
  }, [looksOpen])

  return (
    <div
      className="mash-root"
      data-palette={palette}
      data-theme={active.theme}
      data-layout={active.layout}
    >
      <div className="mash-atmosphere" aria-hidden />
      <div className="mash-planet" aria-hidden>
        <Suspense fallback={null}>
          <HeroScene
            reducedMotion={reduced}
            visible={pageVisible}
            phase={0}
            allowPointer={pageVisible}
            className="mash-planet-canvas"
            cameraZ={5.6}
            lensScale={1.08}
          />
        </Suspense>
      </div>
      <a className="skip" href="#mash-main">
        Skip to content
      </a>

      <header className="mash-nav">
        <span className="mash-logo">{PERSON.short}</span>
        <nav aria-label="Primary">
          <a href="#mash-story">Story</a>
          <a href="#mash-skills">Skills</a>
          <a href="#mash-cases">Cases</a>
          <a href="#mash-path">Path</a>
          <a href={RESUME_PDF} target="_blank" rel="noreferrer">
            Resume
          </a>
        </nav>
        <div className="mash-nav-hire">
          <a href={`mailto:${PERSON.email}`}>Email</a>
          <a href={RESUME_PDF} target="_blank" rel="noreferrer">
            Resume
          </a>
        </div>
      </header>

      <main id="mash-main">
        <section className="mash-hero">
          <MashNet reduced={reduced} />
          <div className="mash-hero-grid">
            <div className="mash-hero-copy">
              <p className="mash-kicker">New graduate · Security+ · Charlotte</p>
              <h1>
                <span>Michael</span>
                <span className="mash-name-2">Kurdi</span>
              </h1>
              <p className="mash-line">{THROUGHLINE.seeking}</p>
              <div className="mash-cta">
                <a className="mash-btn" href={RESUME_PDF} target="_blank" rel="noreferrer">
                  Resume PDF
                </a>
                <a className="mash-btn ghost" href="#mash-cases">
                  Open case files
                </a>
              </div>
            </div>
            <div className="mash-hero-rail">
              <aside className="mash-hire-box" aria-label="Hire me">
                <p className="mash-hire-box-title">Hire me</p>
                <p className="mash-hire-box-meta">
                  {PERSON.city} · Remote · {PERSON.available}
                </p>
                <ul className="mash-hire-box-list">
                  <li>
                    <a href={`mailto:${PERSON.email}`}>{PERSON.email}</a>
                  </li>
                  <li>
                    <a href={`tel:${PERSON.phoneTel}`}>{PERSON.phone}</a>
                  </li>
                  <li>
                    <a href={PERSON.github} target="_blank" rel="noreferrer">
                      github.com/KM-it-ops
                    </a>
                  </li>
                  <li>
                    <a href={PERSON.linkedin} target="_blank" rel="noreferrer">
                      LinkedIn
                    </a>
                  </li>
                </ul>
                <p className="mash-hire-box-legal">Legal / forms: {PERSON.legal}</p>
                <div className="mash-hire-box-actions">
                  <a href={RESUME_PDF} target="_blank" rel="noreferrer">
                    Resume PDF
                  </a>
                  <button type="button" onClick={() => void copy(PERSON.email, 'email')}>
                    Copy email
                  </button>
                </div>
              </aside>
              <div className="mash-hero-stats">
                <div>
                  <p className="mash-stat">{CREDENTIALS.gpa}</p>
                  <p>GPA · Summa Cum Laude</p>
                </div>
                <div>
                  <p className="mash-stat cyan">Sec+</p>
                  <p>{CREDENTIALS.secPlusDates}</p>
                </div>
                <div>
                  <p className="mash-stat coral">8y</p>
                  <p>Aviation security ops · AA</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mash-marquee" aria-hidden>
          <div className="mash-marquee-track">
            {Array.from({ length: 2 }).map((_, i) => (
              <span key={i}>
                Packet Tracer · GPO Hardening · MySQL · CIS Controls · Threat
                Models · Aviation Ops · Security+ · Summa 3.96 ·&nbsp;
              </span>
            ))}
          </div>
        </div>

        <section className="mash-story" id="mash-story">
          <Reveal>
            <p className="mash-chapter">Throughline</p>
            <h2>
              {THROUGHLINE.title.split('→')[0]}
              <em>→</em>
              {THROUGHLINE.title.split('→').slice(1).join('→')}
            </h2>
          </Reveal>
          <div className="mash-story-grid">
            {THROUGHLINE.body.map((p, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <p className="mash-story-p">{p}</p>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mash-ethos">{ETHOS}</p>
          </Reveal>
        </section>

        <section className="mash-skills" id="mash-skills">
          <Reveal>
            <p className="mash-chapter">Capability map</p>
            <h2>
              What I can <em>prove</em>
            </h2>
            <p className="mash-lede">
              Labeled by evidence strength — hands-on lab, academic writing, or
              exposure only. No inflated SIEM years.
            </p>
          </Reveal>
          <div className="mash-skill-bands">
            {SKILL_BANDS.map((band, bi) => (
              <Reveal key={band.tier} delay={bi * 0.05}>
                <div className="mash-skill-band">
                  <h3>{band.tier}</h3>
                  <ul>
                    {band.items.map((item) => (
                      <li key={item.name}>
                        <strong>{item.name}</strong>
                        <span>{item.proof}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mash-cases" id="mash-cases">
          <Reveal>
            <p className="mash-chapter">Case files</p>
            <h2>
              Work under <em>inspection</em>
            </h2>
            <p className="mash-lede">
              Problem → method → evidence → hire signal. Academic reconstructions
              from SNHU coursework — content-complete locally; public GitHub
              publish pending your authority.
            </p>
          </Reveal>

          <Reveal>
            <article className="mash-featured" id={featured.id}>
              <div className="mash-featured-top">
                <span className="mash-pill">{featured.course}</span>
                <span className="mash-pill ghost">{featured.bestFor}</span>
                <span className="mash-pill coral">Featured</span>
              </div>
              <h3>{featured.name}</h3>
              <div className="mash-featured-grid">
                <div>
                  <h4>Problem</h4>
                  <p>{featured.problem}</p>
                  <h4>Result</h4>
                  <p>{featured.result}</p>
                  <p className="mash-hire">{featured.hireSignal}</p>
                </div>
                <div>
                  <h4>Method</h4>
                  <ol>
                    {featured.method.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ol>
                  <h4>Evidence artifacts</h4>
                  <ul className="mash-evidence">
                    {featured.evidence.map((e) => (
                      <li key={e}>{e}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          </Reveal>

          <div className="mash-case-stack">
            {rest.map((c, i) => (
              <Reveal key={c.id} delay={i * 0.04}>
                <article className={`mash-case tone-${(i % 3) + 1}`} id={c.id}>
                  <div className="mash-case-head">
                    <div className="mash-lab-meta">
                      <span>{c.course}</span>
                      <span>{c.bestFor}</span>
                    </div>
                    <h3>{c.name}</h3>
                  </div>
                  <div className="mash-case-body">
                    <div>
                      <h4>Problem</h4>
                      <p>{c.problem}</p>
                    </div>
                    <div>
                      <h4>Method</h4>
                      <ul>
                        {c.method.map((m) => (
                          <li key={m}>{m}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4>Evidence</h4>
                      <ul className="mash-evidence">
                        {c.evidence.map((e) => (
                          <li key={e}>{e}</li>
                        ))}
                      </ul>
                      <h4>Hire signal</h4>
                      <p>{c.hireSignal}</p>
                    </div>
                  </div>
                  <span className="mash-lab-num" aria-hidden>
                    {String(i + 2).padStart(2, '0')}
                  </span>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mash-ops" id="mash-ops">
          <Reveal>
            <p className="mash-chapter">How I work</p>
            <h2>
              Habits from the <em>labs</em>
            </h2>
          </Reveal>
          <div className="mash-ops-grid">
            {OPERATING.map((o, i) => (
              <Reveal key={o.title} delay={i * 0.05}>
                <article className="mash-ops-card">
                  <p className="mash-ops-src">{o.source}</p>
                  <h3>{o.title}</h3>
                  <p>{o.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mash-path" id="mash-path">
          <Reveal>
            <p className="mash-chapter">Path</p>
            <h2>
              Ops first. <em>Degree second.</em>
            </h2>
          </Reveal>
          <div className="mash-jobs">
            {EXPERIENCE.map((job, i) => (
              <Reveal key={job.title} delay={i * 0.05}>
                <article className="mash-job">
                  <p className="mash-job-year">{job.dates}</p>
                  <h3>{job.title}</h3>
                  <p className="mash-job-org">
                    {job.org} · {job.loc}
                  </p>
                  <p>{job.detail}</p>
                  <ul className="mash-transfer">
                    {job.transfer.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mash-creds" id="mash-creds">
          <Reveal>
            <p className="mash-chapter">Credentials</p>
            <h2>
              Filters that <em>pass</em>
            </h2>
            <div className="mash-cred-grid">
              <div>
                <h3>{CREDENTIALS.degree}</h3>
                <p>
                  {CREDENTIALS.degreeDates}. {CREDENTIALS.honors}.
                </p>
              </div>
              <div>
                <h3>{CREDENTIALS.secPlus}</h3>
                <p>{CREDENTIALS.secPlusDates}</p>
              </div>
              <div>
                <h3>Targets</h3>
                <p>{PERSON.targets.join(' · ')}</p>
              </div>
            </div>
          </Reveal>
        </section>

        <section className="mash-side">
          <Reveal>
            <p className="mash-chapter">Also building</p>
            <p className="mash-lede light">
              Secondary. Does not replace coursework proof.
            </p>
            <ul>
              {SIDE_PROJECTS.map((p) => (
                <li key={p.name}>
                  <a href={p.href} target="_blank" rel="noreferrer">
                    {p.name}
                  </a>
                  <span>{p.line}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        <footer className="mash-foot">
          <span>{PERSON.name}</span>
          <span>
            {PERSON.city} · {active.label}
          </span>
        </footer>
      </main>

      <div
        ref={looksRef}
        className={`mash-looks${looksOpen ? ' is-open' : ''}`}
        data-open={looksOpen ? 'true' : 'false'}
      >
        <button
          type="button"
          className="mash-looks-toggle"
          aria-expanded={looksOpen}
          aria-controls={looksOpen ? 'mash-looks-panel' : undefined}
          onClick={() => setLooksOpen((v) => !v)}
        >
          <span className="mash-looks-orbits" aria-hidden>
            {active.chips.map((c) => (
              <span key={c} style={{ background: c }} />
            ))}
          </span>
          <span className="mash-looks-copy">
            <span className="mash-looks-kicker">Look</span>
            <strong>{active.label}</strong>
          </span>
          <span className="mash-looks-chevron" aria-hidden>
            {looksOpen ? 'Close' : 'Change'}
          </span>
        </button>

        {looksOpen ? (
          <div
            id="mash-looks-panel"
            className="mash-looks-panel"
            role="region"
            aria-label="Choose a look"
          >
            <div className="mash-looks-head">
              <div>
                <p className="mash-looks-eyebrow">Atmosphere</p>
                <h2>Choose a look</h2>
                <p className="mash-looks-lede">
                  Color and layout travel together. A random look loads on each visit —
                  pick one to keep it.
                </p>
              </div>
              <p className="mash-looks-active">
                Now showing
                <strong>{active.label}</strong>
                <em>{active.layout}</em>
              </p>
            </div>
            <div className="mash-looks-grid">
              {MASH_PALETTES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="mash-look-card"
                  aria-pressed={palette === p.id}
                  onClick={() => {
                    setPalette(p.id)
                    setLooksOpen(false)
                  }}
                >
                  <span className="mash-look-card-preview" aria-hidden>
                    {p.chips.map((c) => (
                      <span key={c} style={{ background: c }} />
                    ))}
                  </span>
                  <span className="mash-look-card-meta">
                    <strong>{p.label}</strong>
                    <em>
                      {p.theme === 'dark' ? 'Night' : 'Day'} · {p.layout}
                    </em>
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <Toast message={toast} />
    </div>
  )
}
