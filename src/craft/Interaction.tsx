/**
 * React Bits–style interaction craft: Magnet, SpotlightCard, BeamBorder,
 * AnimatedList, CountUp, SkillsMarquee.
 */
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { gsap, useReducedMotionPref } from '../motion'

export function MagneticCTA({
  href,
  children,
  className,
  target,
  rel,
}: {
  href: string
  children: ReactNode
  className?: string
  target?: string
  rel?: string
}) {
  const ref = useRef<HTMLAnchorElement>(null)
  const reduced = useReducedMotionPref()

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    if (typeof window.matchMedia === 'function' && !window.matchMedia('(pointer: fine)').matches) {
      return
    }

    let raf = 0
    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0
    let scale = 1
    let cScale = 1

    const tick = () => {
      cx += (tx - cx) * 0.24
      cy += (ty - cy) * 0.24
      cScale += (scale - cScale) * 0.2
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0) scale(${cScale})`
      if (Math.abs(tx - cx) > 0.04 || Math.abs(ty - cy) > 0.04 || Math.abs(scale - cScale) > 0.002) {
        raf = requestAnimationFrame(tick)
      } else {
        raf = 0
      }
    }

    const onMove = (e: globalThis.MouseEvent) => {
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      const dist = Math.hypot(dx, dy)
      const pull = Math.max(0, 1 - dist / 220)
      tx = dx * 0.48 * pull
      ty = dy * 0.48 * pull
      scale = 1 + 0.09 * pull
      if (!raf) raf = requestAnimationFrame(tick)
    }

    const onEnter = () => {
      scale = 1.08
      if (!raf) raf = requestAnimationFrame(tick)
    }
    const onLeave = () => {
      tx = 0
      ty = 0
      scale = 1
      if (!raf) raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(raf)
      el.style.transform = ''
    }
  }, [reduced])

  return (
    <a
      ref={ref}
      className={`im-magnetic ${className ?? ''}`.trim()}
      href={href}
      target={target}
      rel={rel}
    >
      <span className="im-magnetic-shine" aria-hidden="true" />
      <span className="im-magnetic-label">{children}</span>
    </a>
  )
}

export function SpotlightCard({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotionPref()

  const onMove = (e: MouseEvent) => {
    if (reduced) return
    const el = ref.current
    if (!el) return
    if (typeof window.matchMedia === 'function' && !window.matchMedia('(pointer: fine)').matches) {
      return
    }
    const r = el.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * 100
    const y = ((e.clientY - r.top) / r.height) * 100
    el.style.setProperty('--spot-x', `${x}%`)
    el.style.setProperty('--spot-y', `${y}%`)
    el.style.setProperty('--spot-o', '1')
    const angle =
      (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) /
      Math.PI
    el.style.setProperty('--beam-angle', `${angle}deg`)
  }

  const onLeave = () => {
    ref.current?.style.setProperty('--spot-o', '0')
  }

  const style = {
    '--spot-x': '50%',
    '--spot-y': '50%',
    '--spot-o': '0',
    '--beam-angle': '0deg',
  } as CSSProperties

  return (
    <div
      ref={ref}
      className={`im-spotlight ${className ?? ''}`.trim()}
      style={style}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      role="article"
    >
      <span className="im-spotlight-glow" aria-hidden="true" />
      <span className="im-border-beam" aria-hidden="true" />
      <div className="im-spotlight-body">{children}</div>
    </div>
  )
}

export function AnimatedList({
  items,
  className,
}: {
  items: { key: string; title: ReactNode; meta?: ReactNode; body?: ReactNode }[]
  className?: string
}) {
  const rootRef = useRef<HTMLUListElement>(null)
  const reduced = useReducedMotionPref()

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || reduced) return
    const rows = root.querySelectorAll<HTMLElement>('[data-alist]')
    const ctx = gsap.context(() => {
      gsap.fromTo(
        rows,
        { opacity: 0, x: -24, filter: 'blur(8px)' },
        {
          opacity: 1,
          x: 0,
          filter: 'blur(0px)',
          duration: 0.55,
          stagger: 0.08,
          ease: 'power3.out',
          clearProps: 'filter,transform,opacity',
          scrollTrigger: { trigger: root, start: 'top 88%', once: true },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [items, reduced])

  return (
    <ul ref={rootRef} className={`im-alist ${className ?? ''}`.trim()}>
      {items.map((item) => (
        <li key={item.key} data-alist className="im-alist-row">
          <div className="im-alist-title">{item.title}</div>
          {item.meta ? <div className="im-alist-meta">{item.meta}</div> : null}
          {item.body ? <div className="im-alist-body">{item.body}</div> : null}
        </li>
      ))}
    </ul>
  )
}

export function CountUp({
  value,
  decimals = 0,
  suffix = '',
  prefix = '',
  className,
  duration = 1.2,
}: {
  value: number
  decimals?: number
  suffix?: string
  prefix?: string
  className?: string
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotionPref()
  const formatted = useMemo(
    () => `${prefix}${value.toFixed(decimals)}${suffix}`,
    [value, decimals, prefix, suffix],
  )

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced) {
      el.textContent = formatted
      return
    }
    const proxy = { n: 0 }
    const ctx = gsap.context(() => {
      gsap.to(proxy, {
        n: value,
        duration,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        onUpdate: () => {
          el.textContent = `${prefix}${proxy.n.toFixed(decimals)}${suffix}`
        },
        onComplete: () => {
          el.textContent = formatted
        },
      })
    }, el)
    return () => ctx.revert()
  }, [value, decimals, prefix, suffix, duration, reduced, formatted])

  return (
    <span ref={ref} className={className} aria-label={formatted}>
      {formatted}
    </span>
  )
}

export function SkillsMarquee({ items }: { items: string[] }) {
  const reduced = useReducedMotionPref()
  const doubled = useMemo(() => [...items, ...items], [items])
  if (!items.length) return null
  return (
    <div className={`im-marquee${reduced ? ' im-marquee-static' : ''}`} aria-label="Skill highlights">
      <div className="im-marquee-track">
        {doubled.map((item, i) => (
          <span key={`${item}-${i}`} className="im-marquee-item" aria-hidden={i >= items.length}>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
