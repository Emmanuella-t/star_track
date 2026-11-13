from __future__ import annotations

from contextlib import asynccontextmanager
from collections.abc import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import appointments as appointments_api
from app.db.seed import seed_demo_data
from app.db.session import create_db_engine, create_session_factory, init_db


def create_app(database_url: str | None = None) -> FastAPI:
    engine = create_db_engine(database_url)
    session_factory = create_session_factory(engine)
    init_db(engine)

    with session_factory() as session:
        seed_demo_data(session)

    @asynccontextmanager
    async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
        yield

    application = FastAPI(
        title="Star Track API",
        version="0.2.0",
        lifespan=lifespan,
    )
    application.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ],
        allow_credentials=True,
        allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )

    def get_session():
        session = session_factory()
        try:
            yield session
        finally:
            session.close()

    application.dependency_overrides[appointments_api.get_db_session] = get_session
    application.include_router(appointments_api.router)

    @application.get("/health")
    def health() -> dict[str, str]:
        return {"status": "ok", "service": "star-track-api"}

    # Expose for tests that need a fresh factory against the same engine
    application.state.engine = engine
    application.state.session_factory = session_factory
    return application


app = create_app()
