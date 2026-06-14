import type { ChatMessage } from "../types";

/** A single chat bubble. User and Sango are visually distinct: user bubbles are
 *  filled and right-aligned; Sango's are light cards, left-aligned. */
export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  const tone = isUser
    ? "rounded-br-md bg-sango-600 text-white"
    : message.isError
      ? "rounded-bl-md bg-amber-50 text-sango-800 ring-1 ring-amber-200"
      : "rounded-bl-md bg-white text-sango-900 ring-1 ring-sango-100";

  return (
    <div
      className={`flex animate-message-in ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[82%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-base leading-relaxed shadow-sm sm:max-w-[75%] ${tone}`}
      >
        {message.content}
      </div>
    </div>
  );
}
