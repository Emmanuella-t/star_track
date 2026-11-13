import { fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderApp } from '../test/renderWithRouter'
import type { Appointment, AvailabilitySlot } from '../types/appointments'

const appointment: Appointment = {
  id: 201,
  slot_id: 21,
  student_id: 1,
  student_name: 'Jordan Lee',
  advisor_id: 2,
  advisor_name: 'Dr. Avery Brooks',
  starts_at: '2030-04-08T15:00:00Z',
  ends_at: '2030-04-08T15:30:00Z',
  duration_minutes: 30,
  reason: 'academic_concerns',
  status: 'booked',
  created_at: '2030-04-01T12:00:00Z',
  updated_at: '2030-04-01T12:00:00Z',
}

const openSlot: AvailabilitySlot = {
  id: 31,
  advisor_id: 2,
  advisor_name: 'Dr. Avery Brooks',
  starts_at: '2030-04-10T16:00:00Z',
  ends_at: '2030-04-10T16:30:00Z',
  duration_minutes: 30,
  status: 'open',
  availability: 'available',
}

function mockJson(data: unknown, ok = true, status = 200): Response {
  return {
    ok,
    status,
    json: async () => data,
  } as Response
}

describe('Advisor appointments and availability', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('lists upcoming advisor appointments', async () => {
    vi.mocked(fetch).mockResolvedValue(mockJson([appointment]))

    renderApp('/advisor/appointments')

    expect(await screen.findByRole('heading', { name: 'Your Appointments' })).toBeInTheDocument()
    expect(screen.getByText('Jordan Lee')).toBeInTheDocument()
    expect(screen.getByText(/Academic concerns/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Manage availability' })).toHaveAttribute(
      'href',
      '/advisor/availability',
    )
  })

  it('creates and closes availability slots', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.mocked(fetch)
    const created: AvailabilitySlot = {
      ...openSlot,
      id: 32,
      starts_at: '2030-05-01T15:00:00Z',
      ends_at: '2030-05-01T15:30:00Z',
    }

    fetchMock
      .mockResolvedValueOnce(mockJson([openSlot]))
      .mockResolvedValueOnce(mockJson(created, true, 201))
      .mockResolvedValueOnce(mockJson([openSlot, created]))
      .mockResolvedValueOnce(mockJson({ detail: 'Availability slot closed.' }))
      .mockResolvedValueOnce(
        mockJson([{ ...openSlot, availability: 'closed', status: 'closed' }, created]),
      )

    renderApp('/advisor/availability')

    expect(await screen.findByRole('heading', { name: 'Manage Availability' })).toBeInTheDocument()
    expect(screen.getByText('Available')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText(/^Date$/i), { target: { value: '2030-05-01' } })
    fireEvent.change(screen.getByLabelText(/Start time/i), { target: { value: '10:00' } })
    await user.click(screen.getByRole('button', { name: 'Add availability' }))

    await waitFor(() => {
      expect(screen.getByText(/Added/i)).toBeInTheDocument()
    })

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/advisor/slots'),
      expect.objectContaining({ method: 'POST' }),
    )

    await user.click(screen.getAllByRole('button', { name: 'Close slot' })[0])

    await waitFor(() => {
      expect(screen.getByText(/Availability slot closed/i)).toBeInTheDocument()
    })
  })

  it('shows availability API errors', async () => {
    vi.mocked(fetch).mockResolvedValue(mockJson({ detail: 'Unable to reach API' }, false, 500))

    renderApp('/advisor/availability')

    expect(await screen.findByRole('alert')).toHaveTextContent(/Unable to reach API/i)
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
  })
})
