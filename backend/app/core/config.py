from __future__ import annotations

import os
from pathlib import Path

# Classroom demo identities. Role selection in the UI is navigation only,
# not authentication. These fixed IDs keep student and advisor views consistent.
DEMO_STUDENT_KEY = "demo-student"
DEMO_ADVISOR_KEY = "demo-advisor"
DEMO_STUDENT_NAME = "Jordan Lee"
DEMO_ADVISOR_NAME = "Dr. Avery Brooks"

APPOINTMENT_DURATION_MINUTES = 30
DISPLAY_TIMEZONE = "America/Chicago"

DEFAULT_DB_PATH = Path(__file__).resolve().parents[2] / "data" / "star_track.db"


def get_database_url() -> str:
    configured = os.getenv("STAR_TRACK_DATABASE_URL")
    if configured:
        return configured
    DEFAULT_DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    return f"sqlite:///{DEFAULT_DB_PATH.as_posix()}"
