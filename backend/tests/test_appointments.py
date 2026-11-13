from __future__ import annotations

from datetime import datetime, timedelta, timezone

from fastapi.testclient import TestClient

from app.main import create_app


def _future_start(hours_ahead: int = 48) -> str:
    start = datetime.now(timezone.utc) + timedelta(hours=hours_ahead)
    # Align to a clean minute boundary
    start = start.replace(second=0, microsecond=0)
    return start.isoformat().replace("+00:00", "Z")


def test_seed_creates_demo_identities_and_available_slots(client: TestClient):
    identities = client.get("/api/demo/identities")
    assert identities.status_code == 200
    body = identities.json()
    assert body["student"]["display_name"] == "Jordan Lee"
    assert body["advisor"]["display_name"] == "Dr. Avery Brooks"
    assert "not authentication" in body["note"].lower()

    available = client.get("/api/slots/available")
    assert available.status_code == 200
    slots = available.json()
    assert len(slots) >= 1
    assert slots[0]["availability"] == "available"
    assert slots[0]["duration_minutes"] == 30
    assert slots[0]["advisor_name"] == "Dr. Avery Brooks"


def test_create_availability_and_reject_past_and_overlap(client: TestClient):
    start = _future_start(72)
    created = client.post("/api/advisor/slots", json={"starts_at": start})
    assert created.status_code == 201
    assert created.json()["availability"] == "available"

    past = (datetime.now(timezone.utc) - timedelta(hours=2)).isoformat()
    past_response = client.post("/api/advisor/slots", json={"starts_at": past})
    assert past_response.status_code == 422

    overlap = client.post("/api/advisor/slots", json={"starts_at": start})
    assert overlap.status_code == 409


def test_book_available_slot_and_reject_second_booking(client: TestClient):
    slots = client.get("/api/slots/available").json()
    slot_id = slots[0]["id"]

    booked = client.post(
        "/api/student/appointments",
        json={"slot_id": slot_id, "reason": "course_planning"},
    )
    assert booked.status_code == 201
    appointment = booked.json()
    assert appointment["status"] == "booked"
    assert appointment["student_name"] == "Jordan Lee"
    assert appointment["reason"] == "course_planning"

    conflict = client.post(
        "/api/student/appointments",
        json={"slot_id": slot_id, "reason": "other"},
    )
    assert conflict.status_code == 409

    available_ids = {slot["id"] for slot in client.get("/api/slots/available").json()}
    assert slot_id not in available_ids

    advisor_view = client.get("/api/advisor/appointments").json()
    assert any(item["id"] == appointment["id"] for item in advisor_view)


def test_cancel_booking_reopens_slot(client: TestClient):
    slot_id = client.get("/api/slots/available").json()[0]["id"]
    appointment = client.post(
        "/api/student/appointments",
        json={"slot_id": slot_id, "reason": "degree_progress"},
    ).json()

    canceled = client.delete(f"/api/student/appointments/{appointment['id']}")
    assert canceled.status_code == 200

    available_ids = {slot["id"] for slot in client.get("/api/slots/available").json()}
    assert slot_id in available_ids
    assert client.get("/api/student/appointments").json() == []


def test_reschedule_booking_and_preserve_on_conflict(client: TestClient):
    slots = client.get("/api/slots/available").json()
    first_id = slots[0]["id"]
    second_id = slots[1]["id"]
    third_id = slots[2]["id"]

    appointment = client.post(
        "/api/student/appointments",
        json={"slot_id": first_id, "reason": "academic_concerns"},
    ).json()

    # Occupy the third slot so a bad reschedule target conflicts
    other = client.post(
        "/api/student/appointments",
        json={"slot_id": third_id, "reason": "other"},
    )
    # Only one demo student exists, so booking third succeeds for same student.
    assert other.status_code == 201

    failed = client.patch(
        f"/api/student/appointments/{appointment['id']}",
        json={"new_slot_id": third_id},
    )
    assert failed.status_code == 409

    still_booked = client.get("/api/student/appointments").json()
    original = next(item for item in still_booked if item["id"] == appointment["id"])
    assert original["slot_id"] == first_id

    success = client.patch(
        f"/api/student/appointments/{appointment['id']}",
        json={"new_slot_id": second_id, "reason": "course_planning"},
    )
    assert success.status_code == 200
    assert success.json()["slot_id"] == second_id
    assert success.json()["reason"] == "course_planning"


def test_cannot_remove_booked_slot(client: TestClient):
    slot_id = client.get("/api/slots/available").json()[0]["id"]
    client.post(
        "/api/student/appointments",
        json={"slot_id": slot_id, "reason": "other"},
    )

    removed = client.delete(f"/api/advisor/slots/{slot_id}")
    assert removed.status_code == 409


def test_remove_unbooked_slot(client: TestClient):
    slot_id = client.get("/api/slots/available").json()[0]["id"]
    removed = client.delete(f"/api/advisor/slots/{slot_id}")
    assert removed.status_code == 200

    available_ids = {slot["id"] for slot in client.get("/api/slots/available").json()}
    assert slot_id not in available_ids

    advisor_slots = client.get("/api/advisor/slots").json()
    closed = next(slot for slot in advisor_slots if slot["id"] == slot_id)
    assert closed["availability"] == "closed"


def test_seed_is_idempotent_on_restart(db_path):
    url = f"sqlite:///{db_path.as_posix()}"
    first = create_app(url)
    with TestClient(first) as client:
        before_slots = client.get("/api/advisor/slots").json()
        before_identities = client.get("/api/demo/identities").json()
        slot_id = client.get("/api/slots/available").json()[0]["id"]
        booked = client.post(
            "/api/student/appointments",
            json={"slot_id": slot_id, "reason": "other"},
        ).json()

    second = create_app(url)
    with TestClient(second) as client:
        after_slots = client.get("/api/advisor/slots").json()
        after_identities = client.get("/api/demo/identities").json()
        appointments = client.get("/api/student/appointments").json()

    assert before_identities["student"]["id"] == after_identities["student"]["id"]
    assert before_identities["advisor"]["id"] == after_identities["advisor"]["id"]
    assert len(before_slots) == len(after_slots)
    assert any(item["id"] == booked["id"] for item in appointments)
