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

> **Status:** working. Full chat UI (Pidgin/English/French) talking to Gemini,
> with conversation history persisted in SQLite so a refresh restores the session.

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

Open `http://localhost:3000`, pick a language, and start chatting with Sango.

## Environment variables

| App      | File          | Variable            | Purpose                                  |
| -------- | ------------- | ------------------- | ---------------------------------------- |
| backend  | `.env`        | `GEMINI_API_KEY`    | Google Gemini API key (server-side only) |
| backend  | `.env`        | `GEMINI_MODEL`      | Gemini model id (default `gemini-2.5-flash-lite`) |
| backend  | `.env`        | `GEMINI_TEMPERATURE` / `GEMINI_MAX_OUTPUT_TOKENS` | Reply warmth / max length |
| backend  | `.env`        | `CORS_ORIGINS`      | Allowed frontend origins (comma-sep)     |
| backend  | `.env`        | `DATABASE_PATH`     | SQLite file for conversation history     |
| frontend | `.env.local`  | `NEXT_PUBLIC_API_URL` | Base URL of the backend                |

`.env` / `.env.local` are git-ignored — never commit secrets. The Gemini key
lives only on the backend and is never exposed to the frontend.

## ⚠️ Gemini API quota & billing (read before the showcase)

The Gemini **free tier is capped at ~20 requests/day per model**. That is fine for
light development but **will not survive a live demo** — a handful of judges each
sending a few messages exhausts it in minutes, after which Sango falls back to a
soft "try again" message instead of replying.

**Before Technology Day, enable billing** on the Google Cloud project tied to your
`GEMINI_API_KEY` (https://aistudio.google.com/ → API key → its project → enable
billing). This moves you onto the paid tier with far higher limits; `flash-lite`
and `flash` cost only a fraction of a cent per message, so a full day of judging is
negligible.

Notes:
- The default model is `gemini-2.5-flash-lite` (most generous free quota, fast).
  `gemini-2.5-flash` gives slightly richer replies but a smaller free quota — set
  `GEMINI_MODEL` to switch. Each model has its **own** separate daily quota.
- If you hit the cap mid-development, either wait for the daily reset (~midnight US
  Pacific) or switch `GEMINI_MODEL` to a model you haven't used up that day.
