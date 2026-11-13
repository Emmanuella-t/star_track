from __future__ import annotations

from datetime import datetime

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    String,
    UniqueConstraint,
    text,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class DemoUser(Base):
    __tablename__ = "demo_users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    demo_key: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    display_name: Mapped[str] = mapped_column(String(120), nullable=False)
    role: Mapped[str] = mapped_column(String(32), nullable=False)

    __table_args__ = (
        CheckConstraint("role IN ('student', 'advisor')", name="ck_demo_users_role"),
    )

    slots: Mapped[list[AvailabilitySlot]] = relationship(back_populates="advisor")
    appointments: Mapped[list[Appointment]] = relationship(back_populates="student")


class AvailabilitySlot(Base):
    __tablename__ = "availability_slots"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    advisor_id: Mapped[int] = mapped_column(ForeignKey("demo_users.id"), nullable=False)
    starts_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    ends_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    status: Mapped[str] = mapped_column(String(32), nullable=False, default="open")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=text("(CURRENT_TIMESTAMP)"),
    )

    __table_args__ = (
        CheckConstraint("ends_at > starts_at", name="ck_slots_time_order"),
        CheckConstraint("status IN ('open', 'closed')", name="ck_slots_status"),
        UniqueConstraint("advisor_id", "starts_at", name="uq_advisor_slot_start"),
    )

    advisor: Mapped[DemoUser] = relationship(back_populates="slots")
    appointments: Mapped[list[Appointment]] = relationship(back_populates="slot")


class Appointment(Base):
    __tablename__ = "appointments"
    __table_args__ = (
        CheckConstraint(
            "status IN ('booked', 'canceled')",
            name="ck_appointments_status",
        ),
        CheckConstraint(
            "reason IN ('course_planning', 'degree_progress', 'academic_concerns', 'other')",
            name="ck_appointments_reason",
        ),
        Index(
            "uq_active_booking_per_slot",
            "slot_id",
            unique=True,
            sqlite_where=text("status = 'booked'"),
        ),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    slot_id: Mapped[int] = mapped_column(ForeignKey("availability_slots.id"), nullable=False)
    student_id: Mapped[int] = mapped_column(ForeignKey("demo_users.id"), nullable=False)
    reason: Mapped[str] = mapped_column(String(64), nullable=False, default="other")
    status: Mapped[str] = mapped_column(String(32), nullable=False, default="booked")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=text("(CURRENT_TIMESTAMP)"),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=text("(CURRENT_TIMESTAMP)"),
    )

    slot: Mapped[AvailabilitySlot] = relationship(back_populates="appointments")
    student: Mapped[DemoUser] = relationship(back_populates="appointments")
