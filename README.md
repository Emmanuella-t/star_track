# Star Track

Student advising prototype for Philander Smith University's Software Engineering final project, Group 3.

## Project root

This repository (`star_track/`) is the Git root. Keep application code, `docs/`, `frontend/`, and `backend/` here. If a parent folder also contains a `docs/` copy (for example a Cursor packaging wrapper), treat this repo's `docs/` as the source of truth.

## MVP
- Source-grounded AI advising chatbot (planned)
- Manual degree progress tracker for one sample Computer Science plan (frontend complete)
- Advisor availability and appointment booking (FastAPI + SQLite, student and advisor UI)

No live student records or student information system integration. This is not an official advising service.
Role selection on `/demo` is classroom navigation only. It is not authentication or campus SSO.

## Stack
React + TypeScript + Vite frontend, Python + FastAPI backend, SQLite for appointments, retrieval store to be selected.

Frontend talks to the API at `VITE_API_URL` (default `http://localhost:8000`).

## Run backend
Requires Python 3.11+.
```bash
cd backend
python -m venv .venv
# Activate .venv for your operating system
pip install -r requirements.txt
uvicorn app.main:app --reload
```
Visit http://localhost:8000/health

## Run frontend
Requires Node.js 20+.
```bash
cd frontend
npm install
npm run dev
```
Visit http://localhost:5173

## Team workflow
Use feature branches named after Jira issues, such as feature/SCRUM-13-project-setup. Keep main stable; open reviewed pull requests. Record real testing evidence and development progress in Jira.
