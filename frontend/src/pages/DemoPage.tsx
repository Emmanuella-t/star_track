import { Link } from 'react-router-dom'
import { BackendStatus } from '../components/BackendStatus'
import { Button } from '../components/Button'
import { PrototypeNotice } from '../components/PrototypeNotice'
import { SiteFooter } from '../components/SiteFooter'
import { SiteHeader } from '../components/SiteHeader'
import './DemoPage.css'

export function DemoPage() {
  return (
    <div className="demo-page">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader variant="marketing" />

      <main id="main-content" className="demo-page__main">
        <div className="container demo-page__content">
          <p className="section-kicker">Get started</p>
          <h1>Choose how you want to explore Star Track.</h1>
          <p className="demo-page__lead">
            Pick a role to open your workspace. This is a simple way into the app for now, not a
            secure campus login.
          </p>

          <div className="demo-roles" role="list">
            <article className="demo-role" role="listitem">
              <div className="demo-role__icon" aria-hidden="true">
                S
              </div>
              <h2>Continue as Student</h2>
              <p>
                Open your dashboard to track degree progress, ask catalog questions, and book
                advising time.
              </p>
              <Button to="/student/dashboard" variant="primary" size="lg">
                Continue as Student
              </Button>
            </article>

            <article className="demo-role" role="listitem">
              <div className="demo-role__icon demo-role__icon--advisor" aria-hidden="true">
                A
              </div>
              <h2>Continue as Advisor</h2>
              <p>
                Open the advisor workspace to manage availability and review student appointments.
              </p>
              <Button to="/advisor/dashboard" variant="ghost" size="lg">
                Continue as Advisor
              </Button>
            </article>
          </div>

          <div className="demo-page__status">
            <BackendStatus className="backend-status--ink" />
            <p>
              Looking for the home page? <Link to="/">Return home</Link>
            </p>
          </div>

          <PrototypeNotice />
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
