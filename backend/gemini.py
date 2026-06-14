"""Gemini client wrapper for Sango.

Builds the request from the persona system prompt + curated few-shot examples +
the live conversation history, calls the Google Gemini API, and returns the reply
text. All configuration comes from the environment — the API key never leaves the
backend.
"""

import logging
import os
from typing import List, Sequence

from google import genai
from google.genai import types

from prompts import DEFAULT_LANGUAGE, FEW_SHOT_EXAMPLES, SYSTEM_PROMPTS

logger = logging.getLogger("sango.gemini")

_API_KEY = os.getenv("GEMINI_API_KEY")
_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
_TEMPERATURE = float(os.getenv("GEMINI_TEMPERATURE", "0.9"))
_MAX_OUTPUT_TOKENS = int(os.getenv("GEMINI_MAX_OUTPUT_TOKENS", "512"))

# Only build a client if a key is configured. Without one, is_configured()
# returns False and the endpoint can respond gracefully instead of crashing.
_client = genai.Client(api_key=_API_KEY) if _API_KEY else None


class HistoryItem:
    """Minimal protocol for a conversation turn: has .role and .content."""

    role: str
    content: str


def is_configured() -> bool:
    """True when a Gemini API key is present and a client was created."""
    return _client is not None


def _resolve_language(language: str) -> str:
    return language if language in SYSTEM_PROMPTS else DEFAULT_LANGUAGE


def _build_contents(
    message: str,
    history: Sequence[HistoryItem],
    language: str,
) -> List[types.Content]:
    """Few-shot examples first (to anchor tone), then real history, then the new message."""
    contents: List[types.Content] = []

    for example in FEW_SHOT_EXAMPLES.get(language, []):
        contents.append(
            types.Content(role="user", parts=[types.Part(text=example["user"])])
        )
        contents.append(
            types.Content(role="model", parts=[types.Part(text=example["model"])])
        )

    for turn in history:
        role = "model" if turn.role == "assistant" else "user"
        contents.append(types.Content(role=role, parts=[types.Part(text=turn.content)]))

    contents.append(types.Content(role="user", parts=[types.Part(text=message)]))
    return contents


def generate_reply(
    message: str,
    history: Sequence[HistoryItem],
    language: str = DEFAULT_LANGUAGE,
) -> str:
    """Call Gemini and return Sango's reply. Raises on failure (caller handles it)."""
    if _client is None:
        raise RuntimeError("Gemini client is not configured (missing GEMINI_API_KEY)")

    lang = _resolve_language(language)
    contents = _build_contents(message, history, lang)

    response = _client.models.generate_content(
        model=_MODEL,
        contents=contents,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPTS[lang],
            temperature=_TEMPERATURE,
            max_output_tokens=_MAX_OUTPUT_TOKENS,
        ),
    )

    text = (response.text or "").strip()
    if not text:
        raise RuntimeError("Gemini returned an empty response")
    return text
