/**
 * Night Dossier v2.5 — center-stage WebGL atmosphere wrapper.
 * Pointer-reactive light + scroll parallax/dim. Reduced-motion → static poster.
 */
import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { useReducedMotionPref } from './motion'
import type { PointerNorm } from './LogoSpotlightScene'

const LazyCanvasScene = lazy(() =>
  import('./LogoSpotlightScene').then((m) => ({ default: m.LogoSpotlightScene })),
)

function useScrollAtmosphere(enabled: boolean) {
  const [opacity, setOpacity] = useState(1)
  const [nearHero, setNearHero] = useState(true)
  const [scrollT, setScrollT] = useState(0)
  useEffect(() => {
    if (!enabled) {
      setOpacity(1)
      setNearHero(true)
      setScrollT(0)
      return
    }
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const y = window.scrollY || document.documentElement.scrollTop
        const vh = window.innerHeight || 1
        // Ease-out dim: hold presence early, then settle intentionally
        const raw = Math.min(1, Math.max(0, y / (vh * 1.05)))
        const t = raw * raw // quadratic ease-in settle
        setScrollT(Math.min(1, Math.max(0, y / (vh * 1.15))))
        setOpacity(0.12 + (1 - t) * 0.88)
        setNearHero(y < vh * 1.3)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [enabled])
  return { opacity, nearHero, scrollT }
}

function usePointerNorm(enabled: boolean): PointerNorm {
  const [p, setP] = useState<PointerNorm>({ x: 0, y: 0 })
  useEffect(() => {
    if (!enabled) {
      setP({ x: 0, y: 0 })
      return
    }
    if (typeof window.matchMedia === 'function' && !window.matchMedia('(pointer: fine)').matches) {
      return
    }
    let raf = 0
    let nx = 0
    let ny = 0
    const onMove = (e: MouseEvent) => {
      nx = (e.clientX / window.innerWidth) * 2 - 1
      ny = -((e.clientY / window.innerHeight) * 2 - 1)
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setP({ x: nx, y: ny }))
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
    }
  }, [enabled])
  return p
}

function usePageVisible() {
  const [visible, setVisible] = useState(
    typeof document === 'undefined' ? true : document.visibilityState !== 'hidden',
  )
  useEffect(() => {
    const onVis = () => setVisible(document.visibilityState !== 'hidden')
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])
  return visible
}

/** Fixed backdrop layer — pointer-events none, under main content. */
export function LogoSpotlight() {
  const reduced = useReducedMotionPref()
  const pageVisible = usePageVisible()
  const wrapRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const { opacity: scrollOpacity, nearHero, scrollT } = useScrollAtmosphere(!reduced)
  const pointer = usePointerNorm(!reduced && nearHero)

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 60)
    return () => window.clearTimeout(id)
  }, [])

  const active = pageVisible && nearHero
  const showCanvas = ready && !reduced

  return (
    <div
      ref={wrapRef}
      className="dd-logo-spotlight"
      aria-hidden="true"
      style={{ opacity: scrollOpacity }}
    >
      {reduced || !showCanvas ? (
        <div className="dd-logo-spotlight-poster" />
      ) : (
        <Suspense fallback={<div className="dd-logo-spotlight-poster" />}>
          <LazyCanvasScene active={active} pointer={pointer} scrollT={scrollT} />
        </Suspense>
      )}
      <div className="dd-logo-spotlight-veil" />
      <div className="dd-logo-spotlight-grain" />
    </div>
  )
}
