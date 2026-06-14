"use client";

import { useState, type FormEvent } from "react";
import { SendIcon } from "./icons";

interface Props {
  placeholder: string;
  disabled: boolean;
  onSend: (text: string) => void;
}

/** Message input + send button. Submits on Enter or button tap. */
export function ChatComposer({ placeholder, disabled, onSend }: Props) {
  const [text, setText] = useState("");
  const canSend = text.trim().length > 0 && !disabled;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canSend) return;
    onSend(text.trim());
    setText("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <label htmlFor="chat-input" className="sr-only">
        Message Sango
      </label>
      <input
        id="chat-input"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        enterKeyHint="send"
        className="min-h-[48px] flex-1 rounded-full border border-sango-200 bg-white px-5 text-base text-sango-900 placeholder:text-sango-400 focus:border-sango-400 focus:outline-none focus:ring-2 focus:ring-sango-300"
      />
      <button
        type="submit"
        disabled={!canSend}
        aria-label="Send message"
        className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-ember-500 text-white shadow-md transition-colors duration-200 hover:bg-ember-600 focus:outline-none focus:ring-2 focus:ring-ember-600 focus:ring-offset-2 focus:ring-offset-cream disabled:cursor-not-allowed disabled:opacity-50"
      >
        <SendIcon />
      </button>
    </form>
  );
}
