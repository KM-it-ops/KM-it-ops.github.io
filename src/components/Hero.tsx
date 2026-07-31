import { identity } from '../data'
import { MaskedReveal } from './MaskedReveal'

export function Hero() {
  return (
    <header className="cover">
      <div className="cover-filebar" aria-hidden="true">
        <span>Record · {identity.conferred}</span>
        <span>{identity.school}</span>
      </div>
      <MaskedReveal text={identity.name} className="cover-name" />
      <p className="cover-role">
        {identity.degree}, {identity.field} · {identity.concentration}
      </p>
      <div className="cover-ctas">
        <a className="cta cta-primary" href={identity.resumeUrl} target="_blank" rel="noreferrer">
          Resume (PDF)
        </a>
        <a className="cta cta-ghost" href={identity.githubUrl} target="_blank" rel="noreferrer">
          GitHub
        </a>
      </div>
    </header>
  )
}
