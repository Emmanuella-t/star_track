# Star Track

Student advising prototype for Philander Smith University's Software Engineering final project, Group 3.

## MVP
- Source-grounded AI advising chatbot (planned)
- Manual degree progress tracker for one sample program (planned)
- Advisor availability and appointment booking (planned)

No live student records or student information system integration. This is not an official advising service.

## Stack
React + TypeScript + Vite frontend, Python + FastAPI backend, SQLite planned, retrieval store to be selected.

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
