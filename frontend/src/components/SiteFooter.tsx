import { Link } from 'react-router-dom'
import './SiteFooter.css'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          <img
            src="/assets/brand/logo-horizontal.svg"
            alt="Star Track"
            className="site-footer__logo"
            width={148}
            height={35}
          />
          <p>
            Helping students plan courses, ask catalog questions, and meet with advisors in one
            place.
          </p>
        </div>

        <div className="site-footer__links">
          <Link to="/">Home</Link>
          <a href="/#features">Features</a>
          <a href="/#how-it-works">How It Works</a>
          <Link to="/demo">Get Started</Link>
        </div>
      </div>
      <div className="container site-footer__meta">
        <p>Philander Smith University · Software Engineering · Group 3</p>
        <p>
          Progress is based on the courses you mark complete. Verify degree requirements with your
          academic advisor.
        </p>
      </div>
    </footer>
  )
}
