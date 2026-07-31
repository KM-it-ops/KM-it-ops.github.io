import { useState } from 'react'
import { certification } from '../data'
import { Reveal } from './Reveal'

export function Certification() {
  const [copied, setCopied] = useState(false)

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(certification.verifyCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="chapter vault" id="certification" aria-label="Certification">
      <Reveal>
        <div className="vault-inner">
          <h2 className="chapter-title vault-title">
            {certification.name} <span className="vault-exam">{certification.exam}</span>
          </h2>
          <button className="vault-artifact" type="button" onClick={copyCode} aria-label={`Copy verification code ${certification.verifyCode}`}>
            <span className="vault-code">{certification.verifyCode}</span>
            <span className="vault-copy-hint">{copied ? 'Copied to clipboard' : 'Click to copy the verification code'}</span>
          </button>
          <dl className="vault-meta">
            <div>
              <dt>Earned</dt>
              <dd>{certification.earned}</dd>
            </div>
            <div>
              <dt>Valid through</dt>
              <dd>{certification.validThrough}</dd>
            </div>
            <div>
              <dt>Certificate</dt>
              <dd>{certification.certNumber}</dd>
            </div>
            <div>
              <dt>Verify at</dt>
              <dd>
                <a className="verify-link" href={certification.verifyUrl} target="_blank" rel="noreferrer">
                  verify.comptia.org
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </Reveal>
    </section>
  )
}
