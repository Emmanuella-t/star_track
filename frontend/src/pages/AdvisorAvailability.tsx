import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { PrototypeNotice } from '../components/PrototypeNotice'
import { SiteHeader } from '../components/SiteHeader'
import { ApiError } from '../lib/api'
import { chicagoLocalToUtcIso, formatAppointmentRange } from '../lib/dateTime'
import {
  createAdvisorSlot,
  fetchAdvisorSlots,
  removeAdvisorSlot,
} from '../services/appointmentsApi'
import type { AvailabilitySlot } from '../types/appointments'
import './Appointments.css'

type LoadState = 'loading' | 'ready' | 'error'

function availabilityLabel(value: AvailabilitySlot['availability']): string {
  switch (value) {
    case 'available':
      return 'Available'
    case 'booked':
      return 'Booked'
    case 'closed':
      return 'Closed'
    case 'past':
      return 'Past'
    default:
      return value
  }
}

export function AdvisorAvailability() {
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [slots, setSlots] = useState<AvailabilitySlot[]>([])
  const [date, setDate] = useState('')
  const [time, setTime] = useState('10:00')
  const [submitting, setSubmitting] = useState(false)

  async function loadData(signal?: AbortSignal) {
    setLoadState('loading')
    setError(null)
    try {
      const next = await fetchAdvisorSlots(signal)
      if (signal?.aborted) return
      setSlots(next)
      setLoadState('ready')
    } catch (err) {
      if (signal?.aborted) return
      setLoadState('error')
      setError(
        err instanceof ApiError
          ? err.message
          : 'Unable to load availability. Check that the API is running.',
      )
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    void loadData(controller.signal)
    return () => controller.abort()
  }, [])

  async function handleCreate(event: FormEvent) {
    event.preventDefault()
    if (!date || !time) {
      setError('Choose a date and time for the new slot.')
      return
    }

    setSubmitting(true)
    setError(null)
    setSuccess(null)
    try {
      const created = await createAdvisorSlot(chicagoLocalToUtcIso(date, time))
      setSuccess(
        `Added ${formatAppointmentRange(created.starts_at, created.ends_at)}.`,
      )
      setDate('')
      await loadData()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to create that availability slot.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleRemove(slotId: number) {
    setSubmitting(true)
    setError(null)
    setSuccess(null)
    try {
      await removeAdvisorSlot(slotId)
      setSuccess('Availability slot closed.')
      await loadData()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to close that slot.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="appointments-page">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader variant="app" />

      <main id="main-content" className="container appointments-page__main">
        <header className="appointments-page__header">
          <h1>Manage Availability</h1>
          <p className="appointments-page__lead">
            Publish 30-minute advising times students can book.
          </p>
          <div className="appointments-page__nav">
            <Link className="appointments-page__back" to="/advisor/dashboard">
              Back to dashboard
            </Link>
            <Button to="/advisor/appointments" variant="ghost">
              View appointments
            </Button>
          </div>
        </header>

        {loadState === 'loading' ? (
          <p className="appointments-status" role="status">
            Loading availability…
          </p>
        ) : null}

        {error ? (
          <p className="appointments-status appointments-status--error" role="alert">
            {error}
          </p>
        ) : null}

        {success ? (
          <p className="appointments-status appointments-status--success" role="status">
            {success}
          </p>
        ) : null}

        {loadState === 'error' ? (
          <Button type="button" variant="primary" onClick={() => void loadData()}>
            Try again
          </Button>
        ) : null}

        {loadState === 'ready' ? (
          <div className="appointments-layout">
            <section className="appointments-panel" aria-labelledby="create-slot-heading">
              <h2 id="create-slot-heading">Add an open time</h2>
              <p className="appointments-panel__intro">
                Times are shown in Central Time (America/Chicago).
              </p>
              <form className="booking-form" onSubmit={handleCreate}>
                <label>
                  Date
                  <input
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    required
                  />
                </label>
                <label>
                  Start time
                  <input
                    type="time"
                    value={time}
                    onChange={(event) => setTime(event.target.value)}
                    required
                  />
                </label>
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? 'Saving…' : 'Add availability'}
                </Button>
              </form>
            </section>

            <section className="appointments-panel" aria-labelledby="slot-list-heading">
              <h2 id="slot-list-heading">Your schedule</h2>
              {slots.length === 0 ? (
                <p className="appointments-status">No availability slots yet.</p>
              ) : (
                <ul className="slot-list">
                  {slots.map((slot) => (
                    <li key={slot.id} className="slot-row">
                      <div className="slot-row__copy">
                        <strong>{formatAppointmentRange(slot.starts_at, slot.ends_at)}</strong>
                        <span className={`slot-badge slot-badge--${slot.availability}`}>
                          {availabilityLabel(slot.availability)}
                        </span>
                      </div>
                      {slot.availability === 'available' ? (
                        <Button
                          type="button"
                          variant="ghost"
                          disabled={submitting}
                          onClick={() => void handleRemove(slot.id)}
                        >
                          Close slot
                        </Button>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        ) : null}

        <PrototypeNotice />
      </main>
    </div>
  )
}
