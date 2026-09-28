/**
 * Noir Spotlight visual system — CSS/SVG shell (Orb Seal only).
 * Replaces ImmersiveWorld / R3F. Content + SEO from hire draft.
 */
import { useEffect, useRef, useState } from 'react'
import {
  CASE_FILES,
  CREDENTIALS,
  ETHOS,
  EXPERIENCE,
  FEATURED_PROJECTS,
  HIRE_BRIEF,
  OPERATING,
  PERSON,
  RESUME_LABEL,
  RESUME_PDF,
  SIDE_PROJECTS,
  SKILL_BANDS,
  THROUGHLINE,
} from './content'
import { OrbSeal } from './noir/OrbSeal'
import './noir/noir-spotlight.css'

const SCROLL_THRESHOLD = 120

function useCopyToast() {
  const [toast, setToast] = useState<string | null>(null)
  const copy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setToast(`Copied ${label}`)
      window.setTimeout(() => setToast(null), 1600)
    } catch {
      setToast('Copy failed')
      window.setTimeout(() => setToast(null), 1600)
    }
  }
  return { toast, copy }
}

export default function NoirSpotlight() {
  const { toast, copy } = useCopyToast()
  const [collapsed, setCollapsed] = useState(false)
  const heroAssetRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const update = () => {
      const y = window.scrollY || document.documentElement.scrollTop
      const wrap = heroAssetRef.current
      const navH = navRef.current?.offsetHeight ?? 56
      if (wrap) {
        const rect = wrap.getBoundingClientRect()
        setCollapsed(rect.bottom < navH + 20 || y > SCROLL_THRESHOLD)
      } else {
        setCollapsed(y > SCROLL_THRESHOLD)
      }
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <div className={`noir${collapsed ? ' nav-collapsed' : ''}`} id="top">
      <div className="noir-grain" aria-hidden="true" />

      <nav className="noir-nav" aria-label="Primary" ref={navRef}>
        <div className="noir-nav-asset" aria-hidden={!collapsed} title="Orb Seal">
          <OrbSeal idPrefix="nav-orb" />
        </div>
        <div className="noir-nav-brand">
          <span className="brand-full">Mahmoud Al Kurdi</span>
          <span className="brand-short">M. Al Kurdi</span>
        </div>
        <div className="noir-nav-primary">
          <a href="#work">Work</a>
          <a href="#labs">Labs</a>
          <a href="#path">Path</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="noir-nav-ctas">
          <a className="noir-cta-primary" href={RESUME_PDF} rel="noopener noreferrer" target="_blank">
            {RESUME_LABEL}
          </a>
          <a className="noir-cta-secondary" href={`mailto:${PERSON.email}`}>Email</a>
          <a className="noir-cta-tertiary hide-sm" href={PERSON.linkedin} rel="noopener noreferrer" target="_blank">
            LinkedIn
          </a>
          <a className="noir-cta-tertiary" href={PERSON.github} rel="noopener noreferrer" target="_blank">
            GitHub
          </a>
        </div>
      </nav>

      <div className="noir-shell">
        <section className="noir-hero" aria-labelledby="noir-name" id="hero">
          <div className="noir-hero-spotlight" aria-hidden="true" />
          <p className="noir-eyebrow">{PERSON.available}</p>
          <h1 className="noir-name" id="noir-name">
            {PERSON.legal}
            <span className="aka">({PERSON.name})</span>
          </h1>
          <div className="noir-hairline" aria-hidden="true" />
          <p className="noir-role">
            <strong>Junior Security Analyst</strong>
            {' · '}Security Operations · IT Risk
            {' · '}Security+ · SNHU Summa
            {' · '}Charlotte NC / Remote
          </p>
          <p className="noir-proof-strip" id="proof">
            <span className="proof-label">Proof</span>
            <span>Log anomaly detection — cloneable detector</span>
            <a
              href="https://github.com/KM-it-ops/security-log-anomaly-detection"
              rel="noopener noreferrer"
              target="_blank"
            >
              View repo →
            </a>
          </p>
          <div className="noir-hero-ctas">
            <a className="noir-cta-primary" href={RESUME_PDF} rel="noopener noreferrer" target="_blank">
              {RESUME_LABEL}
            </a>
            <a className="noir-cta-secondary" href={`mailto:${PERSON.email}`}>Email</a>
            <a className="noir-cta-tertiary" href={PERSON.linkedin} rel="noopener noreferrer" target="_blank">
              LinkedIn
            </a>
            <a className="noir-cta-tertiary" href={PERSON.github} rel="noopener noreferrer" target="_blank">
              GitHub
            </a>
          </div>
          <p className="noir-seek">{THROUGHLINE.seeking}</p>
          <ul className="noir-cred-row" aria-label="Credentials">
            <li>
              <strong>Sec+</strong> · SY0-701
            </li>
            <li>
              <strong>3.96</strong> · Summa
            </li>
            <li>
              <strong>8 yrs</strong> · AA ops · not SIEM
            </li>
          </ul>
          <div className="noir-hero-asset" id="hero-asset-wrap" ref={heroAssetRef}>
            <div className="stage">
              <OrbSeal idPrefix="hero-orb" />
            </div>
          </div>
        </section>

        <div className="noir-strip" id="work">
          Selected work
        </div>
        <section className="noir-section" aria-labelledby="work-h">
          <h2 id="work-h" className="visually-hidden">
            Selected work
          </h2>
          <p className="noir-deck">
            Detection lead first, then phishing and vuln workflow — repos you can clone and run.
          </p>
          <div className="noir-film">
            {FEATURED_PROJECTS.map((p, i) => {
              const liveOk = Boolean(p.live) && !/agentforgestudio/i.test(p.live ?? '')
              return (
                <article
                  key={p.id}
                  className={`noir-still${p.favorite ? ' lead' : ''}`}
                >
                  <div className="frame">
                    <span className="reel">{String(i + 1).padStart(2, '0')}</span>
                    <span>{p.favorite ? 'Featured' : p.tag}</span>
                  </div>
                  <div className="noir-still-body">
                    <h3>{p.name}</h3>
                    <p>{p.line}</p>
                    <div>
                      <a className="noir-btn" href={p.href} rel="noopener noreferrer" target="_blank">
                        {p.favorite ? 'Clone this detector →' : 'View on GitHub'}
                      </a>
                      {liveOk ? (
                        <a
                          className="noir-btn noir-btn-ghost"
                          href={p.live}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Live demo
                        </a>
                      ) : null}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          <div className="noir-strip" id="side" style={{ marginTop: '2rem' }}>
            Also shipping
          </div>
          <div className="noir-side-grid">
            {SIDE_PROJECTS.map((p) => {
              const isLive = Boolean(p.live) && !/agentforgestudio/i.test(p.live ?? '')
              const openHref = isLive ? (p.live as string) : p.href
              const openLabel = p.openLabel ?? (isLive ? 'Open site →' : 'GitHub →')
              return (
                <article key={p.id} className="noir-side-card">
                  <p className="tag">{p.tag}</p>
                  <h4>{p.name}</h4>
                  <p>{p.line}</p>
                  <a className="noir-btn" href={openHref} rel="noopener noreferrer" target="_blank">
                    {openLabel}
                  </a>
                  {isLive ? (
                    <a
                      className="noir-btn noir-btn-ghost"
                      href={p.href}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      GitHub
                    </a>
                  ) : null}
                </article>
              )
            })}
          </div>
        </section>

        <div className="noir-strip" id="glance">
          At a glance
        </div>
        <section className="noir-section" aria-label="Hire brief">
          <div className="noir-hire">
            {HIRE_BRIEF.map((b) => (
              <article key={b.label}>
                <h3>{b.label}</h3>
                <p>{b.text}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="noir-strip" id="labs">
          Labs and writeups
        </div>
        <section className="noir-section" aria-labelledby="labs-h">
          <h2 id="labs-h" className="visually-hidden">
            Coursework labs
          </h2>
          <p className="noir-deck">Hands-on school work — labeled honestly, not padded.</p>
          <div className="noir-labs">
            {CASE_FILES.map((c) => (
              <article key={c.id} className="noir-lab">
                <div className="noir-lab-top">
                  <span className="chip">{c.course}</span>
                  <span className="tag">{c.bestFor}</span>
                  {c.featured ? <span className="fav">Featured</span> : null}
                </div>
                <h3>{c.name}</h3>
                <p className="block">
                  <span className="mini">Problem</span>
                  {c.problem}
                </p>
                <p className="block">
                  <span className="mini">Hire signal</span>
                  {c.hireSignal}
                </p>
              </article>
            ))}
          </div>

          <div className="noir-panel-block" id="habits" style={{ marginTop: '1.5rem' }}>
            <h2>How I work</h2>
            <ul className="noir-op-list">
              {OPERATING.map((o) => (
                <li key={o.title}>
                  <strong>{o.title}</strong>
                  <div className="meta">{o.source}</div>
                  <p>{o.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className="noir-strip" id="skills">
          Skill signal
        </div>
        <section className="noir-section" aria-labelledby="skills-h">
          <h2 id="skills-h" className="visually-hidden">
            Skill bands
          </h2>
          <p className="noir-deck">Hands-on vs writing vs exposure — named plainly.</p>
          <div className="noir-bands">
            {SKILL_BANDS.map((band) => (
              <div key={band.tier} className="noir-panel-block noir-band">
                <h3>{band.tier}</h3>
                <div className="noir-chips">
                  {band.items.map((item) => (
                    <span key={item.name} className="noir-chip" title={item.proof}>
                      <strong>{item.name}</strong>
                      <em>{item.proof}</em>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="noir-strip" id="path">
          Path
        </div>
        <section className="noir-section" aria-labelledby="path-h">
          <h2 id="path-h" className="visually-hidden">
            Experience path
          </h2>
          <div className="noir-panel-block" style={{ marginBottom: '1.25rem' }}>
            <h3>{THROUGHLINE.title}</h3>
            {THROUGHLINE.body.map((para) => (
              <p key={para.slice(0, 32)} style={{ margin: '0 0 0.75rem', color: 'var(--noir-muted)' }}>
                {para}
              </p>
            ))}
          </div>
          <div className="noir-path-rail">
            {EXPERIENCE.map((job) => (
              <article key={job.title + job.org} className="noir-path-card">
                <div className="job-head">
                  <h3>{job.title}</h3>
                  <span className="dates">{job.dates}</span>
                </div>
                <p className="org">
                  {job.org} · {job.loc}
                </p>
                <p>{job.detail}</p>
                <ul className="noir-transfer">
                  {job.transfer.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="noir-contact" id="contact" aria-labelledby="contact-h">
          <h2 id="contact-h">Contact</h2>
          <p>{ETHOS}</p>
          <dl className="noir-contact-dl">
            <div>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${PERSON.email}`}>{PERSON.email}</a>
              </dd>
              <button type="button" className="noir-copy" onClick={() => copy(PERSON.email, 'email')}>
                Copy
              </button>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>
                <a href={`tel:${PERSON.phoneTel}`}>{PERSON.phone}</a>
              </dd>
              <button type="button" className="noir-copy" onClick={() => copy(PERSON.phone, 'phone')}>
                Copy
              </button>
            </div>
            <div>
              <dt>GitHub</dt>
              <dd>
                <a href={PERSON.github} rel="noopener noreferrer" target="_blank">
                  github.com/KM-it-ops
                </a>
              </dd>
              <span />
            </div>
            <div>
              <dt>LinkedIn</dt>
              <dd>
                <a href={PERSON.linkedin} rel="noopener noreferrer" target="_blank">
                  Mahmoud Michael Al Kurdi
                </a>
              </dd>
              <span />
            </div>
            <div>
              <dt>Resume</dt>
              <dd>
                <a href={RESUME_PDF} rel="noopener noreferrer" target="_blank">
                  {RESUME_LABEL}
                </a>
              </dd>
              <span />
            </div>
          </dl>
          <p className="noir-cred-foot">
            {CREDENTIALS.secPlus} · {CREDENTIALS.honorsShort} · {CREDENTIALS.gpa} GPA
          </p>
        </section>

        <footer className="noir-footer">
          <span>
            {PERSON.legal} ({PERSON.name}) · Junior Security Analyst
          </span>
          <span>Noir Spotlight · {new Date().getFullYear()}</span>
        </footer>
      </div>

      {toast ? (
        <div className="noir-toast" role="status" aria-live="polite">
          {toast}
        </div>
      ) : null}
    </div>
  )
}
