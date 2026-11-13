import type { ReactNode } from 'react'
import './Badge.css'

type BadgeProps = {
  children: ReactNode
  tone?: 'mint' | 'gold' | 'ink' | 'sample'
  className?: string
}

export function Badge({ children, tone = 'mint', className }: BadgeProps) {
  return (
    <span className={['st-badge', `st-badge--${tone}`, className].filter(Boolean).join(' ')}>
      {children}
    </span>
  )
}
