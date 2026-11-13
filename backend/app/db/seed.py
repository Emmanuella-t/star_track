from __future__ import annotations

from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import (
    APPOINTMENT_DURATION_MINUTES,
    DEMO_ADVISOR_KEY,
    DEMO_ADVISOR_NAME,
    DEMO_STUDENT_KEY,
    DEMO_STUDENT_NAME,
    DISPLAY_TIMEZONE,
)
from app.models.entities import AvailabilitySlot, DemoUser

CHICAGO = ZoneInfo(DISPLAY_TIMEZONE)


def _next_weekday_at(hour: int, minute: int, days_ahead: int) -> datetime:
    """Return a future Chicago local time converted to UTC-aware datetime."""
    now_local = datetime.now(CHICAGO)
    target_local = (now_local + timedelta(days=days_ahead)).replace(
        hour=hour,
        minute=minute,
        second=0,
        microsecond=0,
    )
    if target_local <= now_local:
        target_local += timedelta(days=1)
    # Prefer weekdays for advising hours
    while target_local.weekday() >= 5:
        target_local += timedelta(days=1)
    return target_local.astimezone(ZoneInfo("UTC"))


def seed_demo_data(session: Session) -> None:
    """Idempotently seed one student, one advisor, and upcoming open slots."""
    student = session.scalar(select(DemoUser).where(DemoUser.demo_key == DEMO_STUDENT_KEY))
    if student is None:
        student = DemoUser(
            demo_key=DEMO_STUDENT_KEY,
            display_name=DEMO_STUDENT_NAME,
            role="student",
        )
        session.add(student)

    advisor = session.scalar(select(DemoUser).where(DemoUser.demo_key == DEMO_ADVISOR_KEY))
    if advisor is None:
        advisor = DemoUser(
            demo_key=DEMO_ADVISOR_KEY,
            display_name=DEMO_ADVISOR_NAME,
            role="advisor",
        )
        session.add(advisor)

    session.flush()

    def _normalize(value: datetime) -> datetime:
        if value.tzinfo is None:
            return value.replace(tzinfo=ZoneInfo("UTC"))
        return value.astimezone(ZoneInfo("UTC")).replace(microsecond=0)

    existing_starts = {
        _normalize(slot.starts_at)
        for slot in session.scalars(
            select(AvailabilitySlot).where(AvailabilitySlot.advisor_id == advisor.id)
        ).all()
    }

    seed_windows = [
        _next_weekday_at(10, 0, 2),
        _next_weekday_at(10, 30, 2),
        _next_weekday_at(14, 0, 3),
        _next_weekday_at(14, 30, 3),
        _next_weekday_at(11, 0, 5),
        _next_weekday_at(15, 0, 7),
    ]

    for starts_at in seed_windows:
        normalized = _normalize(starts_at)
        if normalized in existing_starts:
            continue
        ends_at = starts_at + timedelta(minutes=APPOINTMENT_DURATION_MINUTES)
        session.add(
            AvailabilitySlot(
                advisor_id=advisor.id,
                starts_at=starts_at,
                ends_at=ends_at,
                status="open",
            )
        )
        existing_starts.add(normalized)

    session.commit()
