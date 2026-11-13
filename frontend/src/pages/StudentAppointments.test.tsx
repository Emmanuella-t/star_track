import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderApp } from '../test/renderWithRouter'
import type { Appointment, AvailabilitySlot } from '../types/appointments'

const slotA: AvailabilitySlot = {
  id: 11,
  advisor_id: 2,
  advisor_name: 'Dr. Avery Brooks',
  starts_at: '2030-03-12T15:00:00Z',
  ends_at: '2030-03-12T15:30:00Z',
  duration_minutes: 30,
  status: 'open',
  availability: 'available',
}

const slotB: AvailabilitySlot = {
  id: 12,
  advisor_id: 2,
  advisor_name: 'Dr. Avery Brooks',
  starts_at: '2030-03-13T16:00:00Z',
  ends_at: '2030-03-13T16:30:00Z',
  duration_minutes: 30,
  status: 'open',
  availability: 'available',
}

const booked: Appointment = {
  id: 101,
  slot_id: 11,
  student_id: 1,
  student_name: 'Jordan Lee',
  advisor_id: 2,
  advisor_name: 'Dr. Avery Brooks',
  starts_at: slotA.starts_at,
  ends_at: slotA.ends_at,
  duration_minutes: 30,
  reason: 'course_planning',
  status: 'booked',
  created_at: '2030-03-01T12:00:00Z',
  updated_at: '2030-03-01T12:00:00Z',
}

function mockJson(data: unknown, ok = true, status = 200): Response {
  return {
    ok,
    status,
    json: async () => data,
  } as Response
}

describe('Student appointments', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders available slots and books an appointment', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.mocked(fetch)

    fetchMock
      .mockResolvedValueOnce(mockJson([slotA, slotB]))
      .mockResolvedValueOnce(mockJson([]))
      .mockResolvedValueOnce(mockJson(booked, true, 201))
      .mockResolvedValueOnce(mockJson([slotB]))
      .mockResolvedValueOnce(mockJson([booked]))

    renderApp('/student/appointments')

    expect(await screen.findByRole('heading', { name: 'Meet with an Advisor' })).toBeInTheDocument()
    expect(screen.getByText(/Find a time that works for you/i)).toBeInTheDocument()

    const slotButtons = await screen.findAllByRole('button', { name: /Dr\. Avery Brooks/i })
    await user.click(slotButtons[0])

    await user.selectOptions(screen.getByLabelText(/Reason for meeting/i), 'degree_progress')
    await user.click(screen.getByRole('button', { name: 'Confirm appointment' }))

    await waitFor(() => {
      expect(screen.getByText(/You're booked with Dr\. Avery Brooks/i)).toBeInTheDocument()
    })

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/student/appointments'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ slot_id: 11, reason: 'degree_progress' }),
      }),
    )

    const upcoming = screen.getByRole('heading', { name: 'Upcoming appointments' }).closest('section')
    expect(upcoming).not.toBeNull()
    expect(within(upcoming as HTMLElement).getByText(/Course planning/i)).toBeInTheDocument()
  })

  it('cancels an upcoming appointment', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.mocked(fetch)

    fetchMock
      .mockResolvedValueOnce(mockJson([slotB]))
      .mockResolvedValueOnce(mockJson([booked]))
      .mockResolvedValueOnce(mockJson({ detail: 'Appointment canceled.' }))
      .mockResolvedValueOnce(mockJson([slotA, slotB]))
      .mockResolvedValueOnce(mockJson([]))

    renderApp('/student/appointments')

    const cancelButton = await screen.findByRole('button', { name: 'Cancel' })
    await user.click(cancelButton)

    await waitFor(() => {
      expect(screen.getByText(/Your appointment was canceled/i)).toBeInTheDocument()
    })
    expect(screen.getByText(/You have no upcoming appointments/i)).toBeInTheDocument()
  })

  it('reschedules an upcoming appointment', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.mocked(fetch)
    const rescheduled: Appointment = {
      ...booked,
      slot_id: 12,
      starts_at: slotB.starts_at,
      ends_at: slotB.ends_at,
      updated_at: '2030-03-02T12:00:00Z',
    }

    fetchMock
      .mockResolvedValueOnce(mockJson([slotB]))
      .mockResolvedValueOnce(mockJson([booked]))
      .mockResolvedValueOnce(mockJson(rescheduled))
      .mockResolvedValueOnce(mockJson([]))
      .mockResolvedValueOnce(mockJson([rescheduled]))

    renderApp('/student/appointments')

    await user.click(await screen.findByRole('button', { name: 'Reschedule' }))
    await user.selectOptions(screen.getByLabelText(/New time/i), String(slotB.id))
    await user.click(screen.getByRole('button', { name: 'Save new time' }))

    await waitFor(() => {
      expect(screen.getByText(/Rescheduled to/i)).toBeInTheDocument()
    })
  })

  it('shows an API error state', async () => {
    vi.mocked(fetch).mockResolvedValue(mockJson({ detail: 'Backend offline' }, false, 503))

    renderApp('/student/appointments')

    expect(await screen.findByRole('alert')).toHaveTextContent(/Backend offline/i)
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
  })
})
