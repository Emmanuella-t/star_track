import { Link } from 'react-router-dom'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import './Button.css'

type Variant = 'primary' | 'secondary' | 'ghost' | 'gold'
type Size = 'md' | 'lg'

type CommonProps = {
  children: ReactNode
  variant?: Variant
  size?: Size
  className?: string
}

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    to?: undefined
    href?: undefined
  }

type ButtonAsLink = CommonProps & {
  to: string
  href?: undefined
  onClick?: () => void
}

type ButtonAsAnchor = CommonProps & {
  href: string
  to?: undefined
  onClick?: () => void
}

export type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor

function classNames(variant: Variant, size: Size, className?: string) {
  return ['st-btn', `st-btn--${variant}`, `st-btn--${size}`, className]
    .filter(Boolean)
    .join(' ')
}

export function Button(props: ButtonProps) {
  const { children, variant = 'primary', size = 'md', className } = props
  const classes = classNames(variant, size, className)

  if ('to' in props && props.to) {
    return (
      <Link to={props.to} className={classes} onClick={props.onClick}>
        {children}
      </Link>
    )
  }

  if ('href' in props && props.href) {
    return (
      <a href={props.href} className={classes} onClick={props.onClick}>
        {children}
      </a>
    )
  }

  const buttonProps = props as ButtonAsButton
  return (
    <button
      type={buttonProps.type ?? 'button'}
      className={classes}
      disabled={buttonProps.disabled}
      onClick={buttonProps.onClick}
      aria-label={buttonProps['aria-label']}
    >
      {children}
    </button>
  )
}
