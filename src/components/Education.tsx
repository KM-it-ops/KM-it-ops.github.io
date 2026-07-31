import { identity } from '../data'
import { Reveal } from './Reveal'
import { ScrubbedNumber } from './ScrubbedNumber'

export function Education() {
  return (
    <section className="chapter" id="education">
      <Reveal>
        <h2 className="chapter-title">Education</h2>
        <div className="ledger">
          <div className="ledger-main">
            <p className="edu-degree">
              {identity.degree}, <em>{identity.field}</em>
            </p>
            <p className="edu-line">
              Concentration in <strong>{identity.concentration}</strong>, graduated{' '}
              <em className="edu-honors">{identity.honors}</em>.
            </p>
            <p className="edu-line edu-numbers">
              <ScrubbedNumber value={identity.gpa} format={(n) => n.toFixed(3)} /> cumulative GPA
              across <ScrubbedNumber value={identity.presidentsListTerms} format={(n) => String(Math.round(n))} />{' '}
              President's List terms.
            </p>
          </div>
          <dl className="ledger-meta">
            <div>
              <dt>Institution</dt>
              <dd>{identity.school}</dd>
            </div>
            <div>
              <dt>Conferred</dt>
              <dd>{identity.conferred}</dd>
            </div>
            <div>
              <dt>Transfer credit</dt>
              <dd>{identity.transferCredit}</dd>
            </div>
            <div>
              <dt>Verification</dt>
              <dd>
                <a className="verify-link" href={identity.verifyUrl} target="_blank" rel="noreferrer">
                  parchment.com
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </Reveal>
    </section>
  )
}
