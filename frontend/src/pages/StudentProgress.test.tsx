import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { SAMPLE_DEGREE_PLAN } from '../data/sampleDegreePlan'
import { PROGRESS_STORAGE_KEY } from '../lib/progressStorage'
import { renderApp } from '../test/renderWithRouter'

describe('Student degree progress', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows the degree plan courses and calm guidance', () => {
    renderApp('/student/progress')

    expect(
      screen.getByRole('heading', { name: SAMPLE_DEGREE_PLAN.name }),
    ).toBeInTheDocument()
    expect(screen.getByText('Degree Requirements')).toBeInTheDocument()
    expect(screen.queryByText('Sample data')).not.toBeInTheDocument()
    expect(screen.queryByText('Self-reported')).not.toBeInTheDocument()
    expect(
      screen.getByText(/Progress is based on the courses you mark complete/i),
    ).toBeInTheDocument()
    expect(screen.getByText(/Prototype information/i)).toBeInTheDocument()
    expect(screen.getByText(/not connected to official university academic records/i)).toBeInTheDocument()

    expect(screen.getByRole('heading', { name: 'General Education' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Mathematics' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Computer Science Core' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Electives' })).toBeInTheDocument()

    expect(
      screen.getByRole('checkbox', { name: 'CSCI 120 Introduction to Computer Science' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/Nothing marked yet/i)).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /Overall progress 0 percent/i })).toBeInTheDocument()
  })

  it('toggles course completion and updates overall progress', async () => {
    const user = userEvent.setup()
    renderApp('/student/progress')

    const checkbox = screen.getByRole('checkbox', {
      name: 'CSCI 120 Introduction to Computer Science',
    })
    await user.click(checkbox)

    expect(checkbox).toBeChecked()
    expect(screen.getByText(/1 of 16 courses completed/i)).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /Overall progress 6 percent/i })).toBeInTheDocument()
  })

  it('persists selections in localStorage across remount', async () => {
    const user = userEvent.setup()
    const first = renderApp('/student/progress')

    await user.click(screen.getByRole('checkbox', { name: 'MATH 201 Calculus I' }))
    expect(localStorage.getItem(PROGRESS_STORAGE_KEY)).toContain('"math-201":true')

    first.unmount()
    renderApp('/student/progress')

    expect(screen.getByRole('checkbox', { name: 'MATH 201 Calculus I' })).toBeChecked()
    expect(screen.getByText(/1 of 16 courses completed/i)).toBeInTheDocument()
  })

  it('resets progress after confirmation', async () => {
    const user = userEvent.setup()
    renderApp('/student/progress')

    const checkbox = screen.getByRole('checkbox', { name: 'CSCI 230 Data Structures' })
    await user.click(checkbox)
    expect(checkbox).toBeChecked()

    await user.click(screen.getByRole('button', { name: 'Reset Progress' }))
    const confirm = screen.getByRole('group', { name: 'Confirm reset' })
    await user.click(within(confirm).getByRole('button', { name: 'Yes, reset' }))

    expect(screen.getByRole('checkbox', { name: 'CSCI 230 Data Structures' })).not.toBeChecked()
    expect(screen.getByText(/Nothing marked yet/i)).toBeInTheDocument()
    expect(localStorage.getItem(PROGRESS_STORAGE_KEY)).toContain('"csci-230":false')
  })

  it('navigates back to the student dashboard', async () => {
    const user = userEvent.setup()
    renderApp('/student/progress')

    await user.click(screen.getByRole('link', { name: 'Back to dashboard' }))
    expect(screen.getByRole('heading', { name: 'Student dashboard' })).toBeInTheDocument()
  })

  it('opens degree progress from the student dashboard', async () => {
    const user = userEvent.setup()
    renderApp('/student/dashboard')

    await user.click(screen.getByRole('link', { name: 'Open degree progress' }))
    expect(
      screen.getByRole('heading', { name: SAMPLE_DEGREE_PLAN.name }),
    ).toBeInTheDocument()
  })
})
