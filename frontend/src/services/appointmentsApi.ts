import { apiRequest } from '../lib/api'
import type { Appointment, AppointmentReason, AvailabilitySlot } from '../types/appointments'

export function fetchAvailableSlots(signal?: AbortSignal) {
  return apiRequest<AvailabilitySlot[]>('/api/slots/available', { signal })
}

export function fetchStudentAppointments(signal?: AbortSignal) {
  return apiRequest<Appointment[]>('/api/student/appointments', { signal })
}

export function bookAppointment(slotId: number, reason: AppointmentReason) {
  return apiRequest<Appointment>('/api/student/appointments', {
    method: 'POST',
    body: { slot_id: slotId, reason },
  })
}

export function cancelAppointment(appointmentId: number) {
  return apiRequest<{ detail: string }>(`/api/student/appointments/${appointmentId}`, {
    method: 'DELETE',
  })
}

export function rescheduleAppointment(
  appointmentId: number,
  newSlotId: number,
  reason?: AppointmentReason,
) {
  return apiRequest<Appointment>(`/api/student/appointments/${appointmentId}`, {
    method: 'PATCH',
    body: {
      new_slot_id: newSlotId,
      ...(reason ? { reason } : {}),
    },
  })
}

export function fetchAdvisorSlots(signal?: AbortSignal) {
  return apiRequest<AvailabilitySlot[]>('/api/advisor/slots', { signal })
}

export function fetchAdvisorAppointments(signal?: AbortSignal) {
  return apiRequest<Appointment[]>('/api/advisor/appointments', { signal })
}

export function createAdvisorSlot(startsAtIso: string) {
  return apiRequest<AvailabilitySlot>('/api/advisor/slots', {
    method: 'POST',
    body: { starts_at: startsAtIso },
  })
}

export function removeAdvisorSlot(slotId: number) {
  return apiRequest<{ detail: string }>(`/api/advisor/slots/${slotId}`, {
    method: 'DELETE',
  })
}
