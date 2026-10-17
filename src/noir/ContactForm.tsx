import { useState, type FormEvent } from 'react'
import { CONTACT_FORM } from '../content'

type Status = 'idle' | 'sending' | 'sent' | 'error'

interface Web3FormsReply {
  success: boolean
  message?: string
}

/** Sends through Web3Forms so no inbox address ships in the page. */
export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [note, setNote] = useState('')

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    setStatus('sending')
    setNote('Sending…')
    try {
      const res = await fetch(CONTACT_FORM.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      })
      const reply = (await res.json()) as Web3FormsReply
      if (res.ok && reply.success) {
        form.reset()
        setStatus('sent')
        setNote('Thanks. Your message is on its way, and I will reply by email.')
      } else {
        setStatus('error')
        setNote(`Not sent: ${reply.message ?? 'the form service refused it'}. Try again or use LinkedIn.`)
      }
    } catch {
      setStatus('error')
      setNote('Not sent: the network request failed. Try again or use LinkedIn.')
    }
  }

  return (
    <form className="noir-form" onSubmit={onSubmit} aria-describedby="noir-form-status">
      <input type="hidden" name="access_key" value={CONTACT_FORM.accessKey} />
      <input type="hidden" name="subject" value="New message from km-it-ops.github.io" />
      <input type="hidden" name="from_name" value="KM-it-ops portfolio" />
      <input
        type="checkbox"
        name="botcheck"
        className="noir-form-trap"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <label className="noir-form-field">
        <span>Name</span>
        <input type="text" name="name" required maxLength={120} autoComplete="name" />
      </label>
      <label className="noir-form-field">
        <span>Your email</span>
        <input type="email" name="email" required maxLength={200} autoComplete="email" />
      </label>
      <label className="noir-form-field noir-form-wide">
        <span>Message</span>
        <textarea name="message" required rows={5} maxLength={4000} />
      </label>
      <div className="noir-form-foot">
        <button type="submit" className="noir-form-send" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </button>
        <p id="noir-form-status" className={`noir-form-status is-${status}`} role="status" aria-live="polite">
          {note}
        </p>
      </div>
    </form>
  )
}
