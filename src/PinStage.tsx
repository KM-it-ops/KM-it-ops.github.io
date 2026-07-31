import { useEffect, useRef, useState } from 'react'
import { CREDENTIALS, PERSON } from './content'
import { HeroScene } from './HeroScene'

const CHAPTERS = [
  {
    id: 'work',
    label: 'Work',
    kicker: 'Selected projects',
    emphLead: 'Public proof',
    emph: 'under inspection.',
    body: 'Open repositories and measurable artifacts — not brochure claims. Continue into the work cinema.',
    href: '#work',
    cta: 'Enter work cinema',
  },
  {
    id: 'creds',
    label: 'Creds',
    kicker: 'Credentials',
    emphLead: 'Degree. Security+.',
    emph: 'Honors.',
    body: `${CREDENTIALS.degreeDates}. ${CREDENTIALS.honors}. ${CREDENTIALS.secPlus} — ${CREDENTIALS.secPlusDates}.`,
    href: '#credentials',
    cta: 'Credentials detail',
  },
  {
    id: 'ops',
    label: 'Ops',
    kicker: 'Operations path',
    emphLead: 'Eight years of',
    emph: 'regulated ops.',
    body: 'Aviation security crew chief under FAA, OSHA, IATA, and CBP. Evidence over narrative.',
    href: '#path',
    cta: 'View experience',
  },
] as const

type Props = {
  reducedMotion: boolean
  allowPointer: boolean
}

export function PinStage({ reducedMotion, allowPointer }: Props) {
  const rootRef = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return

    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      const total = el.offsetHeight - window.innerHeight
      const raw = total > 0 ? -rect.top / total : 0
      setProgress(Math.min(1, Math.max(0, raw)))
      setVisible(rect.bottom > 40 && rect.top < window.innerHeight - 40)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const chapterIndex = Math.min(
    CHAPTERS.length - 1,
    Math.floor(progress * CHAPTERS.length * 0.999),
  )
  const phase = 0.25 + progress * 0.75

  return (
    <section
      className="pin-stage"
      id="stage"
      ref={rootRef}
      aria-label="Pinned scrutiny stage"
    >
      <div className="pin-stage-sticky">
        <div className="aurora pin-aurora" aria-hidden />
        <div className="pin-lens-col">
          <HeroScene
            reducedMotion={reducedMotion}
            visible={visible}
            phase={phase}
            allowPointer={allowPointer && visible}
            className="stage-canvas"
            cameraZ={6.2}
            lensScale={0.92}
          />
          <p className="pin-lens-caption">Scrutiny lens</p>
        </div>

        <div className="pin-copy-col">
          <ol className="pin-rail">
            {CHAPTERS.map((ch, i) => (
              <li
                key={ch.id}
                className={i === chapterIndex ? 'is-active' : undefined}
              >
                <span>{String(i + 1).padStart(2, '0')}</span>
                <span>{ch.label}</span>
              </li>
            ))}
          </ol>

          <div className="pin-chapters">
            {CHAPTERS.map((ch, i) => {
              const local = progress * CHAPTERS.length - i
              const active = local >= 0 && local < 1
              const show = reducedMotion ? i === chapterIndex : active || Math.abs(local - 0.5) < 0.85
              const opacity = reducedMotion
                ? i === chapterIndex
                  ? 1
                  : 0
                : Math.max(0, 1 - Math.abs(local - 0.5) * 2.2)
              const y = reducedMotion ? 0 : (local - 0.5) * 28

              return (
                <article
                  key={ch.id}
                  className="pin-chapter"
                  style={{
                    opacity: show ? opacity : 0,
                    transform: `translateY(${y}px)`,
                    pointerEvents: active || i === chapterIndex ? 'auto' : 'none',
                  }}
                  aria-hidden={!(active || i === chapterIndex)}
                >
                  <p className="chapter-label light">{ch.kicker}</p>
                  <h2 className="display pin-title">
                    {ch.emphLead} <span className="emph">{ch.emph}</span>
                  </h2>
                  <p className="body-l light-muted">{ch.body}</p>
                  {ch.id === 'creds' ? (
                    <p className="pin-monument" aria-label="GPA 3.96">
                      3.96
                    </p>
                  ) : null}
                  {ch.id === 'work' ? (
                    <p className="pin-meta">{PERSON.city} · remote welcome</p>
                  ) : null}
                  <a className="btn btn-ghost-light pin-cta" href={ch.href}>
                    {ch.cta}
                  </a>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
