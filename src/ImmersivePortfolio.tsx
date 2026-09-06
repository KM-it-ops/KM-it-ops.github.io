/**
 * Immersive Portfolio v2.9.1 — ceiling craft + performance.
 * v2.9 look retained; adaptive quality + code-split world. CoS facts unchanged.
 */
import { lazy, Suspense, useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { startSmoothScroll, useReducedMotionPref } from './motion'
import {
  CASE_FILES,
  CREDENTIALS,
  ETHOS,
  EXPERIENCE,
  FEATURED_PROJECTS,
  HIRE_BRIEF,
  OPERATING,
  PERSON,
  RESUME_PDF,
  SKILL_BANDS,
} from './content'
import { Reveal, Toast, useCopyToast } from './designs/shared'
import {
  AnimatedList,
  BlurText,
  CountUp,
  GlitchAccent,
  MagneticCTA,
  ScrambleHero,
  SkillsMarquee,
  SpotlightCard,
  TextPressure,
} from './craft'
import type { WorldPointers } from './ImmersiveWorld'
import type { QualityLevel } from './worldQuality'
import './immersive-portfolio.css'
import './craft/craft.css'

/** three / R3F / postprocessing only in this async chunk */
const ImmersiveWorld = lazy(() =>
  import('./ImmersiveWorld').then((m) => ({ default: m.ImmersiveWorld })),
)

function KmMark({ className = 'im-mark' }: { className?: string }) {
  return (
    <a className={className} href="#top" aria-label="Michael Kurdi — home" title="KM">
      <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          d="M32 5.5 L54.5 18.5 V45.5 L32 58.5 L9.5 45.5 V18.5 Z"
          fill="#0c0b10"
          stroke="#c45d2c"
          strokeWidth="1.75"
        />
        <g fill="#f5f0e8">
          <path d="M15 19h5.4v11.2L30.2 19h6.2L24.2 32.2 36.8 45h-6.4L20.4 33.4V45H15z" />
          <path d="M33.5 19h5.6l5.8 15.2L50.8 19H56.5v26H51.2V32.6L45.8 45h-4.2l-5.4-12.4V45h-5.3z" />
        </g>
        <path d="M20.4 32.2 L33.5 32.2" stroke="#c45d2c" strokeWidth="1.6" strokeLinecap="square" />
      </svg>
    </a>
  )
}

function PillNav({ velocity }: { velocity: number }) {
  const absV = Math.abs(velocity)
  const stretch = 1 + Math.min(absV * 3.4, 0.42)
  const squash = 2 - stretch
  const blur = Math.min(absV * 12, 4.2)
  const glow = Math.min(absV * 28, 18)
  return (
    <nav
      className="im-pill-nav"
      aria-label="Primary"
      style={{
        transform: `translateX(-50%) scaleX(${stretch}) scaleY(${squash})`,
        filter: blur > 0.15 ? `blur(${blur}px)` : undefined,
        boxShadow: `0 12px 40px rgba(0,0,0,0.45), 0 0 ${glow}px rgba(126,200,255,${0.12 + Math.min(absV, 0.35)}), inset 0 1px 0 rgba(255,255,255,0.05)`,
      }}
    >
      <KmMark className="im-mark im-mark-nav" />
      <a href="#work">WORK</a>
      <a href="#labs">LABS</a>
      <a href="#path">PATH</a>
      <a href="#contact">CONTACT</a>
      <MagneticCTA className="im-pill-cta im-pill-magnetic" href={RESUME_PDF} target="_blank" rel="noreferrer">
        RESUME
      </MagneticCTA>
    </nav>
  )
}

function SectionTitle({
  id,
  line1,
  line2,
}: {
  id: string
  line1: string
  line2: string
}) {
  return (
    <h2 id={id} className="im-display im-display-beat">
      <BlurText text={line1} as="span" className="im-display-line" />
      <br />
      <TextPressure className="im-display-line im-display-pressure" text={line2} as="span" />
    </h2>
  )
}

export default function ImmersivePortfolio() {
  const { toast, copy } = useCopyToast()
  const reduced = useReducedMotionPref()
  const ptr = useRef<WorldPointers>({
    x: 0,
    y: 0,
    ndcX: 0,
    ndcY: 0,
    scroll: 0,
    velocity: 0,
    worldVelocity: 0,
  })
  const [velocity, setVelocity] = useState(0)
  const [scrollProg, setScrollProg] = useState(0)
  const [quality, setQuality] = useState<QualityLevel | null>(null)
  const onQualityChange = useCallback((level: QualityLevel) => setQuality(level), [])
  const lastScroll = useRef(0)
  const lastTime = useRef(performance.now())
  const smoothV = useRef(0)
  const worldSmoothV = useRef(0)

  useEffect(() => {
    const stop = startSmoothScroll()
    return () => stop?.()
  }, [])

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const w = window.innerWidth || 1
      const h = window.innerHeight || 1
      ptr.current.x = e.clientX
      ptr.current.y = e.clientY
      ptr.current.ndcX = (e.clientX / w) * 2 - 1
      ptr.current.ndcY = -((e.clientY / h) * 2 - 1)
    }

    let raf = 0
    let decayRaf = 0
    let scrollIdleTimer = 0

    const publish = () => {
      setVelocity(ptr.current.velocity)
      setScrollProg(ptr.current.scroll)
    }

    const decayTick = () => {
      // Fast natural snap-back when finger/wheel stops
      smoothV.current *= 0.72
      worldSmoothV.current *= 0.88
      if (smoothV.current < 0.0008) smoothV.current = 0
      if (worldSmoothV.current < 0.0004) worldSmoothV.current = 0
      ptr.current.velocity = smoothV.current
      ptr.current.worldVelocity = worldSmoothV.current * 0.35
      publish()
      if (smoothV.current > 0 || worldSmoothV.current > 0) {
        decayRaf = requestAnimationFrame(decayTick)
      } else {
        decayRaf = 0
      }
    }

    const onScroll = () => {
      const now = performance.now()
      const y = window.scrollY
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const dt = Math.max(16, now - lastTime.current)
      const rawV = Math.abs((y - lastScroll.current) / dt)
      lastScroll.current = y
      lastTime.current = now
      ptr.current.scroll = y / max
      // UI velocity — lively for PillNav stretch while scrolling
      smoothV.current = smoothV.current * 0.78 + rawV * 0.22
      ptr.current.velocity = smoothV.current
      // World velocity — heavy filter + lower gain (cinematic, no monogram nova)
      worldSmoothV.current = worldSmoothV.current * 0.94 + rawV * 0.06
      ptr.current.worldVelocity = worldSmoothV.current * 0.35
      window.clearTimeout(scrollIdleTimer)
      scrollIdleTimer = window.setTimeout(() => {
        if (!decayRaf) decayRaf = requestAnimationFrame(decayTick)
      }, 48)
      if (!raf) {
        raf = requestAnimationFrame(() => {
          publish()
          raf = 0
        })
      }
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
      window.clearTimeout(scrollIdleTimer)
      cancelAnimationFrame(raf)
      cancelAnimationFrame(decayRaf)
    }
  }, [])

  const beat =
    scrollProg < 0.18 ? 'hero' : scrollProg < 0.42 ? 'work' : scrollProg < 0.72 ? 'labs' : 'contact'

  return (
    <div
      className={`im${reduced ? ' im-reduced' : ''}`}
      id="top"
      data-beat={beat}
      style={
        {
          ['--im-scroll' as string]: String(scrollProg),
          ['--im-vel' as string]: String(Math.min(velocity * 4, 1)),
        } as CSSProperties
      }
    >
      <Suspense fallback={null}>
        <ImmersiveWorld ptr={ptr} reduced={reduced} onQualityChange={onQualityChange} />
      </Suspense>

      {/* Designed reduced-motion / no-WebGL scene — still a scene, not empty */}
      <div className="im-poster" aria-hidden="true">
        <div className="im-poster-bokeh" />
        <div className="im-poster-dust" />
        <div className="im-poster-flare" />
        <div className="im-poster-flare im-poster-flare-2" />
        <div className="im-poster-hero">
          <div className="im-poster-ring" />
          <div className="im-poster-km">KM</div>
          <div className="im-poster-filament" />
          <div className="im-poster-filament im-poster-filament-2" />
        </div>
        <p className="im-poster-caption">SCENE · REDUCED MOTION · V2.9.4</p>
      </div>

      <div className="im-grain" aria-hidden="true" />
      <div className="im-vignette" aria-hidden="true" />

      {quality && !reduced ? (
        <div className="im-quality" aria-hidden="true" title={`Render quality: ${quality}`}>
          GFX · {quality.toUpperCase()}
        </div>
      ) : null}

      <PillNav velocity={velocity} />

      <main className="im-main">
        <section className="im-hero" aria-labelledby="im-name">
          <p className="im-atm-label">
            <GlitchAccent>FILE MK-2026</GlitchAccent>
            <span className="im-atm-sep" />
            <span>{PERSON.city.toUpperCase()} / REMOTE</span>
            <span className="im-atm-sep" />
            <span className="im-live">{PERSON.available.toUpperCase()}</span>
          </p>

          <p className="im-atm-kicker">TIER-1 SOC · JR DETECTION · SECURITY AUTOMATION</p>
          <ScrambleHero id="im-name" className="im-name" text="KURDI" />
          <TextPressure className="im-name-sub" text="MICHAEL" as="p" />
          <p className="im-legal">LEGAL / TRANSCRIPT · {PERSON.legal.toUpperCase()}</p>

          <div className="im-hero-actions">
            <MagneticCTA className="im-btn im-btn-primary" href={RESUME_PDF} target="_blank" rel="noreferrer">
              DOWNLOAD RÉSUMÉ
            </MagneticCTA>
            <a className="im-text-link" href="#contact">
              CONTACT
            </a>
            <a className="im-text-link" href={PERSON.github} target="_blank" rel="noreferrer">
              GITHUB
            </a>
          </div>

          <div className="im-cred-hud" role="list" aria-label="Credentials">
            <div className="im-cred-pill im-beam-card" role="listitem">
              <span className="im-cred-k">SEC+</span>
              <span className="im-cred-v">SY0-701 · CE</span>
            </div>
            <div className="im-cred-pill im-beam-card" role="listitem">
              <span className="im-cred-k">GPA</span>
              <span className="im-cred-v">
                <CountUp value={3.96} decimals={2} /> · SUMMA
              </span>
            </div>
            <div className="im-cred-pill im-beam-card" role="listitem">
              <span className="im-cred-k">OPS</span>
              <span className="im-cred-v">
                <CountUp value={8} suffix=" YRS" /> AA · NOT SIEM
              </span>
            </div>
          </div>

          <aside className="im-hire-hud im-beam-card" aria-label="Hire brief">
            <span className="im-hud-label">HIRE BRIEF</span>
            <ul>
              {HIRE_BRIEF.map((b) => (
                <li key={b.label}>
                  <strong>{b.label.toUpperCase()}</strong>
                  <span>{b.text}</span>
                </li>
              ))}
            </ul>
          </aside>

          <div className="im-scroll-hint" aria-hidden="true">
            <span>SCROLL TO TRAVEL</span>
            <span className="im-scroll-line" />
          </div>
        </section>

        {/* WORK — cinematic montage with depth-sorted crossfade moments */}
        <section className="im-montage" id="work" aria-labelledby="work-h">
          <header className="im-moment-head">
            <span className="im-atm-label">
              <GlitchAccent>02 · SELECTED WORK</GlitchAccent>
            </span>
            <SectionTitle id="work-h" line1="AUTOMATION" line2="PROOF" />
            <p className="im-moment-deck">Inspectable builds first. Client delivery third.</p>
          </header>

          {FEATURED_PROJECTS.map((p, i) => (
            <Reveal key={p.id} delay={0.06 * i}>
              <article
                className={`im-moment im-moment-${i + 1} im-moment-cine${p.favorite ? ' im-moment-lead' : ''}${p.id === 'ofg' ? ' im-moment-side' : ''}`}
                style={{ ['--moment-i' as string]: String(i) }}
              >
                <div className="im-moment-meta">
                  <span className="im-atm-label">
                    CF-{String(i + 1).padStart(2, '0')} · {p.tag.toUpperCase()}
                  </span>
                  {p.favorite ? <span className="im-fav">LEAD</span> : null}
                </div>
                <h3 className="im-moment-title">
                  <TextPressure text={p.name.toUpperCase()} as="span" />
                </h3>
                <p className="im-moment-line">{p.line}</p>
                <div className="im-moment-links">
                  <a href={p.href} target="_blank" rel="noreferrer">
                    {p.id === 'ofg' ? 'OPEN SITE →' : 'GITHUB →'}
                  </a>
                  {p.live ? (
                    <a href={p.live} target="_blank" rel="noreferrer">
                      LIVE DEMO →
                    </a>
                  ) : null}
                </div>
                <div className="im-moment-glow" aria-hidden="true" />
                <div className="im-moment-depth" aria-hidden="true" />
              </article>
            </Reveal>
          ))}
        </section>

        <section className="im-chapter" id="labs" aria-labelledby="labs-h">
          <header className="im-moment-head">
            <span className="im-atm-label">
              <GlitchAccent>03 · CASE FILES</GlitchAccent>
            </span>
            <SectionTitle id="labs-h" line1="COURSEWORK" line2="EVIDENCE" />
            <p className="im-moment-deck">Cyber hands-on — labeled, not inflated.</p>
          </header>

          <div className="im-filmstrip">
            {CASE_FILES.map((c, i) => (
              <SpotlightCard key={c.id} className={`im-film im-film-${(i % 3) + 1} im-beam-card`}>
                <div className="im-card-top">
                  <span className="im-chip">{c.course}</span>
                  <span className="im-tag">{c.bestFor.toUpperCase()}</span>
                  {c.featured ? <span className="im-fav">FEATURED</span> : null}
                </div>
                <h3>{c.name}</h3>
                <p className="im-case-block">
                  <span className="im-mini">PROBLEM</span>
                  {c.problem}
                </p>
                <p className="im-case-block">
                  <span className="im-mini">HIRE SIGNAL</span>
                  {c.hireSignal}
                </p>
              </SpotlightCard>
            ))}
          </div>

          <aside className="im-glass im-how im-beam-card" id="habits" aria-labelledby="habits-h">
            <span className="im-atm-label">04 · OPERATING SYSTEM</span>
            <h2 id="habits-h" className="im-display im-display-sm">
              <TextPressure text="HOW I WORK" as="span" />
            </h2>
            <AnimatedList
              items={OPERATING.map((o) => ({
                key: o.title,
                title: o.title,
                meta: o.source,
                body: o.body,
              }))}
            />
          </aside>
        </section>

        <section className="im-chapter" id="skills" aria-labelledby="skills-h">
          <header className="im-moment-head">
            <span className="im-atm-label">05 · BANDS</span>
            <SectionTitle id="skills-h" line1="SKILL" line2="SIGNAL" />
            <p className="im-moment-deck">Hands-on vs writing vs exposure — named plainly.</p>
          </header>
          <SkillsMarquee
            items={[
              'NETWORK TROUBLESHOOTING',
              'WINDOWS GPO',
              'MYSQL / SQL',
              'INCIDENT ANALYSIS',
              'IAM / CIS',
              'THREAT MODELING',
              'CLOUD BCDR',
              'SIEM VOCAB',
              'PROMPTRIG',
              'AGENTFORGE',
              'SECURITY+',
              'SUMMA 3.96',
            ]}
          />
          <div className="im-skill-bands">
            {SKILL_BANDS.map((band) => (
              <div key={band.tier} className="im-glass im-skill-band im-beam-card">
                <h3>{band.tier.toUpperCase()}</h3>
                <div className="im-skill-chips">
                  {band.items.map((item) => (
                    <span key={item.name} className="im-skill-chip" title={item.proof}>
                      <strong>{item.name}</strong>
                      <em>{item.proof}</em>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="im-chapter" id="path" aria-labelledby="path-h">
          <header className="im-moment-head">
            <span className="im-atm-label">06 · PATH</span>
            <SectionTitle id="path-h" line1="TRANSFER" line2="HABITS" />
            <p className="im-moment-deck">Regulated ops — not invented SIEM years.</p>
          </header>
          <div className="im-path-rail">
            {EXPERIENCE.map((job, i) => (
              <SpotlightCard
                key={job.title + job.org}
                className={`im-path-card im-path-${i + 1} im-beam-card`}
              >
                <div className="im-job-head">
                  <h3>{job.title}</h3>
                  <span className="im-dates">{job.dates}</span>
                </div>
                <p className="im-org">
                  {job.org} · {job.loc}
                </p>
                <p>{job.detail}</p>
                <ul className="im-transfer">
                  {job.transfer.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </SpotlightCard>
            ))}
          </div>
        </section>

        <section className="im-chapter im-contact" id="contact" aria-labelledby="contact-h">
          <header className="im-moment-head">
            <span className="im-atm-label">
              <GlitchAccent>07 · CONTACT</GlitchAccent>
            </span>
            <SectionTitle id="contact-h" line1="OPEN" line2="CHANNEL" />
            <p className="im-moment-deck">{ETHOS}</p>
          </header>
          <div className="im-glass im-contact-card im-beam-card">
            <dl className="im-contact-dl">
              <div>
                <dt>EMAIL</dt>
                <dd>
                  <a href={`mailto:${PERSON.email}`}>{PERSON.email}</a>
                  <button type="button" className="im-copy" onClick={() => copy(PERSON.email, 'email')}>
                    COPY
                  </button>
                </dd>
              </div>
              <div>
                <dt>PHONE</dt>
                <dd>
                  <a href={`tel:${PERSON.phoneTel}`}>{PERSON.phone}</a>
                  <button type="button" className="im-copy" onClick={() => copy(PERSON.phone, 'phone')}>
                    COPY
                  </button>
                </dd>
              </div>
              <div>
                <dt>GITHUB</dt>
                <dd>
                  <a href={PERSON.github} target="_blank" rel="noreferrer">
                    github.com/KM-it-ops
                  </a>
                </dd>
              </div>
              <div>
                <dt>LINKEDIN</dt>
                <dd>
                  <a href={PERSON.linkedin} target="_blank" rel="noreferrer">
                    Mahmoud Michael Al Kurdi
                  </a>
                </dd>
              </div>
              <div>
                <dt>RÉSUMÉ</dt>
                <dd>
                  <a href={RESUME_PDF} target="_blank" rel="noreferrer">Michael_Kurdi_Resume_SOC_onepager.pdf</a>
                </dd>
              </div>
            </dl>
            <p className="im-cred-foot">
              {CREDENTIALS.secPlus} · {CREDENTIALS.honorsShort} · {CREDENTIALS.gpa} GPA
            </p>
          </div>
        </section>
      </main>

      <footer className="im-footer">
        <p>
          © {new Date().getFullYear()} {PERSON.name.toUpperCase()} · V2.9.1 CEILING+PERF ·
          ACTIVETHEORY × REACTBITS
        </p>
      </footer>

      <Toast message={toast} />
    </div>
  )
}
