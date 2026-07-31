import { useEffect, useRef } from 'react'
import type { Project } from './content'
import { PROJECTS } from './content'

type Props = {
  reducedMotion: boolean
}

export function WorkCinema({ reducedMotion }: Props) {
  const railRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const rail = railRef.current
    if (!rail || reducedMotion) return

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
      const atStart = rail.scrollLeft <= 0
      const atEnd =
        rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2
      if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return
      e.preventDefault()
      rail.scrollLeft += e.deltaY
    }

    rail.addEventListener('wheel', onWheel, { passive: false })
    return () => rail.removeEventListener('wheel', onWheel)
  }, [reducedMotion])

  return (
    <section className="work-cinema band-void" id="work" aria-label="Work cinema">
      <div className="aurora work-aurora" aria-hidden />
      <div className="wrap work-cinema-head">
        <p className="chapter-label light">Selected work</p>
        <h2 className="display tight">
          Horizontal <span className="emph">proof rail</span>
        </h2>
        <p className="body-l light-muted">
          Scrub the filmstrip. Every frame maps to a public artifact.
        </p>
      </div>

      <div
        className="cinema-rail"
        ref={railRef}
        tabIndex={0}
        aria-label="Project filmstrip"
      >
        {PROJECTS.map((project, i) => (
          <CinemaCard key={project.name} project={project} index={i} />
        ))}
      </div>
      <p className="cinema-hint">Drag, shift+wheel, or arrow keys</p>
    </section>
  )
}

function CinemaCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className="cinema-card">
      <div className="cinema-card-glow" aria-hidden />
      <p className="cinema-index">{String(index + 1).padStart(2, '0')}</p>
      <h3>{project.name}</h3>
      <p className="cinema-line">{project.line}</p>
      {project.scores ? (
        <ol className="cinema-scores">
          {project.scores.slice(0, 4).map((s) => (
            <li key={s.agent}>
              <span>{s.agent}</span>
              <span className="score">{s.score}</span>
            </li>
          ))}
        </ol>
      ) : null}
      {project.trademark ? <p className="cinema-fine">{project.trademark}</p> : null}
      {project.links.length > 0 ? (
        <div className="link-row cinema-links">
          {project.links.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer">
              {l.label}
            </a>
          ))}
        </div>
      ) : (
        <p className="cinema-fine">Walkthrough on request.</p>
      )}
    </article>
  )
}
