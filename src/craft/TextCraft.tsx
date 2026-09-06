/**
 * React Bits–style text craft: TextPressure, ScrambleHero, BlurText, GlitchAccent.
 */
import {
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from 'react'
import { gsap, useReducedMotionPref } from '../motion'

const SCRAMBLE = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789░▒▓█'

export function ScrambleHero({
  text,
  id,
  className,
}: {
  text: string
  id?: string
  className?: string
}) {
  const rootRef = useRef<HTMLHeadingElement>(null)
  const reduced = useReducedMotionPref()

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || reduced) return
    const chars = root.querySelectorAll<HTMLElement>('[data-char]')
    if (!chars.length) return
    const originals = Array.from(chars).map((c) => c.dataset.final ?? '')

    const ctx = gsap.context(() => {
      chars.forEach((el, i) => {
        const final = originals[i]
        if (!/[A-Za-z0-9]/.test(final)) return
        const proxy = { t: 0 }
        gsap.to(proxy, {
          t: 1,
          duration: 1.05,
          delay: 0.08 + i * 0.038,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent =
              proxy.t < 0.78 ? SCRAMBLE[(Math.random() * SCRAMBLE.length) | 0] : final
          },
          onComplete: () => {
            el.textContent = final
          },
        })
      })

      gsap.fromTo(
        chars,
        { opacity: 0, y: 64, filter: 'blur(22px)', rotateX: 38 },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          rotateX: 0,
          duration: 1.05,
          stagger: 0.038,
          ease: 'power4.out',
          delay: 0.08,
          clearProps: 'filter,transform,opacity',
        },
      )
    }, root)
    return () => ctx.revert()
  }, [text, reduced])

  const parts = text.split(/(\s+)/)

  return (
    <h1 id={id} className={`im-scramble ${className ?? ''}`.trim()} ref={rootRef} aria-label={text}>
      {parts.map((part, i) => {
        if (/^\s+$/.test(part)) {
          return (
            <span key={`sp-${i}`} className="im-split-space">
              {part}
            </span>
          )
        }
        return (
          <span key={`w-${i}`} className="im-split-word">
            {part.split('').map((ch, j) => (
              <span
                key={`${i}-${j}`}
                className="im-split-char"
                data-char
                data-final={ch}
                aria-hidden="true"
              >
                {ch}
              </span>
            ))}
          </span>
        )
      })}
    </h1>
  )
}

/** Pointer-pressure scale per character (React Bits TextPressure pattern). */
export function TextPressure({
  text,
  className,
  as: Tag = 'p',
}: {
  text: string
  className?: string
  as?: 'p' | 'span' | 'h2' | 'h3'
}) {
  const rootRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotionPref()

  useEffect(() => {
    const root = rootRef.current
    if (!root || reduced) return
    if (typeof window.matchMedia === 'function' && !window.matchMedia('(pointer: fine)').matches) {
      return
    }
    const chars = root.querySelectorAll<HTMLElement>('[data-press]')

    const onMove = (e: MouseEvent) => {
      chars.forEach((el) => {
        const r = el.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        const d = Math.hypot(e.clientX - cx, e.clientY - cy)
        const influence = Math.max(0, 1 - d / 190)
        const scale = 1 + influence * 0.85
        const y = -influence * 16
        el.style.transform = `translateY(${y}px) scale(${scale})`
        el.style.color = influence > 0.12 ? (influence > 0.55 ? '#7ee0ff' : '#e8f0ff') : ''
      })
    }
    const onLeave = () => {
      chars.forEach((el) => {
        el.style.transform = ''
        el.style.color = ''
      })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    root.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      root.removeEventListener('mouseleave', onLeave)
    }
  }, [text, reduced])

  return (
    <Tag ref={rootRef as never} className={`im-pressure ${className ?? ''}`.trim()} aria-label={text}>
      {text.split('').map((ch, i) =>
        ch === ' ' ? (
          <span key={i} className="im-pressure-space">
            {' '}
          </span>
        ) : (
          <span key={i} className="im-pressure-char" data-press aria-hidden="true">
            {ch}
          </span>
        ),
      )}
    </Tag>
  )
}

export function BlurText({
  text,
  as: Tag = 'span',
  className,
  delay = 0,
  id,
}: {
  text: string
  as?: 'span' | 'h2' | 'h3' | 'p'
  className?: string
  delay?: number
  id?: string
}) {
  const rootRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotionPref()

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || reduced) return
    const words = root.querySelectorAll<HTMLElement>('[data-blur-word]')
    if (!words.length) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { opacity: 0, y: 18, filter: 'blur(12px)', letterSpacing: '0.08em' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          letterSpacing: '0em',
          duration: 0.55,
          stagger: 0.04,
          delay,
          ease: 'power3.out',
          clearProps: 'filter,transform,opacity,letterSpacing',
          scrollTrigger: { trigger: root, start: 'top 90%', once: true },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [text, reduced, delay])

  const words = text.split(/(\s+)/)

  return (
    <Tag ref={rootRef as never} id={id} className={className} aria-label={text}>
      {words.map((w, i) =>
        /^\s+$/.test(w) ? (
          <span key={`s-${i}`}>{w}</span>
        ) : (
          <span key={`w-${i}`} className="im-blur-word" data-blur-word aria-hidden="true">
            {w}
          </span>
        ),
      )}
    </Tag>
  )
}

/** Tasteful flicker / glitch on a short accent string. */
export function GlitchAccent({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotionPref()
  return (
    <span className={`im-glitch${reduced ? '' : ' im-glitch-live'} ${className ?? ''}`.trim()} data-text={typeof children === 'string' ? children : undefined}>
      {children}
    </span>
  )
}
