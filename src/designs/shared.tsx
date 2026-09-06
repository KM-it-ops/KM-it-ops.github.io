import { useCallback, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { gsap, prefersReducedMotion } from '../motion'

export function useCopyToast() {
  const [toast, setToast] = useState<string | null>(null)
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
  return { toast, copy }
}

export function Toast({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <div className="shared-toast" role="status" aria-live="polite">
      {message}
    </div>
  )
}

/* Scroll reveal.
 *
 * Opacity is animated on this wrapper and never on the content inside it. The
 * gate treats an `opacity: 0` element as invisible and drops it from the
 * contrast sample, so fading a heading directly would shrink coverage without
 * ever failing — a silent false pass. The wrapper holds no text of its own, so
 * the text nodes underneath stay measurable the whole time.
 *
 * Vertical travel only: a resting horizontal offset would widen the document
 * and trip the reflow assertion.
 *
 * The hidden state is applied here at runtime, never in CSS, so a page loaded
 * without JavaScript renders complete.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 28, filter: 'blur(8px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.52,
          delay,
          ease: 'power4.out',
          // Hygiene: leave no inline transform or opacity behind once the reveal
          // has played, so every element the gate measures is in its plain
          // layout state. Verified — a full-page pass reports no residual inline
          // styles on any animated element.
          //
          // Honest note, because the wrong version of this comment stood here
          // for an hour: this was first added on the theory that a resting
          // `translate(0px, 0px)` was shrinking hit areas by a pixel. It was not.
          // The hit-area failure was a webfont race (see mash.css, .mash-nav nav a),
          // and adding clearProps did not change that result. It is kept because
          // it is correct, not because it fixed anything measured.
          clearProps: 'all',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        },
      )
    }, el)
    return () => ctx.revert()
  }, [delay])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
