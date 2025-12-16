import { tokens } from "./src/styles/tokens";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: tokens.color.primary,
        primaryMuted: tokens.color.primaryMuted,
        surface: tokens.color.surface,
        surfaceAlt: tokens.color.surfaceAlt,
        border: tokens.color.border,
        text: tokens.color.text,
        textMuted: tokens.color.textMuted,
      },
      borderRadius: {
        sm: tokens.radius.sm,
        md: tokens.radius.md,
        lg: tokens.radius.lg,
      },
      spacing: {
        xs: tokens.spacing.xs,
        sm: tokens.spacing.sm,
        md: tokens.spacing.md,
        lg: tokens.spacing.lg,
        xl: tokens.spacing.xl,
      },
    },
  },
  darkMode: 'class', // Enable dark mode using the 'dark' class
}