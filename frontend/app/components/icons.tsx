// Small inline SVG icons (no emojis used as UI icons). 24x24 viewBox.

export function SendIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M4.5 12 19 5l-3.2 14-4.1-5.1L4.5 12Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Sango's warm avatar mark — a simple sun, culturally warm and decorative. */
export function SangoMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-gradient-to-br from-sango-400 to-ember-600 text-white shadow-sm ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <circle cx="12" cy="12" r="4.5" fill="currentColor" />
        {Array.from({ length: 8 }).map((_, i) => (
          <line
            key={i}
            x1="12"
            y1="2"
            x2="12"
            y2="4.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            transform={`rotate(${i * 45} 12 12)`}
          />
        ))}
      </svg>
    </div>
  );
}
