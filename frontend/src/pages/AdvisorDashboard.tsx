import { Link } from 'react-router-dom'
import { BackendStatus } from '../components/BackendStatus'
import { Button } from '../components/Button'
import { PrototypeNotice } from '../components/PrototypeNotice'
import { SiteHeader } from '../components/SiteHeader'
import './DashboardPlaceholders.css'

export function AdvisorDashboard() {
  return (
    <div className="dash-page">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader variant="app" />

      <main id="main-content" className="container dash-page__main">
        <div className="dash-page__intro">
          <h1>Advisor dashboard</h1>
          <p>Manage your availability and see upcoming student appointments.</p>
          <BackendStatus className="backend-status--ink" />
        </div>

        <section className="dash-grid" aria-label="Advisor tools">
          <article className="dash-card">
            <h2>Availability</h2>
            <p>Publish office hours so students can book time with you.</p>
            <Button to="/advisor/availability" variant="primary">
              Manage availability
            </Button>
          </article>
          <article className="dash-card">
            <h2>Upcoming bookings</h2>
            <p>Review which students have reserved your open slots.</p>
            <Button to="/advisor/appointments" variant="primary">
              View appointments
            </Button>
          </article>
          <article className="dash-card">
            <h2>Student notes</h2>
            <p>Keep meeting context handy without pulling official transcripts.</p>
            <p className="dash-card__status">Coming soon</p>
          </article>
        </section>

        <div className="dash-page__actions">
          <Button to="/demo" variant="ghost">
            Switch role
          </Button>
          <Link className="dash-page__back" to="/">
            Back to home
          </Link>
        </div>

        <PrototypeNotice />
      </main>
    </div>
  )
}
