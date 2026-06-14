import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm, earthy accent palette per the design system.
        sango: {
          50: "#fdf6ee",
          100: "#f8e6d2",
          200: "#efc89e",
          300: "#e6a868",
          400: "#dd8b3f",
          500: "#c9722a",
          600: "#a85820",
          700: "#85431d",
          800: "#5f311a",
          900: "#3f2113",
        },
      },
    },
  },
  plugins: [],
};

export default config;
