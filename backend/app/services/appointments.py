from __future__ import annotations

from datetime import datetime, timedelta, timezone

from sqlalchemy import Select, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload

from app.core.config import (
    APPOINTMENT_DURATION_MINUTES,
    DEMO_ADVISOR_KEY,
    DEMO_STUDENT_KEY,
)
from app.models.entities import Appointment, AvailabilitySlot, DemoUser
from app.schemas.appointments import (
    AppointmentOut,
    AvailabilitySlotOut,
    DemoIdentitiesOut,
    DemoIdentityOut,
)


class AppointmentError(Exception):
    def __init__(self, status_code: int, detail: str) -> None:
        self.status_code = status_code
        self.detail = detail
        super().__init__(detail)


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def ensure_utc(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc)


def get_demo_student(session: Session) -> DemoUser:
    student = session.scalar(select(DemoUser).where(DemoUser.demo_key == DEMO_STUDENT_KEY))
    if student is None:
        raise AppointmentError(500, "Demo student is not seeded.")
    return student


def get_demo_advisor(session: Session) -> DemoUser:
    advisor = session.scalar(select(DemoUser).where(DemoUser.demo_key == DEMO_ADVISOR_KEY))
    if advisor is None:
        raise AppointmentError(500, "Demo advisor is not seeded.")
    return advisor


def get_demo_identities(session: Session) -> DemoIdentitiesOut:
    student = get_demo_student(session)
    advisor = get_demo_advisor(session)
    return DemoIdentitiesOut(
        student=DemoIdentityOut(
            id=student.id,
            demo_key=student.demo_key,
            display_name=student.display_name,
            role="student",
        ),
        advisor=DemoIdentityOut(
            id=advisor.id,
            demo_key=advisor.demo_key,
            display_name=advisor.display_name,
            role="advisor",
        ),
        note=(
            "Demo role selection is navigation only. It is not authentication, "
            "SSO, or verified campus identity."
        ),
    )


def _active_booking_for_slot(session: Session, slot_id: int) -> Appointment | None:
    return session.scalar(
        select(Appointment).where(
            Appointment.slot_id == slot_id,
            Appointment.status == "booked",
        )
    )


def _slot_availability(session: Session, slot: AvailabilitySlot) -> str:
    now = utc_now()
    starts_at = ensure_utc(slot.starts_at)
    if slot.status == "closed":
        return "closed"
    if starts_at <= now:
        return "past"
    if _active_booking_for_slot(session, slot.id) is not None:
        return "booked"
    return "available"


def serialize_slot(session: Session, slot: AvailabilitySlot) -> AvailabilitySlotOut:
    advisor = slot.advisor
    return AvailabilitySlotOut(
        id=slot.id,
        advisor_id=slot.advisor_id,
        advisor_name=advisor.display_name,
        starts_at=ensure_utc(slot.starts_at),
        ends_at=ensure_utc(slot.ends_at),
        duration_minutes=APPOINTMENT_DURATION_MINUTES,
        status=slot.status,  # type: ignore[arg-type]
        availability=_slot_availability(session, slot),  # type: ignore[arg-type]
    )


def serialize_appointment(appointment: Appointment) -> AppointmentOut:
    slot = appointment.slot
    return AppointmentOut(
        id=appointment.id,
        slot_id=appointment.slot_id,
        student_id=appointment.student_id,
        student_name=appointment.student.display_name,
        advisor_id=slot.advisor_id,
        advisor_name=slot.advisor.display_name,
        starts_at=ensure_utc(slot.starts_at),
        ends_at=ensure_utc(slot.ends_at),
        duration_minutes=APPOINTMENT_DURATION_MINUTES,
        reason=appointment.reason,  # type: ignore[arg-type]
        status=appointment.status,  # type: ignore[arg-type]
        created_at=ensure_utc(appointment.created_at),
        updated_at=ensure_utc(appointment.updated_at),
    )


def _slots_overlap(a_start: datetime, a_end: datetime, b_start: datetime, b_end: datetime) -> bool:
    return a_start < b_end and a_end > b_start


def list_available_slots(session: Session) -> list[AvailabilitySlotOut]:
    advisor = get_demo_advisor(session)
    now = utc_now()
    slots = (
        session.scalars(
            select(AvailabilitySlot)
            .options(joinedload(AvailabilitySlot.advisor))
            .where(
                AvailabilitySlot.advisor_id == advisor.id,
                AvailabilitySlot.status == "open",
                AvailabilitySlot.starts_at > now,
            )
            .order_by(AvailabilitySlot.starts_at.asc())
        )
        .unique()
        .all()
    )

    available: list[AvailabilitySlotOut] = []
    for slot in slots:
        if _active_booking_for_slot(session, slot.id) is None:
            available.append(serialize_slot(session, slot))
    return available


def list_advisor_slots(session: Session) -> list[AvailabilitySlotOut]:
    advisor = get_demo_advisor(session)
    slots = (
        session.scalars(
            select(AvailabilitySlot)
            .options(joinedload(AvailabilitySlot.advisor))
            .where(AvailabilitySlot.advisor_id == advisor.id)
            .order_by(AvailabilitySlot.starts_at.asc())
        )
        .unique()
        .all()
    )
    return [serialize_slot(session, slot) for slot in slots]


def create_availability(session: Session, starts_at: datetime) -> AvailabilitySlotOut:
    advisor = get_demo_advisor(session)
    start = ensure_utc(starts_at)
    end = start + timedelta(minutes=APPOINTMENT_DURATION_MINUTES)
    now = utc_now()

    if end <= start:
        raise AppointmentError(422, "Appointment end time must be after the start time.")
    if start <= now:
        raise AppointmentError(422, "Availability must be scheduled in the future.")

    existing = session.scalars(
        select(AvailabilitySlot).where(
            AvailabilitySlot.advisor_id == advisor.id,
            AvailabilitySlot.status == "open",
        )
    ).all()
    for slot in existing:
        if _slots_overlap(start, end, ensure_utc(slot.starts_at), ensure_utc(slot.ends_at)):
            raise AppointmentError(409, "This time overlaps an existing availability slot.")

    slot = AvailabilitySlot(
        advisor_id=advisor.id,
        starts_at=start,
        ends_at=end,
        status="open",
    )
    session.add(slot)
    try:
        session.commit()
    except IntegrityError as exc:
        session.rollback()
        raise AppointmentError(409, "An availability slot already exists at this start time.") from exc

    loaded = session.scalar(
        select(AvailabilitySlot)
        .options(joinedload(AvailabilitySlot.advisor))
        .where(AvailabilitySlot.id == slot.id)
    )
    assert loaded is not None
    return serialize_slot(session, loaded)


def remove_availability(session: Session, slot_id: int) -> None:
    advisor = get_demo_advisor(session)
    slot = session.get(AvailabilitySlot, slot_id)
    if slot is None or slot.advisor_id != advisor.id:
        raise AppointmentError(404, "Availability slot not found.")
    if _active_booking_for_slot(session, slot.id) is not None:
        raise AppointmentError(409, "A booked slot cannot be removed. Cancel the appointment first.")

    slot.status = "closed"
    session.commit()


def _appointment_query() -> Select[tuple[Appointment]]:
    return select(Appointment).options(
        joinedload(Appointment.student),
        joinedload(Appointment.slot).joinedload(AvailabilitySlot.advisor),
    )


def list_student_appointments(session: Session) -> list[AppointmentOut]:
    student = get_demo_student(session)
    appointments = (
        session.scalars(
            _appointment_query().where(
                Appointment.student_id == student.id,
                Appointment.status == "booked",
            )
        )
        .unique()
        .all()
    )
    appointments = sorted(appointments, key=lambda item: ensure_utc(item.slot.starts_at))
    return [serialize_appointment(item) for item in appointments]


def list_advisor_appointments(session: Session) -> list[AppointmentOut]:
    advisor = get_demo_advisor(session)
    appointments = (
        session.scalars(
            _appointment_query()
            .join(AvailabilitySlot, Appointment.slot_id == AvailabilitySlot.id)
            .where(
                AvailabilitySlot.advisor_id == advisor.id,
                Appointment.status == "booked",
            )
        )
        .unique()
        .all()
    )
    appointments = sorted(appointments, key=lambda item: ensure_utc(item.slot.starts_at))
    return [serialize_appointment(item) for item in appointments]


def book_appointment(session: Session, slot_id: int, reason: str) -> AppointmentOut:
    student = get_demo_student(session)
    now = utc_now()

    slot = session.scalar(
        select(AvailabilitySlot)
        .options(joinedload(AvailabilitySlot.advisor))
        .where(AvailabilitySlot.id == slot_id)
    )
    if slot is None or slot.status != "open":
        raise AppointmentError(404, "That appointment slot is not available.")
    if ensure_utc(slot.starts_at) <= now:
        raise AppointmentError(422, "Past appointment slots cannot be booked.")
    if _active_booking_for_slot(session, slot.id) is not None:
        raise AppointmentError(409, "This appointment slot is already booked.")

    appointment = Appointment(
        slot_id=slot.id,
        student_id=student.id,
        reason=reason,
        status="booked",
        created_at=now,
        updated_at=now,
    )
    session.add(appointment)
    try:
        session.commit()
    except IntegrityError as exc:
        session.rollback()
        raise AppointmentError(409, "This appointment slot is already booked.") from exc

    booked = session.scalar(_appointment_query().where(Appointment.id == appointment.id))
    assert booked is not None
    return serialize_appointment(booked)


def cancel_appointment(session: Session, appointment_id: int) -> None:
    student = get_demo_student(session)
    appointment = session.get(Appointment, appointment_id)
    if appointment is None or appointment.student_id != student.id:
        raise AppointmentError(404, "Appointment not found.")
    if appointment.status != "booked":
        raise AppointmentError(409, "This appointment is already canceled.")

    appointment.status = "canceled"
    appointment.updated_at = utc_now()
    session.commit()


def reschedule_appointment(
    session: Session,
    appointment_id: int,
    new_slot_id: int,
    reason: str | None = None,
) -> AppointmentOut:
    student = get_demo_student(session)
    now = utc_now()

    appointment = session.scalar(_appointment_query().where(Appointment.id == appointment_id))
    if appointment is None or appointment.student_id != student.id:
        raise AppointmentError(404, "Appointment not found.")
    if appointment.status != "booked":
        raise AppointmentError(409, "Only booked appointments can be rescheduled.")
    if appointment.slot_id == new_slot_id:
        raise AppointmentError(422, "Choose a different time to reschedule.")

    original_slot_id = appointment.slot_id
    original_reason = appointment.reason

    new_slot = session.scalar(
        select(AvailabilitySlot)
        .options(joinedload(AvailabilitySlot.advisor))
        .where(AvailabilitySlot.id == new_slot_id)
    )
    if new_slot is None or new_slot.status != "open":
        raise AppointmentError(409, "The requested replacement slot is not available.")
    if ensure_utc(new_slot.starts_at) <= now:
        raise AppointmentError(422, "Past appointment slots cannot be booked.")
    if _active_booking_for_slot(session, new_slot.id) is not None:
        raise AppointmentError(
            409,
            "The requested replacement slot is already booked. Your original appointment was kept.",
        )

    appointment.slot_id = new_slot.id
    if reason is not None:
        appointment.reason = reason
    appointment.updated_at = now

    try:
        session.commit()
    except IntegrityError as exc:
        session.rollback()
        restored = session.get(Appointment, appointment_id)
        if restored is not None:
            restored.slot_id = original_slot_id
            restored.reason = original_reason
            restored.status = "booked"
            restored.updated_at = now
            session.commit()
        raise AppointmentError(
            409,
            "The requested replacement slot is already booked. Your original appointment was kept.",
        ) from exc

    updated = session.scalar(_appointment_query().where(Appointment.id == appointment_id))
    assert updated is not None
    return serialize_appointment(updated)
