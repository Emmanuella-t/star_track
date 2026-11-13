import { useEffect, useState } from 'react'
import './BackendStatus.css'

const api = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

type Status = 'checking' | 'connected' | 'offline'

type BackendStatusProps = {
  className?: string
  /** Show only during local development unless forced. */
  force?: boolean
}

export function BackendStatus({ className, force = false }: BackendStatusProps) {
  const [status, setStatus] = useState<Status>('checking')
  const visible = force || import.meta.env.DEV

  useEffect(() => {
    if (!visible) return

    let active = true

    fetch(`${api}/health`)
      .then((response) => {
        if (!response.ok) throw new Error('API not ready')
        return response.json()
      })
      .then((data) => {
        if (!active) return
        setStatus(data.status === 'ok' ? 'connected' : 'offline')
      })
      .catch(() => {
        if (active) setStatus('offline')
      })

    return () => {
      active = false
    }
  }, [visible])

  if (!visible) return null

  const label =
    status === 'checking'
      ? 'Checking API…'
      : status === 'connected'
        ? 'Backend connected'
        : 'Backend offline'

  return (
    <p
      className={['backend-status', `backend-status--${status}`, className]
        .filter(Boolean)
        .join(' ')}
      role="status"
      aria-live="polite"
    >
      <span className="backend-status__dot" aria-hidden="true" />
      {label}
    </p>
  )
}
