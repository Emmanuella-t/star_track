const DISPLAY_TIME_ZONE = 'America/Chicago'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: DISPLAY_TIME_ZONE,
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: DISPLAY_TIME_ZONE,
  hour: 'numeric',
  minute: '2-digit',
})

const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: DISPLAY_TIME_ZONE,
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

export function formatAppointmentDate(iso: string): string {
  return dateFormatter.format(new Date(iso))
}

export function formatAppointmentTime(iso: string): string {
  return timeFormatter.format(new Date(iso))
}

export function formatAppointmentRange(startsAt: string, endsAt: string): string {
  return `${formatAppointmentDate(startsAt)} · ${formatAppointmentTime(startsAt)} – ${formatAppointmentTime(endsAt)} CT`
}

export function formatAppointmentDateTime(iso: string): string {
  return `${dateTimeFormatter.format(new Date(iso))} CT`
}

function chicagoOffsetMinutes(at: Date): number {
  const label =
    new Intl.DateTimeFormat('en-US', {
      timeZone: DISPLAY_TIME_ZONE,
      timeZoneName: 'longOffset',
      hour: 'numeric',
    })
      .formatToParts(at)
      .find((part) => part.type === 'timeZoneName')?.value ?? 'GMT'

  const match = label.match(/GMT([+-])(\d+)(?::(\d+))?/)
  if (!match) return 0
  const sign = match[1] === '-' ? -1 : 1
  return sign * (Number(match[2]) * 60 + Number(match[3] ?? 0))
}

/** Convert a Chicago wall-clock date/time into a UTC ISO string. */
export function chicagoLocalToUtcIso(date: string, time: string): string {
  const [year, month, day] = date.split('-').map(Number)
  const [hour, minute] = time.split(':').map(Number)
  const asUtcMs = Date.UTC(year, month - 1, day, hour, minute, 0)

  let offset = chicagoOffsetMinutes(new Date(asUtcMs))
  let utcMs = asUtcMs - offset * 60_000
  offset = chicagoOffsetMinutes(new Date(utcMs))
  utcMs = asUtcMs - offset * 60_000
  return new Date(utcMs).toISOString()
}
