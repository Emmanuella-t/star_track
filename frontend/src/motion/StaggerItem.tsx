import { motion, useReducedMotion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'
import { fadeUp } from './variants'

type StaggerItemProps = {
  children: ReactNode
  className?: string
  variants?: Variants
  as?: 'div' | 'li' | 'article'
}

export function StaggerItem({
  children,
  className,
  variants = fadeUp,
  as = 'div',
}: StaggerItemProps) {
  const reduceMotion = useReducedMotion()
  const Component = motion[as]

  if (reduceMotion) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <Component className={className} variants={variants}>
      {children}
    </Component>
  )
}
