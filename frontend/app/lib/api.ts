import type {
  ChatRequestBody,
  ChatResponse,
  ConversationResponse,
} from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/** Call the backend /chat endpoint. Throws on network/non-2xx so the caller
 *  can show a soft in-chat retry message — never a raw error. */
export async function sendChat(body: ChatRequestBody): Promise<ChatResponse> {
  const res = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }

  return (await res.json()) as ChatResponse;
}

/** Fire-and-forget ping to wake a sleeping (Render free-tier) backend. Best-effort:
 *  failures are swallowed so a cold/unreachable backend never shows an error. */
export async function warmBackend(): Promise<void> {
  try {
    await fetch(`${API_URL}/ping`, { method: "GET" });
  } catch {
    /* ignore — keep-warm is best-effort */
  }
}

/** Fetch a saved conversation's history. Returns null if it no longer exists. */
export async function getConversation(
  conversationId: string,
): Promise<ConversationResponse | null> {
  const res = await fetch(`${API_URL}/conversations/${conversationId}`);
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }
  return (await res.json()) as ConversationResponse;
}
