import { useEffect } from 'react'
import { startSmoothScroll } from '../motion'
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
  THROUGHLINE,
} from '../content'
import { Reveal, Toast, useCopyToast } from './shared'
import { BlurText, CountUp, MagneticCTA, SkillsMarquee, SplitName, SpotlightCard } from '../craft'
import { Atmosphere } from '../Atmosphere'
import './daylight-dossier.css'

/** Clean hex KM mark — subtle hex + interlocking letterforms + one terracotta accent */
function KmMark({ className = 'dd-mark' }: { className?: string }) {
  return (
    <a
      className={className}
      href="#top"
      aria-label="Michael Kurdi — home"
      title="KM"
    >
      <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="64" height="64" fill="#1c1917" />
        <path
          d="M32 5.5 L54.5 18.5 V45.5 L32 58.5 L9.5 45.5 V18.5 Z"
          fill="#141210"
          stroke="#c45d2c"
          strokeWidth="1.75"
        />
        <g fill="#f5f0e8">
          <path d="M15 19h5.4v11.2L30.2 19h6.2L24.2 32.2 36.8 45h-6.4L20.4 33.4V45H15z" />
          <path d="M33.5 19h5.6l5.8 15.2L50.8 19H56.5v26H51.2V32.6L45.8 45h-4.2l-5.4-12.4V45h-5.3z" />
        </g>
        <path
          d="M20.4 32.2 L33.5 32.2"
          stroke="#c45d2c"
          strokeWidth="1.6"
          strokeLinecap="square"
        />
      </svg>
    </a>
  )
}

export default function DaylightDossier() {
  const { toast, copy } = useCopyToast()

  useEffect(() => {
    const stop = startSmoothScroll()
    return () => stop?.()
  }, [])

  return (
    <div className="dd" id="top">
      <Atmosphere />
      <div className="dd-margin-rule" aria-hidden="true" />

      <header className="dd-letterhead">
        <div className="dd-letterhead-inner">
          <KmMark />
          <div className="dd-letterhead-meta">
            <span className="dd-meta-label">File</span>
            <span className="dd-meta-value">MK-2026-SOC</span>
            <span className="dd-meta-sep">·</span>
            <span className="dd-meta-label">Locale</span>
            <span className="dd-meta-value">
              {PERSON.city} / remote
            </span>
            <span className="dd-meta-sep">·</span>
            <span className="dd-meta-label">Status</span>
            <span className="dd-meta-value dd-meta-live">{PERSON.available}</span>
          </div>
          <nav className="dd-nav" aria-label="Primary">
            <a href="#projects">Projects</a>
            <a href="#labs">Labs</a>
            <a href="#path">Path</a>
            <a href="#contact">Contact</a>
            <a className="dd-nav-cta" href={RESUME_PDF}>
              Resume
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className="dd-hero dd-hero-enter" aria-labelledby="dd-name">
          <div className="dd-hero-fold">
            <div className="dd-hero-left">
              <p className="dd-eyebrow">Portfolio · Michael Kurdi</p>
              <SplitName id="dd-name" className="dd-name" text={PERSON.name} />
              <p className="dd-headline">{PERSON.role}</p>
              <p className="dd-legal">Legal / transcript: {PERSON.legal}</p>
              <p className="dd-lede">{THROUGHLINE.seeking}</p>
              <div className="dd-hero-actions">
                <MagneticCTA className="dd-btn dd-btn-primary" href={RESUME_PDF}>
                  Download résumé
                </MagneticCTA>
                <a className="dd-text-link" href="#contact">
                  Contact
                </a>
                <a className="dd-text-link" href={PERSON.github} target="_blank" rel="noreferrer">
                  GitHub
                </a>
              </div>
            </div>

            <aside className="dd-hero-right" aria-label="Credentials and hire brief">
              <div className="dd-cred-strip dd-panel-frost" role="list" aria-label="Credentials">
                <div className="dd-cred" role="listitem">
                  <span className="dd-cred-stamp">SEC+</span>
                  <div>
                    <strong>{CREDENTIALS.secPlus}</strong>
                    <span>{CREDENTIALS.secPlusDates}</span>
                  </div>
                </div>
                <div className="dd-cred" role="listitem">
                  <span className="dd-cred-stamp">B.S.</span>
                  <div>
                    <strong>IT Cybersecurity · SNHU</strong>
                    <span>
                      {CREDENTIALS.honorsShort} ·{' '}
                      <CountUp className="dd-count" value={3.96} decimals={2} suffix=" GPA" />
                      {' '}· Dec 2025
                    </span>
                  </div>
                </div>
                <div className="dd-cred" role="listitem">
                  <span className="dd-cred-stamp">OPS</span>
                  <div>
                    <strong>
                      AA Crew Chief · <CountUp className="dd-count" value={8} suffix=" yrs" /> regulated ops
                    </strong>
                    <span>2015–2023 transferables — not SIEM tenure</span>
                  </div>
                </div>
              </div>
              <div className="dd-hire-box dd-panel-frost">
                <span className="dd-mini-label">Hire brief</span>
                <ul className="dd-hire-bullets">
                  {HIRE_BRIEF.map((b) => (
                    <li key={b.label}>
                      <strong>{b.label}</strong>
                      <span>{b.text}</span>
                    </li>
                  ))}
                </ul>
                <p className="dd-hire-status">{PERSON.available}</p>
              </div>
            </aside>
          </div>
        </section>

        <Reveal>
          <section className="dd-section dd-section-tight" id="throughline" aria-labelledby="through-h">
            <div className="dd-section-head dd-section-head-inline">
              <span className="dd-case-no">01</span>
              <BlurText as="h2" id="through-h" text={THROUGHLINE.title} />
            </div>
            <div className="dd-prose dd-prose-wide dd-panel-soft">
              {THROUGHLINE.body.map((p) => (
                <p key={p.slice(0, 24)}>{renderBold(p)}</p>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="dd-section dd-section-tight" id="projects" aria-labelledby="proj-h">
            <div className="dd-section-head dd-section-head-inline">
              <span className="dd-case-no">02</span>
              <BlurText as="h2" id="proj-h" text="Featured projects" />
              <p className="dd-section-sub">Automation proof first; shipped client delivery third.</p>
            </div>
            <div className="dd-project-grid">
              {FEATURED_PROJECTS.map((p, i) => (
                <Reveal key={p.id} delay={0.06 * i}>
                  <SpotlightCard
                    className={`dd-card dd-project${p.favorite ? ' dd-project-fav' : ''}${p.id === 'ofg' ? ' dd-project-shipped' : ''}`}
                  >
                    <div className="dd-card-top">
                      <span className="dd-case-chip">
                        CF-{String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="dd-tag">{p.tag}</span>
                    </div>
                    <h3>{p.name}</h3>
                    <p>{p.line}</p>
                    <div className="dd-card-links">
                      <a href={p.href} target="_blank" rel="noreferrer">
                        {p.id === 'ofg' ? 'Open site →' : 'GitHub →'}
                      </a>
                      {p.live ? (
                        <a href={p.live} target="_blank" rel="noreferrer">
                          Live demo →
                        </a>
                      ) : null}
                    </div>
                  </SpotlightCard>
                </Reveal>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="dd-section dd-section-tight" id="labs" aria-labelledby="labs-h">
            <div className="dd-section-head dd-section-head-inline">
              <span className="dd-case-no">03</span>
              <BlurText as="h2" id="labs-h" text="Coursework case files" />
              <p className="dd-section-sub">
                Cyber hands-on proof — labeled, not inflated.
              </p>
            </div>
            <ol className="dd-case-list dd-case-list-compact dd-case-list-3up">
              {CASE_FILES.map((c) => (
                <li key={c.id} className="dd-card dd-case dd-case-compact dd-panel-frost">
                  <div className="dd-card-top">
                    <span className="dd-case-chip">{c.course}</span>
                    <span className="dd-tag">{c.bestFor}</span>
                    {c.featured ? <span className="dd-fav-pill">Featured</span> : null}
                  </div>
                  <h3>{c.name}</h3>
                  <p className="dd-case-problem">
                    <span className="dd-mini-label">Problem</span>
                    {c.problem}
                  </p>
                  <p className="dd-hire">
                    <span className="dd-mini-label">Hire signal</span>
                    {c.hireSignal}
                  </p>
                </li>
              ))}
            </ol>
            <aside className="dd-how-strip dd-panel-frost" id="habits" aria-labelledby="habits-h">
              <div className="dd-how-head">
                <span className="dd-case-no">04</span>
                <BlurText as="h2" id="habits-h" text="How I work" />
              </div>
              <ul className="dd-how-list">
                {OPERATING.map((o) => (
                  <li key={o.title}>
                    <strong>{o.title}</strong>
                    <span className="dd-how-src">{o.source}</span>
                    <span className="dd-how-body">{o.body}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </section>
        </Reveal>

        <Reveal>
          <section className="dd-section dd-section-tight" id="skills" aria-labelledby="skills-h">
            <div className="dd-section-head dd-section-head-inline">
              <span className="dd-case-no">05</span>
              <BlurText as="h2" id="skills-h" text="Skill bands" />
              <p className="dd-section-sub">Hands-on vs writing vs exposure — named plainly.</p>
            </div>
            <SkillsMarquee
              items={[
                'Network troubleshooting',
                'Windows GPO hardening',
                'MySQL / SQL',
                'Incident analysis',
                'IAM / CIS Controls',
                'Threat modeling',
                'Cloud BCDR',
                'SIEM vocabulary',
                'PromptRig',
                'AgentForge',
                'Security+',
                'Summa 3.96',
              ]}
            />
            <div className="dd-skill-chip-bands">
              {SKILL_BANDS.map((band) => (
                <div key={band.tier} className="dd-skill-chip-band dd-panel-frost">
                  <h3>{band.tier}</h3>
                  <div className="dd-skill-chips">
                    {band.items.map((item) => (
                      <span key={item.name} className="dd-chip" title={item.proof}>
                        <strong>{item.name}</strong>
                        <em>{item.proof}</em>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="dd-section dd-section-tight" id="path" aria-labelledby="path-h">
            <div className="dd-section-head dd-section-head-inline">
              <span className="dd-case-no">06</span>
              <BlurText as="h2" id="path-h" text="Path & transferables" />
              <p className="dd-section-sub">
                Regulated ops experience — transferable habits, not invented SIEM years.
              </p>
            </div>
            <div className="dd-timeline dd-timeline-h">
              {EXPERIENCE.map((job) => (
                <article key={job.title + job.org} className="dd-card dd-job dd-job-compact dd-panel-frost">
                  <div className="dd-job-head">
                    <h3>{job.title}</h3>
                    <span className="dd-dates">{job.dates}</span>
                  </div>
                  <p className="dd-org">
                    {job.org} · {job.loc}
                  </p>
                  <p className="dd-job-detail">{job.detail}</p>
                  <ul className="dd-transfer">
                    {job.transfer.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="dd-section dd-section-tight dd-contact" id="contact" aria-labelledby="contact-h">
            <div className="dd-section-head dd-section-head-inline">
              <span className="dd-case-no">07</span>
              <BlurText as="h2" id="contact-h" text="Contact" />
              <p className="dd-section-sub">{ETHOS}</p>
            </div>
            <div className="dd-contact-card dd-panel-frost">
              <dl className="dd-contact-dl">
                <div>
                  <dt>Email</dt>
                  <dd>
                    <a href={`mailto:${PERSON.email}`}>{PERSON.email}</a>
                    <button
                      type="button"
                      className="dd-copy"
                      onClick={() => copy(PERSON.email, 'email')}
                    >
                      Copy
                    </button>
                  </dd>
                </div>
                <div>
                  <dt>Phone</dt>
                  <dd>
                    <a href={`tel:${PERSON.phoneTel}`}>{PERSON.phone}</a>
                    <button
                      type="button"
                      className="dd-copy"
                      onClick={() => copy(PERSON.phone, 'phone')}
                    >
                      Copy
                    </button>
                  </dd>
                </div>
                <div>
                  <dt>GitHub</dt>
                  <dd>
                    <a href={PERSON.github} target="_blank" rel="noreferrer">
                      github.com/KM-it-ops
                    </a>
                  </dd>
                </div>
                <div>
                  <dt>LinkedIn</dt>
                  <dd>
                    <a href={PERSON.linkedin} target="_blank" rel="noreferrer">
                      Mahmoud Michael Al Kurdi
                    </a>
                  </dd>
                </div>
                <div>
                  <dt>Résumé</dt>
                  <dd>
                    <a href={RESUME_PDF}>Michael Kurdi CV</a>
                  </dd>
                </div>
              </dl>
            </div>
          </section>
        </Reveal>
      </main>

      <footer className="dd-footer">
        <p>
          © {new Date().getFullYear()} {PERSON.name} · Night Dossier draft v2.7 · craft push
        </p>
      </footer>

      <Toast message={toast} />
    </div>
  )
}

function renderBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    return <span key={i}>{part}</span>
  })
}
