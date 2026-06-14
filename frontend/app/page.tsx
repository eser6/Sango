"use client";

import { useState } from "react";

// Shape of the backend /chat response. Keep in sync with the FastAPI ChatResponse model.
type ChatResponse = {
  reply: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function Home() {
  const [reply, setReply] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  async function sendTestMessage() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Hello Sango, how you dey?",
          language: "pidgin",
          history: [],
        }),
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data: ChatResponse = await res.json();
      setReply(data.reply);
    } catch {
      // Never surface a raw error stack — keep it warm and soft (per CLAUDE.md).
      setError("Sango no fit answer just now. Try am again small time.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-8 px-6 py-12">
      <header className="text-center">
        <h1 className="text-5xl font-bold tracking-tight text-sango-700">
          Sango
        </h1>
        <p className="mt-2 text-sm text-sango-600">
          Your companion wey sabi talk Pidgin.
        </p>
      </header>

      <button
        type="button"
        onClick={sendTestMessage}
        disabled={loading}
        className="rounded-full bg-sango-500 px-6 py-3 font-medium text-white shadow-md transition-colors hover:bg-sango-600 active:bg-sango-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Sango dey think…" : "Send test message"}
      </button>

      {reply && (
        <div className="w-full rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-sango-400">
            Sango
          </p>
          <p className="mt-1 text-base text-sango-900">{reply}</p>
        </div>
      )}

      {error && (
        <p className="w-full rounded-2xl bg-sango-100 p-4 text-center text-sm text-sango-700">
          {error}
        </p>
      )}
    </main>
  );
}
