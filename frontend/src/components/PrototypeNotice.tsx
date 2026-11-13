import './PrototypeNotice.css'

type PrototypeNoticeProps = {
  className?: string
}

export function PrototypeNotice({ className }: PrototypeNoticeProps) {
  return (
    <aside
      className={['prototype-notice', className].filter(Boolean).join(' ')}
      aria-label="Prototype information"
    >
      <h2 className="prototype-notice__title">Prototype information</h2>
      <p>
        Star Track currently uses example course information for demonstration. It is not connected
        to official university academic records, transcripts, or degree audits.
      </p>
      <p>
        Verify degree requirements with your academic advisor before making registration decisions.
      </p>
    </aside>
  )
}
