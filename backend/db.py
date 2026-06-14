"""Minimal SQLite persistence for Sango conversations.

Schema is intentionally tiny (per CLAUDE.md): no user accounts, no identity.
    conversations(id, created_at)
    messages(id, conversation_id, role, content, created_at)
"""

import os
import sqlite3
import uuid
from datetime import datetime, timezone
from typing import Dict, List

DB_PATH = os.getenv("DATABASE_PATH", "sango.db")


def _connect() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def init_db() -> None:
    with _connect() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS conversations (
                id          TEXT PRIMARY KEY,
                created_at  TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS messages (
                id               INTEGER PRIMARY KEY AUTOINCREMENT,
                conversation_id  TEXT NOT NULL,
                role             TEXT NOT NULL,
                content          TEXT NOT NULL,
                created_at       TEXT NOT NULL,
                FOREIGN KEY (conversation_id) REFERENCES conversations(id)
            );

            CREATE INDEX IF NOT EXISTS idx_messages_conversation
                ON messages(conversation_id);
            """
        )


def create_conversation() -> str:
    conversation_id = uuid.uuid4().hex
    with _connect() as conn:
        conn.execute(
            "INSERT INTO conversations (id, created_at) VALUES (?, ?)",
            (conversation_id, _now()),
        )
    return conversation_id


def conversation_exists(conversation_id: str) -> bool:
    with _connect() as conn:
        row = conn.execute(
            "SELECT 1 FROM conversations WHERE id = ?", (conversation_id,)
        ).fetchone()
    return row is not None


def add_message(conversation_id: str, role: str, content: str) -> None:
    with _connect() as conn:
        conn.execute(
            "INSERT INTO messages (conversation_id, role, content, created_at) "
            "VALUES (?, ?, ?, ?)",
            (conversation_id, role, content, _now()),
        )


def get_messages(conversation_id: str) -> List[Dict[str, str]]:
    with _connect() as conn:
        rows = conn.execute(
            "SELECT role, content FROM messages "
            "WHERE conversation_id = ? ORDER BY id ASC",
            (conversation_id,),
        ).fetchall()
    return [{"role": row["role"], "content": row["content"]} for row in rows]
