"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatMessage, Language } from "./types";
import { CONTENT } from "./lib/content";
import { sendChat, getConversation } from "./lib/api";
import { LanguageSelector } from "./components/LanguageSelector";
import { MessageBubble } from "./components/MessageBubble";
import { TypingIndicator } from "./components/TypingIndicator";
import { ChatComposer } from "./components/ChatComposer";
import { WelcomeView } from "./components/WelcomeView";
import { SangoMark } from "./components/icons";

let idCounter = 0;
const nextId = () => `${Date.now()}-${idCounter++}`;

// sessionStorage (NOT localStorage) so a refresh restores the session but it
// does not linger across browser sessions.
const STORAGE_KEY = "sango_conversation_id";

export default function Home() {
  const [language, setLanguage] = useState<Language>("pidgin");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const content = CONTENT[language];
  const isEmpty = messages.length === 0;

  // On load: if we have a saved conversation id, fetch and restore its history.
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    getConversation(saved)
      .then((data) => {
        if (!data) {
          // Conversation no longer exists — drop the stale id.
          sessionStorage.removeItem(STORAGE_KEY);
          return;
        }
        setConversationId(data.conversation_id);
        setMessages(
          data.messages.map((m) => ({
            id: nextId(),
            role: m.role,
            content: m.content,
          })),
        );
      })
      .catch(() => {
        /* network hiccup on restore — start fresh, no raw error shown */
      });
  }, []);

  // Keep the latest message / typing indicator in view.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend(text: string) {
    if (loading) return;

    // History = the conversation so far (excluding soft error bubbles).
    const history = messages
      .filter((m) => !m.isError)
      .map((m) => ({ role: m.role, content: m.content }));

    const userMessage: ChatMessage = { id: nextId(), role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const data = await sendChat({
        message: text,
        language,
        history,
        conversation_id: conversationId ?? undefined,
      });
      // Remember the conversation id (first turn returns a fresh one).
      if (data.conversation_id && data.conversation_id !== conversationId) {
        setConversationId(data.conversation_id);
        sessionStorage.setItem(STORAGE_KEY, data.conversation_id);
      }
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: "assistant", content: data.reply },
      ]);
    } catch {
      // Never surface a raw error — show a warm, language-appropriate retry.
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: "assistant", content: content.retry, isError: true },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex h-[100dvh] max-w-2xl flex-col bg-cream">
      <header className="flex flex-col gap-3 border-b border-sango-100 bg-cream/90 px-4 py-4 backdrop-blur sm:px-6">
        <div className="flex items-center gap-3">
          <SangoMark />
          <div>
            <h1 className="font-heading text-xl leading-none text-sango-700">Sango</h1>
            <p className="mt-1 text-xs text-sango-500">{content.tagline}</p>
          </div>
        </div>
        <LanguageSelector value={language} onChange={setLanguage} />
      </header>

      <div
        ref={scrollRef}
        className="flex-1 space-y-3 overflow-y-auto px-4 py-5 sm:px-6"
      >
        {isEmpty ? (
          <WelcomeView content={content} onPick={handleSend} disabled={loading} />
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        {loading && <TypingIndicator />}
      </div>

      <div className="border-t border-sango-100 bg-cream px-4 py-3 sm:px-6">
        <ChatComposer
          placeholder={content.placeholder}
          disabled={loading}
          onSend={handleSend}
        />
      </div>
    </div>
  );
}
