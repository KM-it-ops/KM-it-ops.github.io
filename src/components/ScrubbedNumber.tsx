import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'

interface ScrubbedNumberProps {
  value: number
  format: (n: number) => string
}

export function ScrubbedNumber({ value, format }: ScrubbedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 95%', 'start 55%'],
  })
  const display = useTransform(scrollYProgress, [0, 1], [0, value])
  const text = useTransform(display, format)

  if (reduce) return <span ref={ref}>{format(value)}</span>
  return (
    <motion.span ref={ref} className="scrubbed-number">
      {text}
    </motion.span>
  )
}
