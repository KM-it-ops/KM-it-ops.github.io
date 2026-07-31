import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  CREDENTIALS,
  ETHOS,
  EXPERIENCE,
  PERSON,
  RESUME_PDF,
} from './content'
import { HeroScene } from './HeroScene'
import { PinStage } from './PinStage'
import { WorkCinema } from './WorkCinema'

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReduced(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])
  return reduced
}

function useHeroVisible() {
  const [heroVisible, setHeroVisible] = useState(true)
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById('top')
      if (hero) {
        const r = hero.getBoundingClientRect()
        setHeroVisible(r.bottom > 80)
        const traveled = Math.min(1, Math.max(0, -r.top / Math.max(r.height, 1)))
        setPhase(traveled)
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return { heroVisible, phase }
}

function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = usePrefersReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced) {
      el.classList.add('is-in')
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          el.classList.add('is-in')
          io.disconnect()
        }
      },
      { threshold: 0.14 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced])

  return (
    <div ref={ref} className={`reveal${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  )
}

function Toast({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <div className="toast" role="status" aria-live="polite">
      {message}
    </div>
  )
}

export default function App() {
  const reducedMotion = usePrefersReducedMotion()
  const { heroVisible, phase } = useHeroVisible()
  const [toast, setToast] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const isTouch =
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: none)').matches

  const copy = useCallback(async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setToast(`Copied ${label}`)
      window.setTimeout(() => setToast(null), 1600)
    } catch {
      setToast('Copy failed')
      window.setTimeout(() => setToast(null), 1600)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>

      <header className="topnav">
        <a className="logo" href="#top">
          {PERSON.short}
        </a>
        <nav className="topnav-links" aria-label="Primary">
          <a href="#stage">Stage</a>
          <a href="#work">Work</a>
          <a href="#path">Path</a>
          <a href="#contact">Contact</a>
          <a className="nav-cta" href={RESUME_PDF} target="_blank" rel="noreferrer">
            Resume
          </a>
        </nav>
        <button
          type="button"
          className="menu-btn"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          Menu
        </button>
      </header>

      {menuOpen ? (
        <div className="mobile-menu" id="mobile-menu" role="dialog" aria-label="Menu">
          <a href="#stage" onClick={() => setMenuOpen(false)}>
            Stage
          </a>
          <a href="#work" onClick={() => setMenuOpen(false)}>
            Work
          </a>
          <a href="#path" onClick={() => setMenuOpen(false)}>
            Path
          </a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>
            Contact
          </a>
          <a
            href={RESUME_PDF}
            target="_blank"
            rel="noreferrer"
            onClick={() => setMenuOpen(false)}
          >
            Resume
          </a>
        </div>
      ) : null}

      <main id="main">
        <section className="hero band-void" id="top">
          <HeroScene
            reducedMotion={reducedMotion}
            visible={heroVisible}
            phase={phase}
            allowPointer={!reducedMotion && !isTouch}
          />
          <div className="hero-shade" aria-hidden />
          <div className="hero-bloom" aria-hidden />
          <div className="hero-inner">
            <p className="kicker">{PERSON.role}</p>
            <h1>
              <span className="name-line">{PERSON.short.split(' ')[0]}</span>
              <span className="name-line emph">
                {PERSON.short.split(' ').slice(1).join(' ')}
              </span>
            </h1>
            <p className="hero-line">
              Eight years of federally regulated security operations.
              Evidence over narrative.
            </p>
            <div className="hero-actions">
              <a className="btn btn-light" href={RESUME_PDF} target="_blank" rel="noreferrer">
                Resume
              </a>
              <a className="btn btn-ghost-light" href={PERSON.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </div>
          </div>
        </section>

        <PinStage
          reducedMotion={reducedMotion}
          allowPointer={!reducedMotion && !isTouch}
        />

        <WorkCinema reducedMotion={reducedMotion} />

        <section className="band band-void-soft chapter" id="credentials">
          <div className="wrap">
            <Reveal>
              <p className="chapter-label light">Credentials</p>
              <h2 className="display tight">
                Quiet <span className="emph">facts</span>
              </h2>
            </Reveal>
            <div className="cred-quiet">
              <Reveal>
                <div className="cred-q">
                  <h3>{CREDENTIALS.secPlus}</h3>
                  <p>{CREDENTIALS.secPlusDates}</p>
                </div>
              </Reveal>
              <Reveal>
                <div className="cred-q">
                  <h3>{CREDENTIALS.degree}</h3>
                  <p>
                    {CREDENTIALS.degreeDates}. {CREDENTIALS.honors}.
                  </p>
                </div>
              </Reveal>
              <Reveal>
                <p className="body light-muted">{ETHOS}</p>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="band band-paper chapter" id="path">
          <div className="wrap">
            <Reveal>
              <p className="chapter-label">Path</p>
              <h2 className="display tight">
                Experience <span className="emph">ops-first</span>
              </h2>
            </Reveal>

            <ol className="path-list">
              {EXPERIENCE.map((job) => (
                <li key={job.title + job.dates}>
                  <Reveal>
                    <div className="path-row">
                      <p className="path-year" aria-hidden>
                        {job.dates.slice(0, 4)}
                      </p>
                      <div>
                        <p className="path-meta">
                          {job.dates}
                          <span aria-hidden> · </span>
                          {job.loc}
                        </p>
                        <h3>{job.title}</h3>
                        <p className="org">{job.org}</p>
                        <p className="body">{job.detail}</p>
                      </div>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>

            <Reveal>
              <p className="chapter-label mt">Target roles</p>
              <p className="targets">{PERSON.targets.join(' · ')}</p>
            </Reveal>
          </div>
        </section>

        <section className="band band-void chapter" id="contact">
          <div className="aurora" aria-hidden />
          <div className="wrap">
            <Reveal>
              <p className="chapter-label light">Contact</p>
              <h2 className="display">
                {PERSON.available.replace(/\.$/, '')}.
              </h2>
              <p className="body-l light-muted">
                {PERSON.city} · Remote welcome.
              </p>

              <ul className="contact-list">
                <li>
                  <a href={`mailto:${PERSON.email}`}>{PERSON.email}</a>
                  <button
                    type="button"
                    className="text-btn"
                    onClick={() => void copy(PERSON.email, 'email')}
                  >
                    Copy
                  </button>
                </li>
                <li>
                  <a href={`tel:${PERSON.phoneTel}`}>{PERSON.phone}</a>
                  <button
                    type="button"
                    className="text-btn"
                    onClick={() => void copy(PERSON.phone, 'phone')}
                  >
                    Copy
                  </button>
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

              <div className="hero-actions mt">
                <a
                  className="btn btn-light"
                  href={RESUME_PDF}
                  target="_blank"
                  rel="noreferrer"
                >
                  Download resume
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="site-foot">
        <span>{PERSON.short}</span>
        <span>Charlotte, NC</span>
      </footer>

      <Toast message={toast} />
    </>
  )
}
