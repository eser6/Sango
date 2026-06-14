import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      colors: {
        // Warm, earthy, culturally-grounded palette (no corporate blue).
        cream: "#FBF4EC",
        sango: {
          50: "#FBF4EC",
          100: "#F6E6D3",
          200: "#ECC8A3",
          300: "#E0A56F",
          400: "#D4843F",
          500: "#C2692A",
          600: "#A4521F",
          700: "#82401C",
          800: "#5E2F19",
          900: "#3E2012",
        },
        // Warm ember accent for the primary action (send).
        ember: {
          500: "#E2571E",
          600: "#C2440F",
        },
      },
      keyframes: {
        // GPU-friendly (transform + opacity only) so it can't stutter on a projector.
        "message-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        dot: {
          "0%, 80%, 100%": { opacity: "0.35", transform: "translateY(0)" },
          "40%": { opacity: "1", transform: "translateY(-3px)" },
        },
      },
      animation: {
        "message-in": "message-in 0.25s ease-out both",
        dot: "dot 1.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
