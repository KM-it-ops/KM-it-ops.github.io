import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'

interface Chapter {
  id: string
  label: string
}

const chapters: Chapter[] = [
  { id: 'education', label: 'Education' },
  { id: 'certification', label: 'Certification' },
  { id: 'coursework', label: 'Coursework' },
  { id: 'flagships', label: 'Work' },
]

interface Tick {
  id: string
  label: string
  ratio: number
}

export function Rail() {
  const { scrollYProgress } = useScroll()
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 24 })
  const [ticks, setTicks] = useState<Tick[]>([])
  const [active, setActive] = useState<string>('')

  useEffect(() => {
    const measure = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      if (max <= 0) return
      const next = chapters
        .map((c) => {
          const el = document.getElementById(c.id)
          if (!el) return null
          const top = el.getBoundingClientRect().top + window.scrollY
          return { id: c.id, label: c.label, ratio: Math.min(Math.max(top / max, 0), 1) }
        })
        .filter((t): t is Tick => t !== null)
      setTicks(next)
    }

    const visibility = new Map<string, number>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibility.set(entry.target.id, entry.intersectionRatio)
        }
        let best = ''
        let bestRatio = 0
        for (const [id, ratio] of visibility) {
          if (ratio > bestRatio) {
            bestRatio = ratio
            best = id
          }
        }
        setActive(bestRatio > 0 ? best : '')
      },
      { threshold: [0.05, 0.2, 0.4, 0.6] },
    )

    for (const c of chapters) {
      const el = document.getElementById(c.id)
      if (el) observer.observe(el)
    }

    measure()
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const activeLabel = chapters.find((c) => c.id === active)?.label

  return (
    <nav className="rail" aria-label="Chapters">
      <span className="rail-track" aria-hidden="true">
        <motion.span className="rail-fill" style={{ scaleY: fill }} />
        {ticks.map((t) => (
          <span
            key={t.id}
            className={`rail-tick${t.id === active ? ' is-active' : ''}`}
            style={{ top: `${t.ratio * 100}%` }}
          />
        ))}
      </span>
      <span className="rail-label" aria-live="polite">
        {activeLabel ?? 'Record'}
      </span>
    </nav>
  )
}
