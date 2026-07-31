import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

interface MaskedRevealProps {
  text: string
  className?: string
  as?: 'h1' | 'span'
}

// Word-level masked reveal: overflow masks per word, yPercent 110 -> 0.
// Never letter-level; never splits text containing markup. aria-label keeps the string whole.
export function MaskedReveal({ text, className }: MaskedRevealProps) {
  const reduce = useReducedMotion()
  const words = text.split(' ')

  if (reduce) {
    return (
      <h1 className={className} aria-label={text}>
        {text}
      </h1>
    )
  }

  const rendered: ReactNode[] = words.map((word, i) => (
    <span key={i} className="word-mask" aria-hidden="true">
      <motion.span
        className="word"
        initial={{ y: '110%' }}
        animate={{ y: '0%' }}
        transition={{ duration: 0.85, delay: 0.15 + i * 0.045, ease: [0.16, 1, 0.3, 1] }}
      >
        {word}
      </motion.span>
      {i < words.length - 1 ? ' ' : ''}
    </span>
  ))

  return (
    <h1 className={className} aria-label={text}>
      {rendered}
    </h1>
  )
}
