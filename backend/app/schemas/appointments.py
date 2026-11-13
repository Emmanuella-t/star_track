from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

AppointmentReason = Literal[
    "course_planning",
    "degree_progress",
    "academic_concerns",
    "other",
]

AppointmentStatus = Literal["booked", "canceled"]
SlotStatus = Literal["open", "closed"]
SlotAvailability = Literal["available", "booked", "closed", "past"]


class DemoIdentityOut(BaseModel):
    id: int
    demo_key: str
    display_name: str
    role: Literal["student", "advisor"]


class DemoIdentitiesOut(BaseModel):
    student: DemoIdentityOut
    advisor: DemoIdentityOut
    note: str


class AvailabilitySlotOut(BaseModel):
    id: int
    advisor_id: int
    advisor_name: str
    starts_at: datetime
    ends_at: datetime
    duration_minutes: int
    status: SlotStatus
    availability: SlotAvailability


class CreateAvailabilityRequest(BaseModel):
    starts_at: datetime = Field(..., description="Slot start time in ISO 8601 (UTC preferred).")


class BookAppointmentRequest(BaseModel):
    slot_id: int
    reason: AppointmentReason = "other"


class RescheduleAppointmentRequest(BaseModel):
    new_slot_id: int
    reason: AppointmentReason | None = None


class AppointmentOut(BaseModel):
    id: int
    slot_id: int
    student_id: int
    student_name: str
    advisor_id: int
    advisor_name: str
    starts_at: datetime
    ends_at: datetime
    duration_minutes: int
    reason: AppointmentReason
    status: AppointmentStatus
    created_at: datetime
    updated_at: datetime


class MessageOut(BaseModel):
    detail: str
