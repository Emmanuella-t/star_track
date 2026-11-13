from __future__ import annotations

import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

BACKEND_ROOT = Path(__file__).resolve().parents[1]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from app.main import create_app  # noqa: E402


@pytest.fixture()
def client(tmp_path) -> TestClient:
    db_path = tmp_path / "test_star_track.db"
    application = create_app(f"sqlite:///{db_path.as_posix()}")
    with TestClient(application) as test_client:
        yield test_client


@pytest.fixture()
def db_path(tmp_path) -> Path:
    return tmp_path / "persist_star_track.db"
