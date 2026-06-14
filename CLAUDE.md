# CLAUDE.md — Sango

## What this project is
Sango is a conversational AI web app that speaks **Cameroonian Pidgin** (plus English and French) naturally — not a language *tutor*, a language *companion*. The user picks a language and just talks; Sango replies warmly, like someone from home. Built for the College of Technology (University of Buea) Technology Day showcase.

**The entire project is won or lost on one moment:** a person speaks Pidgin and Sango answers fluently and warmly. Optimize everything for that.

## Tech stack (do not change without asking)
- Frontend: Next.js 15, App Router, TypeScript, Tailwind CSS
- Backend: FastAPI (Python)
- Database: SQLite (conversation history)
- AI: Google Gemini API
- Deploy: Vercel (frontend), Render (backend), free tiers

## Architecture
- Frontend chat UI → calls FastAPI `/chat` endpoint → calls Gemini → returns reply.
- Backend holds the system prompt + few-shot examples and the Gemini call. Never expose the API key to the frontend.
- SQLite stores conversation turns so a session survives refresh. Keep the schema minimal: `conversations(id, created_at)`, `messages(id, conversation_id, role, content, created_at)`.

## The Pidgin brain (most important part)
- The "intelligence" is prompt engineering, not model training.
- Maintain a strong **system prompt** defining Sango's persona: warm, respectful, fluent Cameroonian Pidgin; uses local idioms and proverbs naturally; never stiff or robotic; never code-switches to formal English unless asked.
- Maintain a curated **few-shot example set** (15–25 hand-written exchanges) covering greetings, small talk, a practical question, a proverb, and a respectful/comforting exchange with an elder. These anchor tone more than anything else.
- Language selector swaps which persona/instruction block is sent (Pidgin default / English / French).
- When unsure of Pidgin phrasing, prefer widely-understood common Pidgin over deep regional slang.

## Design system
- Mobile-first, responsive. It must feel like an app on a phone — judges will open it on theirs.
- Warm, culturally grounded, clean. Not corporate-sterile. Earthy/warm accent palette over cold blue.
- Smooth, subtle animations on message send/receive. Nothing flashy that can stutter on stage.
- Clear language selector at the top.

## Coding conventions
- TypeScript strict on the frontend. Type API responses.
- Keep components small and readable.
- All secrets in env vars (`.env.local` frontend, `.env` backend) — never commit them.
- Handle API failures gracefully: a loading state and a soft retry message, NEVER a raw error stack on screen (this will be demoed live).

## Demo hardening (do this near the end)
- Rehearse 3–4 signature interactions until reliably good.
- Render free tier sleeps — provide a way to wake/keep-warm the backend before judging.
- Test on a real phone over real network, and on the projector/laptop path.

## Scope discipline
- Build the focused demo core first; do NOT add features that don't make the core conversation better or more reliable.
- Voice in/out, extra dialects, and "proverb of the day" are STRETCH ONLY — touch them only after the text core is bulletproof (and after Manyi is done).

## Out of scope
- No user accounts / auth.
- No mobile-native build.
- No training a custom model.
