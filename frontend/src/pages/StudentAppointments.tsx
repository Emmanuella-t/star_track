import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { PrototypeNotice } from '../components/PrototypeNotice'
import { SiteHeader } from '../components/SiteHeader'
import { ApiError } from '../lib/api'
import { formatAppointmentRange } from '../lib/dateTime'
import {
  bookAppointment,
  cancelAppointment,
  fetchAvailableSlots,
  fetchStudentAppointments,
  rescheduleAppointment,
} from '../services/appointmentsApi'
import {
  APPOINTMENT_REASON_OPTIONS,
  reasonLabel,
  type Appointment,
  type AppointmentReason,
  type AvailabilitySlot,
} from '../types/appointments'
import './Appointments.css'

type LoadState = 'loading' | 'ready' | 'error'

export function StudentAppointments() {
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [slots, setSlots] = useState<AvailabilitySlot[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null)
  const [reason, setReason] = useState<AppointmentReason>('course_planning')
  const [submitting, setSubmitting] = useState(false)
  const [rescheduleId, setRescheduleId] = useState<number | null>(null)
  const [rescheduleSlotId, setRescheduleSlotId] = useState<number | null>(null)

  async function loadData(signal?: AbortSignal) {
    setLoadState('loading')
    setError(null)
    try {
      const [nextSlots, nextAppointments] = await Promise.all([
        fetchAvailableSlots(signal),
        fetchStudentAppointments(signal),
      ])
      if (signal?.aborted) return
      setSlots(nextSlots)
      setAppointments(nextAppointments)
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

  const selectedSlot = slots.find((slot) => slot.id === selectedSlotId) ?? null

  async function handleBook(event: FormEvent) {
    event.preventDefault()
    if (!selectedSlotId) {
      setError('Select an available time before confirming.')
      return
    }

    setSubmitting(true)
    setError(null)
    setSuccess(null)
    try {
      const booked = await bookAppointment(selectedSlotId, reason)
      setSuccess(
        `You're booked with ${booked.advisor_name} on ${formatAppointmentRange(booked.starts_at, booked.ends_at)}.`,
      )
      setSelectedSlotId(null)
      await loadData()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Booking could not be completed.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleCancel(appointmentId: number) {
    setSubmitting(true)
    setError(null)
    setSuccess(null)
    try {
      await cancelAppointment(appointmentId)
      setSuccess('Your appointment was canceled.')
      if (rescheduleId === appointmentId) {
        setRescheduleId(null)
        setRescheduleSlotId(null)
      }
      await loadData()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to cancel this appointment.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleReschedule(event: FormEvent) {
    event.preventDefault()
    if (!rescheduleId || !rescheduleSlotId) {
      setError('Choose a new time to reschedule.')
      return
    }

    setSubmitting(true)
    setError(null)
    setSuccess(null)
    try {
      const updated = await rescheduleAppointment(rescheduleId, rescheduleSlotId)
      setSuccess(
        `Rescheduled to ${formatAppointmentRange(updated.starts_at, updated.ends_at)}.`,
      )
      setRescheduleId(null)
      setRescheduleSlotId(null)
      await loadData()
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Unable to reschedule. Your original appointment was kept.',
      )
      await loadData()
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
          <h1>Meet with an Advisor</h1>
          <p className="appointments-page__lead">Find a time that works for you.</p>
          <Link className="appointments-page__back" to="/student/dashboard">
            Back to dashboard
          </Link>
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
            <section className="appointments-panel" aria-labelledby="available-slots-heading">
              <h2 id="available-slots-heading">Available appointments</h2>
              <p className="appointments-panel__intro">
                30-minute meetings with {slots[0]?.advisor_name ?? 'your advisor'}.
              </p>

              {slots.length === 0 ? (
                <p className="appointments-status">No open times right now. Check back soon.</p>
              ) : (
                <ul className="slot-list">
                  {slots.map((slot) => (
                    <li key={slot.id}>
                      <button
                        type="button"
                        className={[
                          'slot-option',
                          selectedSlotId === slot.id ? 'is-selected' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        aria-pressed={selectedSlotId === slot.id}
                        onClick={() => setSelectedSlotId(slot.id)}
                      >
                        <span className="slot-option__title">
                          {formatAppointmentRange(slot.starts_at, slot.ends_at)}
                        </span>
                        <span className="slot-option__meta">{slot.advisor_name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <form className="booking-form" onSubmit={handleBook}>
                <h3>Booking details</h3>
                <p className="booking-summary">
                  {selectedSlot
                    ? `Selected: ${formatAppointmentRange(selectedSlot.starts_at, selectedSlot.ends_at)}`
                    : 'Select a time above to continue.'}
                </p>
                <label>
                  Reason for meeting
                  <select
                    value={reason}
                    onChange={(event) => setReason(event.target.value as AppointmentReason)}
                  >
                    {APPOINTMENT_REASON_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <Button type="submit" variant="primary" disabled={submitting || !selectedSlotId}>
                  {submitting ? 'Booking…' : 'Confirm appointment'}
                </Button>
              </form>
            </section>

            <section className="appointments-panel" aria-labelledby="upcoming-heading">
              <h2 id="upcoming-heading">Upcoming appointments</h2>
              {appointments.length === 0 ? (
                <p className="appointments-status">You have no upcoming appointments.</p>
              ) : (
                <ul className="appointment-list">
                  {appointments.map((appointment) => (
                    <li key={appointment.id} className="appointment-item">
                      <div className="appointment-item__title">
                        {formatAppointmentRange(appointment.starts_at, appointment.ends_at)}
                      </div>
                      <div className="appointment-item__meta">
                        {appointment.advisor_name} · {reasonLabel(appointment.reason)}
                      </div>
                      <div className="appointment-item__actions">
                        <Button
                          type="button"
                          variant="ghost"
                          disabled={submitting}
                          onClick={() => {
                            setRescheduleId(appointment.id)
                            setRescheduleSlotId(null)
                            setSuccess(null)
                            setError(null)
                          }}
                        >
                          Reschedule
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          disabled={submitting}
                          onClick={() => void handleCancel(appointment.id)}
                        >
                          Cancel
                        </Button>
                      </div>

                      {rescheduleId === appointment.id ? (
                        <form className="booking-form" onSubmit={handleReschedule}>
                          <label>
                            New time
                            <select
                              value={rescheduleSlotId ?? ''}
                              onChange={(event) =>
                                setRescheduleSlotId(
                                  event.target.value ? Number(event.target.value) : null,
                                )
                              }
                            >
                              <option value="">Select an open slot</option>
                              {slots.map((slot) => (
                                <option key={slot.id} value={slot.id}>
                                  {formatAppointmentRange(slot.starts_at, slot.ends_at)}
                                </option>
                              ))}
                            </select>
                          </label>
                          <div className="appointment-item__actions">
                            <Button type="submit" variant="primary" disabled={submitting}>
                              Save new time
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => {
                                setRescheduleId(null)
                                setRescheduleSlotId(null)
                              }}
                            >
                              Never mind
                            </Button>
                          </div>
                        </form>
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
