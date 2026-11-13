import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from './test/renderWithRouter'

describe('Star Track Phase 1 navigation', () => {
  it('renders the landing page with official logo and hero copy', () => {
    renderApp('/')

    const logos = screen.getAllByRole('img', { name: 'Star Track' })
    expect(logos.length).toBeGreaterThan(0)
    expect(logos[0]).toHaveAttribute('src', '/assets/brand/logo-horizontal-reversed.svg')

    expect(
      screen.getByRole('heading', {
        name: /College is complicated\.\s*Planning your classes shouldn't be\./i,
      }),
    ).toBeInTheDocument()

    const getStartedLinks = screen.getAllByRole('link', { name: 'Get Started' })
    expect(getStartedLinks.length).toBeGreaterThan(0)
    expect(getStartedLinks[0]).toHaveAttribute('href', '/demo')
    expect(screen.queryByText('✦')).not.toBeInTheDocument()
    expect(screen.queryByText(/Backend (connected|offline)|Checking API/i)).not.toBeInTheDocument()
  })

  it('navigates from Get Started to the demo role page', async () => {
    const user = userEvent.setup()
    renderApp('/')

    await user.click(screen.getAllByRole('link', { name: 'Get Started' })[0])

    expect(
      screen.getByRole('heading', { name: /Choose how you want to explore Star Track/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Continue as Student' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Continue as Advisor' })).toBeInTheDocument()
  })

  it('opens the student dashboard placeholder from demo role selection', async () => {
    const user = userEvent.setup()
    renderApp('/demo')

    await user.click(screen.getByRole('link', { name: 'Continue as Student' }))

    expect(screen.getByRole('heading', { name: 'Student dashboard' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Open degree progress' })).toHaveAttribute(
      'href',
      '/student/progress',
    )
    expect(screen.getAllByText(/Coming soon/i).length).toBeGreaterThanOrEqual(2)
  })

  it('opens the advisor dashboard from role selection', async () => {
    const user = userEvent.setup()
    renderApp('/demo')

    await user.click(screen.getByRole('link', { name: 'Continue as Advisor' }))

    expect(screen.getByRole('heading', { name: 'Advisor dashboard' })).toBeInTheDocument()
    expect(screen.getByText(/Manage your availability/i)).toBeInTheDocument()
  })
})

