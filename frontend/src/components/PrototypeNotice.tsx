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
        Star Track uses example course information and fictional appointment records for classroom
        demonstration. It is not connected to official university academic records, transcripts,
        degree audits, or campus scheduling systems.
      </p>
      <p>
        Confirm degree requirements and advising plans with your academic advisor before making
        registration decisions.
      </p>
      <p>
        Choosing Student or Advisor in Star Track is a simple way to explore the app. It is not
        authentication or verified campus identity.
      </p>
    </aside>
  )
}
