# Sango

A conversational AI web app that speaks **Cameroonian Pidgin** (plus English and
French) naturally. Pick a language and just talk — Sango replies warmly, like
someone from home.

This repo is a two-app monorepo:

```
Sango/
├── frontend/   # Next.js 15 (App Router, TypeScript, Tailwind CSS)
└── backend/    # FastAPI (Python) — holds the prompt + Gemini call
```

> **Status:** scaffold. The `/chat` endpoint currently echoes the message back.
> Gemini gets wired in the next step.

## Prerequisites

- Node.js 18.18+ (20+ recommended) and npm
- Python 3.10+

## Backend — FastAPI (`/backend`)

```bash
cd backend

# Create and activate a virtual environment
python -m venv .venv
# Windows (PowerShell):
.venv\Scripts\Activate.ps1
# macOS / Linux:
# source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env        # Windows: copy .env.example .env
# then edit .env and set GEMINI_API_KEY when ready

# Run (http://localhost:8000)
uvicorn main:app --reload --port 8000
```

Quick check: `http://localhost:8000/health` returns `{"status":"ok"}`.

## Frontend — Next.js (`/frontend`)

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local   # Windows: copy .env.local.example .env.local

# Run (http://localhost:3000)
npm run dev
```

Open `http://localhost:3000`, click **Send test message**, and you should see the
echoed reply from the backend.

## Environment variables

| App      | File          | Variable            | Purpose                                  |
| -------- | ------------- | ------------------- | ---------------------------------------- |
| backend  | `.env`        | `GEMINI_API_KEY`    | Google Gemini API key (server-side only) |
| backend  | `.env`        | `GEMINI_MODEL`      | Gemini model id                          |
| backend  | `.env`        | `CORS_ORIGINS`      | Allowed frontend origins (comma-sep)     |
| frontend | `.env.local`  | `NEXT_PUBLIC_API_URL` | Base URL of the backend                |

`.env` / `.env.local` are git-ignored — never commit secrets. The Gemini key
lives only on the backend and is never exposed to the frontend.
