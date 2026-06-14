"""Sango FastAPI backend.

The /chat endpoint sends the conversation to Google Gemini using Sango's persona
system prompt + curated few-shot examples (see gemini.py / persona.py) and returns
the reply. All configuration comes from environment variables (loaded from a local
.env file) — nothing is hardcoded, and the API key never leaves the backend.
"""

import logging
import os
from typing import List, Literal, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()

# Import after load_dotenv() so gemini.py reads the populated environment.
import db  # noqa: E402
import gemini  # noqa: E402
import persona  # noqa: E402

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("sango")

db.init_db()

app = FastAPI(title="Sango API")

# Comma-separated list of allowed frontend origins for CORS, from the env.
_raw_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000")
allowed_origins = [origin.strip() for origin in _raw_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Message(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    message: str
    language: str = "pidgin"
    history: List[Message] = []
    conversation_id: Optional[str] = None


class ChatResponse(BaseModel):
    reply: str
    conversation_id: str


class ConversationResponse(BaseModel):
    conversation_id: str
    messages: List[Message]


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "gemini_configured": str(gemini.is_configured()).lower()}


@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest) -> ChatResponse:
    """Always returns a {reply, conversation_id}. On any failure, Sango answers
    with a warm, soft fallback in the selected language — never a raw error."""
    # Resolve the conversation: reuse a valid existing id, otherwise start a new one.
    conversation_id = req.conversation_id
    if not conversation_id or not db.conversation_exists(conversation_id):
        conversation_id = db.create_conversation()

    try:
        if not gemini.is_configured():
            raise RuntimeError("GEMINI_API_KEY is not configured")
        reply = gemini.generate_reply(req.message, req.history, req.language)
        # Persist the completed turn (user + Sango) so it survives a refresh.
        db.add_message(conversation_id, "user", req.message)
        db.add_message(conversation_id, "assistant", reply)
        return ChatResponse(reply=reply, conversation_id=conversation_id)
    except Exception:
        # Log the real error server-side; the user only ever sees a gentle,
        # persona-consistent message. The soft fallback is not persisted.
        logger.exception("Gemini request failed; returning soft fallback")
        return ChatResponse(
            reply=persona.fallback_for(req.language),
            conversation_id=conversation_id,
        )


@app.get("/conversations/{conversation_id}", response_model=ConversationResponse)
def get_conversation(conversation_id: str) -> ConversationResponse:
    """Return the full message history for a conversation (for refresh-restore)."""
    if not db.conversation_exists(conversation_id):
        raise HTTPException(status_code=404, detail="Conversation not found")
    messages = [Message(**m) for m in db.get_messages(conversation_id)]
    return ConversationResponse(conversation_id=conversation_id, messages=messages)
