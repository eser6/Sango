// Shared types for the Sango chat client. Kept in sync with the FastAPI models.

export type Language = "pidgin" | "english" | "french";

export type Role = "user" | "assistant";

/** A turn rendered in the UI. `isError` marks a soft client-side fallback. */
export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  isError?: boolean;
}

/** A turn as sent to the backend in `history`. */
export interface HistoryTurn {
  role: Role;
  content: string;
}

export interface ChatRequestBody {
  message: string;
  language: Language;
  history: HistoryTurn[];
  conversation_id?: string;
}

export interface ChatResponse {
  reply: string;
  conversation_id: string;
}

export interface ConversationResponse {
  conversation_id: string;
  messages: HistoryTurn[];
}
