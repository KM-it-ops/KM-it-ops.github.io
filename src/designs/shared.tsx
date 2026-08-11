import {
  useCallback,
  useState,
  type ReactNode,
} from 'react'
import { motion, useReducedMotion } from 'motion/react'

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

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
