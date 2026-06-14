import type { Language } from "../types";

/** Options shown in the language selector (Pidgin is the default). */
export const LANGUAGES: { value: Language; label: string }[] = [
  { value: "pidgin", label: "Pidgin" },
  { value: "english", label: "English" },
  { value: "french", label: "Français" },
];

export interface LangContent {
  tagline: string;
  welcome: string;
  placeholder: string;
  /** Soft fallback shown in-chat when the request fails on the client side. */
  retry: string;
  suggestions: string[];
}

export const CONTENT: Record<Language, LangContent> = {
  pidgin: {
    tagline: "Your companion wey sabi talk Pidgin",
    welcome:
      "Ah, welcome my padi! Na Sango be my name. Wetin dey your mind today? Make we gist small.",
    placeholder: "Type your message…",
    retry: "Ah, my network do me yawa small. Abeg try am again — I still dey here for you.",
    suggestions: ["How you dey?", "Tell me one proverb", "How I fit cook ndole?"],
  },
  english: {
    tagline: "Your warm companion from home",
    welcome:
      "Hey, welcome! I'm Sango. What's on your mind today? Let's have a little chat.",
    placeholder: "Type your message…",
    retry: "Oops, my connection slipped for a second. Please try again — I'm right here.",
    suggestions: [
      "How are you?",
      "Tell me a proverb",
      "What's the capital of Cameroon?",
    ],
  },
  french: {
    tagline: "Ton compagnon chaleureux",
    welcome:
      "Salut, bienvenue ! Je suis Sango. Qu'est-ce qui te passe par la tête aujourd'hui ? Discutons un peu.",
    placeholder: "Écris ton message…",
    retry: "Oups, ma connexion a flanché un instant. Réessaie — je suis là pour toi.",
    suggestions: [
      "Comment vas-tu ?",
      "Raconte-moi un proverbe",
      "Quelle est la capitale du Cameroun ?",
    ],
  },
};
