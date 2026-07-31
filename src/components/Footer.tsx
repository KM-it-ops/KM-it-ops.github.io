import { identity } from '../data'

export function Footer() {
  return (
    <footer className="signoff">
      <p className="signoff-name">{identity.name}</p>
      <p className="signoff-line">
        {identity.field} ({identity.concentration}) · {identity.honors}
      </p>
      <div className="signoff-links">
        <a href={identity.githubUrl} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a href={identity.resumeUrl} target="_blank" rel="noreferrer">
          Resume
        </a>
      </div>
    </footer>
  )
}
