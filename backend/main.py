"""Sango FastAPI backend.

The /chat endpoint sends the conversation to Google Gemini using Sango's persona
system prompt + curated few-shot examples (see gemini.py / prompts.py) and returns
the reply. All configuration comes from environment variables (loaded from a local
.env file) — nothing is hardcoded, and the API key never leaves the backend.
"""

import logging
import os
from typing import List, Literal

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()

# Import after load_dotenv() so gemini.py reads the populated environment.
import gemini  # noqa: E402

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("sango")

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


class ChatResponse(BaseModel):
    reply: str


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "gemini_configured": str(gemini.is_configured()).lower()}


@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest) -> ChatResponse:
    if not gemini.is_configured():
        # No API key set — fail clearly. The frontend shows a soft retry message,
        # never a raw error.
        logger.warning("Received /chat request but GEMINI_API_KEY is not configured")
        raise HTTPException(status_code=503, detail="Sango is not configured yet")

    try:
        reply = gemini.generate_reply(req.message, req.history, req.language)
    except Exception:
        # Log the real error server-side; return a clean error the frontend can
        # turn into a warm retry message.
        logger.exception("Gemini request failed")
        raise HTTPException(status_code=502, detail="Sango could not answer right now")

    return ChatResponse(reply=reply)
