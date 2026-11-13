import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { staggerChildren } from './variants'

type StaggerProps = {
  children: ReactNode
  className?: string
  stagger?: number
  delayChildren?: number
  as?: 'div' | 'ul' | 'ol' | 'section'
}

export function Stagger({
  children,
  className,
  stagger = 0.12,
  delayChildren = 0.05,
  as = 'div',
}: StaggerProps) {
  const reduceMotion = useReducedMotion()
  const Component = motion[as]

  if (reduceMotion) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <Component
      className={className}
      variants={staggerChildren(stagger, delayChildren)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </Component>
  )
}
