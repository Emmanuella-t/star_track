from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas.appointments import (
    AppointmentOut,
    AvailabilitySlotOut,
    BookAppointmentRequest,
    CreateAvailabilityRequest,
    DemoIdentitiesOut,
    MessageOut,
    RescheduleAppointmentRequest,
)
from app.services import appointments as appointment_service
from app.services.appointments import AppointmentError

router = APIRouter(prefix="/api", tags=["appointments"])


def get_db_session() -> Session:
    raise RuntimeError("Database session dependency was not configured.")


def _raise_service_error(exc: AppointmentError) -> None:
    raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


@router.get("/demo/identities", response_model=DemoIdentitiesOut)
def demo_identities(session: Session = Depends(get_db_session)) -> DemoIdentitiesOut:
    try:
        return appointment_service.get_demo_identities(session)
    except AppointmentError as exc:
        _raise_service_error(exc)


@router.get("/slots/available", response_model=list[AvailabilitySlotOut])
def available_slots(session: Session = Depends(get_db_session)) -> list[AvailabilitySlotOut]:
    try:
        return appointment_service.list_available_slots(session)
    except AppointmentError as exc:
        _raise_service_error(exc)


@router.get("/advisor/slots", response_model=list[AvailabilitySlotOut])
def advisor_slots(session: Session = Depends(get_db_session)) -> list[AvailabilitySlotOut]:
    try:
        return appointment_service.list_advisor_slots(session)
    except AppointmentError as exc:
        _raise_service_error(exc)


@router.post("/advisor/slots", response_model=AvailabilitySlotOut, status_code=201)
def create_advisor_slot(
    body: CreateAvailabilityRequest,
    session: Session = Depends(get_db_session),
) -> AvailabilitySlotOut:
    try:
        return appointment_service.create_availability(session, body.starts_at)
    except AppointmentError as exc:
        session.rollback()
        _raise_service_error(exc)


@router.delete("/advisor/slots/{slot_id}", response_model=MessageOut)
def delete_advisor_slot(
    slot_id: int,
    session: Session = Depends(get_db_session),
) -> MessageOut:
    try:
        appointment_service.remove_availability(session, slot_id)
        return MessageOut(detail="Availability slot closed.")
    except AppointmentError as exc:
        session.rollback()
        _raise_service_error(exc)


@router.get("/advisor/appointments", response_model=list[AppointmentOut])
def advisor_appointments(session: Session = Depends(get_db_session)) -> list[AppointmentOut]:
    try:
        return appointment_service.list_advisor_appointments(session)
    except AppointmentError as exc:
        _raise_service_error(exc)


@router.get("/student/appointments", response_model=list[AppointmentOut])
def student_appointments(session: Session = Depends(get_db_session)) -> list[AppointmentOut]:
    try:
        return appointment_service.list_student_appointments(session)
    except AppointmentError as exc:
        _raise_service_error(exc)


@router.post("/student/appointments", response_model=AppointmentOut, status_code=201)
def book_student_appointment(
    body: BookAppointmentRequest,
    session: Session = Depends(get_db_session),
) -> AppointmentOut:
    try:
        return appointment_service.book_appointment(session, body.slot_id, body.reason)
    except AppointmentError as exc:
        session.rollback()
        _raise_service_error(exc)


@router.delete("/student/appointments/{appointment_id}", response_model=MessageOut)
def cancel_student_appointment(
    appointment_id: int,
    session: Session = Depends(get_db_session),
) -> MessageOut:
    try:
        appointment_service.cancel_appointment(session, appointment_id)
        return MessageOut(detail="Appointment canceled.")
    except AppointmentError as exc:
        session.rollback()
        _raise_service_error(exc)


@router.patch("/student/appointments/{appointment_id}", response_model=AppointmentOut)
def reschedule_student_appointment(
    appointment_id: int,
    body: RescheduleAppointmentRequest,
    session: Session = Depends(get_db_session),
) -> AppointmentOut:
    try:
        return appointment_service.reschedule_appointment(
            session,
            appointment_id,
            body.new_slot_id,
            body.reason,
        )
    except AppointmentError as exc:
        session.rollback()
        _raise_service_error(exc)
