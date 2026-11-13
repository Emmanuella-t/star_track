import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { PrototypeNotice } from '../components/PrototypeNotice'
import { SiteHeader } from '../components/SiteHeader'
import { ApiError } from '../lib/api'
import { formatAppointmentRange } from '../lib/dateTime'
import { fetchAdvisorAppointments } from '../services/appointmentsApi'
import { reasonLabel, type Appointment } from '../types/appointments'
import './Appointments.css'

type LoadState = 'loading' | 'ready' | 'error'

export function AdvisorAppointments() {
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [error, setError] = useState<string | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])

  async function loadData(signal?: AbortSignal) {
    setLoadState('loading')
    setError(null)
    try {
      const next = await fetchAdvisorAppointments(signal)
      if (signal?.aborted) return
      setAppointments(next)
      setLoadState('ready')
    } catch (err) {
      if (signal?.aborted) return
      setLoadState('error')
      setError(
        err instanceof ApiError
          ? err.message
          : 'Unable to load appointments. Check that the API is running.',
      )
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    void loadData(controller.signal)
    return () => controller.abort()
  }, [])

  return (
    <div className="appointments-page">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader variant="app" />

      <main id="main-content" className="container appointments-page__main">
        <header className="appointments-page__header">
          <h1>Your Appointments</h1>
          <p className="appointments-page__lead">
            Upcoming meetings students have booked with you.
          </p>
          <div className="appointments-page__nav">
            <Link className="appointments-page__back" to="/advisor/dashboard">
              Back to dashboard
            </Link>
            <Button to="/advisor/availability" variant="primary">
              Manage availability
            </Button>
          </div>
        </header>

        {loadState === 'loading' ? (
          <p className="appointments-status" role="status">
            Loading appointments…
          </p>
        ) : null}

        {error ? (
          <p className="appointments-status appointments-status--error" role="alert">
            {error}
          </p>
        ) : null}

        {loadState === 'error' ? (
          <Button type="button" variant="primary" onClick={() => void loadData()}>
            Try again
          </Button>
        ) : null}

        {loadState === 'ready' ? (
          <section className="appointments-panel" aria-labelledby="advisor-upcoming-heading">
            <h2 id="advisor-upcoming-heading">Upcoming meetings</h2>
            {appointments.length === 0 ? (
              <p className="appointments-status">No upcoming appointments yet.</p>
            ) : (
              <ul className="appointment-list">
                {appointments.map((appointment) => (
                  <li key={appointment.id} className="appointment-item">
                    <div className="appointment-item__title">{appointment.student_name}</div>
                    <div className="appointment-item__meta">
                      {formatAppointmentRange(appointment.starts_at, appointment.ends_at)}
                    </div>
                    <div className="appointment-item__meta">
                      {reasonLabel(appointment.reason)} · {appointment.status}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ) : null}

        <PrototypeNotice />
      </main>
    </div>
  )
}
