import { coursework } from '../data'
import { RevealStagger } from './Reveal'

export function Coursework() {
  return (
    <section className="chapter" id="coursework">
      <h2 className="chapter-title">Coursework</h2>
      <div className="clusters">
        <RevealStagger
          items={coursework.map((group) => (
            <div className="cluster">
              <h3 className="cluster-title">{group.title}</h3>
              <p className="cluster-flow">{group.courses.join(', ')}</p>
            </div>
          ))}
        />
      </div>
    </section>
  )
}
