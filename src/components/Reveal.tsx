import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

const EASE = [0.16, 1, 0.3, 1] as const

interface RevealProps {
  children: ReactNode
  delay?: number
  y?: number
}

export function Reveal({ children, delay = 0, y = 24 }: RevealProps) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

interface RevealStaggerProps {
  items: ReactNode[]
  stagger?: number
}

export function RevealStagger({ items, stagger = 0.06 }: RevealStaggerProps) {
  return (
    <>
      {items.map((item, i) => (
        <Reveal key={i} delay={i * stagger}>
          {item}
        </Reveal>
      ))}
    </>
  )
}
