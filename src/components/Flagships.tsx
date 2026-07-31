import { RevealStagger } from './Reveal'

const frames = [
  { id: '01', status: 'In development' },
  { id: '02', status: 'In development' },
] as const

export function Flagships() {
  return (
    <section className="chapter" id="flagships">
      <h2 className="chapter-title">Selected Work</h2>
      <p className="frames-note">
        The previous showcase has been cleared. Two new projects are being built to stand here:
        nothing placeholder, nothing inflated.
      </p>
      <div className="frames">
        <RevealStagger
          items={frames.map((frame) => (
            <article className="frame">
              <span className="frame-id" aria-hidden="true">{frame.id}</span>
              <span className="frame-label">Flagship {frame.id}</span>
              <span className="frame-status">{frame.status}</span>
            </article>
          ))}
        />
      </div>
    </section>
  )
}
