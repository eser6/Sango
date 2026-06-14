"use client";

import type { Language } from "../types";
import { LANGUAGES } from "../lib/content";

interface Props {
  value: Language;
  onChange: (language: Language) => void;
}

/** Segmented control for picking the conversation language. */
export function LanguageSelector({ value, onChange }: Props) {
  return (
    <div
      role="group"
      aria-label="Choose conversation language"
      className="inline-flex w-full rounded-full bg-sango-100 p-1 sm:w-auto"
    >
      {LANGUAGES.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={active}
            className={`min-h-[44px] flex-1 cursor-pointer rounded-full px-4 text-sm font-semibold transition-colors duration-200 sm:flex-none ${
              active
                ? "bg-white text-sango-700 shadow-sm"
                : "text-sango-600 hover:text-sango-900"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
