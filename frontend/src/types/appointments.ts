export type AppointmentReason =
  | 'course_planning'
  | 'degree_progress'
  | 'academic_concerns'
  | 'other'

export type AppointmentStatus = 'booked' | 'canceled'
export type SlotAvailability = 'available' | 'booked' | 'closed' | 'past'

export type AvailabilitySlot = {
  id: number
  advisor_id: number
  advisor_name: string
  starts_at: string
  ends_at: string
  duration_minutes: number
  status: 'open' | 'closed'
  availability: SlotAvailability
}

export type Appointment = {
  id: number
  slot_id: number
  student_id: number
  student_name: string
  advisor_id: number
  advisor_name: string
  starts_at: string
  ends_at: string
  duration_minutes: number
  reason: AppointmentReason
  status: AppointmentStatus
  created_at: string
  updated_at: string
}

export const APPOINTMENT_REASON_OPTIONS: { value: AppointmentReason; label: string }[] = [
  { value: 'course_planning', label: 'Course planning' },
  { value: 'degree_progress', label: 'Degree progress' },
  { value: 'academic_concerns', label: 'Academic concerns' },
  { value: 'other', label: 'Other' },
]

export function reasonLabel(reason: AppointmentReason): string {
  return APPOINTMENT_REASON_OPTIONS.find((option) => option.value === reason)?.label ?? 'Other'
}
