/** Gentle 3-dot "Sango is typing" indicator shown while awaiting a reply. */
export function TypingIndicator() {
  return (
    <div className="flex animate-message-in justify-start">
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-white px-4 py-3.5 shadow-sm ring-1 ring-sango-100">
        <span className="sr-only">Sango is typing…</span>
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="h-2 w-2 animate-dot rounded-full bg-sango-400"
            style={{ animationDelay: `${delay}ms` }}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}
