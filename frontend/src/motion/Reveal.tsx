import { motion, useReducedMotion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'
import { fadeUp } from './variants'

type RevealProps = {
  children: ReactNode
  className?: string
  variants?: Variants
  delay?: number
  as?: 'div' | 'section' | 'header' | 'footer' | 'li' | 'article'
  once?: boolean
  amount?: number | 'some' | 'all'
}

export function Reveal({
  children,
  className,
  variants = fadeUp,
  delay = 0,
  as = 'div',
  once = true,
  amount = 0.25,
}: RevealProps) {
  const reduceMotion = useReducedMotion()
  const Component = motion[as]

  if (reduceMotion) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <Component
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount, margin: '0px 0px -8% 0px' }}
      transition={{ delay }}
    >
      {children}
    </Component>
  )
}
