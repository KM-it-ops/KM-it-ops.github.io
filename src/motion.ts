/* The site's single animation system.
 *
 * GSAP owns every scripted animation; CSS keeps the marquee, the net draw, and
 * all hover/focus/tap states. Nothing else animates, and no two systems ever
 * drive the same property.
 *
 * The hard constraints here come from `tools/checks/audit.js`, not from taste —
 * see notes/motion-direction-2026-08-28.md. The load-bearing one: animated
 * opacity never goes on an element that directly contains text, because the gate
 * skips `opacity: 0` elements and the contrast sample would silently shrink.
 */
import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

const REDUCE = '(prefers-reduced-motion: reduce)'
const FINE_POINTER = '(pointer: fine)'

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
  return window.matchMedia(REDUCE).matches
}

/** Reactive `prefers-reduced-motion`, replacing motion/react's hook. */
export function useReducedMotionPref(): boolean {
  const [reduced, setReduced] = useState(prefersReducedMotion)
  useEffect(() => {
    const mq = window.matchMedia(REDUCE)
    const onChange = () => setReduced(mq.matches)
    setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

/* Smooth scroll.
 *
 * Lenis over Locomotive: smaller, actively maintained, and it drives the real
 * scroll position instead of transforming a wrapper element — a wrapper would
 * break the `position: fixed` WebGL canvas and the looks panel on this page.
 *
 * Off entirely under reduced motion and on coarse pointers. Touch platforms
 * already have momentum scrolling; overriding it costs more than it buys.
 */
export function startSmoothScroll(): () => void {
  if (prefersReducedMotion()) return () => {}
  if (typeof window.matchMedia === 'function' && !window.matchMedia(FINE_POINTER).matches) {
    return () => {}
  }

  const lenis = new Lenis({
    autoRaf: false,
    // Cinematic scored rhythm — immersive craft scroll (v2.9).
    lerp: 0.075,
    wheelMultiplier: 1,
    touchMultiplier: 1,
  })

  const onScroll = () => ScrollTrigger.update()
  lenis.on('scroll', onScroll)

  const raf = (time: number) => lenis.raf(time * 1000)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)

  /* Anchor links, with focus preserved.
   *
   * Lenis's own `anchors` option calls preventDefault and never moves focus, so
   * a keyboard user activating "Skip to content" would be scrolled somewhere
   * their focus is not. Handle it here instead: scroll smoothly, then move focus
   * to the target the way native anchor navigation would. */
  const onAnchorClick = (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    const link = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null
    if (!link) return
    const id = link.getAttribute('href')?.slice(1)
    if (!id) return
    const target = document.getElementById(id)
    if (!target) return

    e.preventDefault()
    lenis.scrollTo(target, {
      // Clear fixed pill nav (~5.25rem) — avoids overshoot flash into unpainted gaps
      offset: -88,
      onComplete: () => {
        // Keep the ?palette= query — a bare "#id" href would resolve it away.
        const url = new URL(window.location.href)
        url.hash = id
        window.history.replaceState(null, '', url)
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
        target.focus({ preventScroll: true })
      },
    })
  }
  document.addEventListener('click', onAnchorClick)

  // Fonts change every measurement on this page; refresh once they settle.
  let refreshed = false
  const refresh = () => {
    if (refreshed) return
    refreshed = true
    ScrollTrigger.refresh()
  }
  if (document.fonts?.ready) void document.fonts.ready.then(refresh)
  else window.addEventListener('load', refresh, { once: true })

  return () => {
    document.removeEventListener('click', onAnchorClick)
    lenis.off('scroll', onScroll)
    gsap.ticker.remove(raf)
    gsap.ticker.lagSmoothing(500, 33)
    lenis.destroy()
  }
}
