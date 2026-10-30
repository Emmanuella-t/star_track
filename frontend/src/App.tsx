import { useEffect, useState } from 'react'

const api = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export default function App() {
  const [status, setStatus] = useState('Checking connection...')
  useEffect(() => {
    fetch(`${api}/health`)
      .then(r => { if (!r.ok) throw new Error('API not ready'); return r.json() })
      .then(data => setStatus(data.status === 'ok' ? 'Backend connected' : 'Backend not ready'))
      .catch(() => setStatus('Backend not connected. Start FastAPI on port 8000.'))
  }, [])
  return <main>
    <div className="eyebrow">GROUP 3 · SOFTWARE ENGINEERING</div>
    <h1>Star Track<span className="star">✦</span></h1>
    <p className="lead">A clearer path to academic advising.</p>
    <div className="status" role="status">{status}</div>
    <section aria-label="Planned features" className="cards">
      <article><h2>AI Advising</h2><p>Catalog-grounded answers with citations.</p><small>Planned</small></article>
      <article><h2>Degree Progress</h2><p>Track courses and remaining requirements.</p><small>Planned</small></article>
      <article><h2>Advisor Appointments</h2><p>Request time with an academic advisor.</p><small>Planned</small></article>
    </section>
    <p className="note">Development scaffold only. Not an official university advising service.</p>
  </main>
}
