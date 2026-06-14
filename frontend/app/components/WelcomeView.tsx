import type { LangContent } from "../lib/content";
import { MessageBubble } from "./MessageBubble";

interface Props {
  content: LangContent;
  onPick: (text: string) => void;
  disabled: boolean;
}

/** Empty-state: a warm greeting from Sango plus tappable starter prompts. */
export function WelcomeView({ content, onPick, disabled }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <MessageBubble
        message={{ id: "welcome", role: "assistant", content: content.welcome }}
      />
      <div className="flex flex-wrap gap-2 pl-1">
        {content.suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            disabled={disabled}
            onClick={() => onPick(suggestion)}
            className="cursor-pointer rounded-full border border-sango-200 bg-white px-4 py-2 text-sm text-sango-700 shadow-sm transition-colors duration-200 hover:border-sango-300 hover:bg-sango-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
