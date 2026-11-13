import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Button } from './Button'
import './SiteHeader.css'

type SiteHeaderProps = {
  variant?: 'marketing' | 'app'
  inverted?: boolean
}

const marketingLinks = [
  { href: '/#features', label: 'Features' },
  { href: '/#how-it-works', label: 'How It Works' },
]

export function SiteHeader({ variant = 'marketing', inverted = false }: SiteHeaderProps) {
  const [open, setOpen] = useState(false)
  const logoSrc = inverted
    ? '/assets/brand/logo-horizontal-reversed.svg'
    : '/assets/brand/logo-horizontal.svg'

  return (
    <header className={['site-header', inverted ? 'site-header--inverted' : ''].join(' ')}>
      <div className="site-header__inner container">
        <Link to="/" className="site-header__brand" aria-label="Star Track home">
          <img src={logoSrc} alt="Star Track" className="site-header__logo" width={168} height={40} />
        </Link>

        {variant === 'marketing' ? (
          <>
            <nav className="site-header__nav" aria-label="Primary">
              <NavLink to="/" className="site-header__link" end>
                Home
              </NavLink>
              {marketingLinks.map((link) => (
                <a key={link.href} href={link.href} className="site-header__link">
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="site-header__actions">
              <Button to="/demo" variant={inverted ? 'gold' : 'primary'} size="md">
                Get Started
              </Button>
              <button
                type="button"
                className="site-header__menu"
                aria-expanded={open}
                aria-controls="mobile-nav"
                onClick={() => setOpen((value) => !value)}
              >
                <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
                <span aria-hidden="true">{open ? '✕' : '☰'}</span>
              </button>
            </div>

            <div
              id="mobile-nav"
              className={['site-header__drawer', open ? 'is-open' : ''].join(' ')}
              hidden={!open}
            >
              <NavLink to="/" className="site-header__drawer-link" end onClick={() => setOpen(false)}>
                Home
              </NavLink>
              {marketingLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="site-header__drawer-link"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <Button to="/demo" variant="gold" onClick={() => setOpen(false)}>
                Get Started
              </Button>
            </div>
          </>
        ) : (
          <nav className="site-header__nav site-header__nav--app" aria-label="App">
            <Link to="/" className="site-header__link">
              Home
            </Link>
            <Link to="/demo" className="site-header__link">
              Switch role
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
