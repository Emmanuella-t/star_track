import { Link } from 'react-router-dom'
import { BackendStatus } from '../components/BackendStatus'
import { Button } from '../components/Button'
import { PrototypeNotice } from '../components/PrototypeNotice'
import { SiteHeader } from '../components/SiteHeader'
import './DashboardPlaceholders.css'

export function StudentDashboard() {
  return (
    <div className="dash-page">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader variant="app" />

      <main id="main-content" className="container dash-page__main">
        <div className="dash-page__intro">
          <h1>Student dashboard</h1>
          <p>Track your plan, ask catalog questions, and book time with an advisor.</p>
          <BackendStatus className="backend-status--ink" />
        </div>

        <section className="dash-grid" aria-label="Student tools">
          <article className="dash-card">
            <h2>Ask Star Track</h2>
            <p>Get answers grounded in approved academic documents, with clear citations.</p>
            <p className="dash-card__status">Coming soon</p>
          </article>
          <article className="dash-card">
            <h2>Degree progress</h2>
            <p>Review your Computer Science plan and mark courses as you finish them.</p>
            <Button to="/student/progress" variant="primary">
              Open degree progress
            </Button>
          </article>
          <article className="dash-card">
            <h2>Advisor appointments</h2>
            <p>Find an open time and reserve a meeting with your advisor.</p>
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
