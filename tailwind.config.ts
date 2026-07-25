import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        hanken: ["var(--font-hanken)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        border: "var(--color-outline-variant)",
        input: "var(--color-outline)",
        ring: "var(--color-primary)",
        background: "var(--color-background)",
        foreground: "var(--color-on-background)",
        primary: {
          DEFAULT: "var(--color-primary)",
          foreground: "var(--color-on-primary)",
          container: "var(--color-primary-container)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          foreground: "var(--color-on-secondary)",
          container: "var(--color-secondary-container)",
        },
        tertiary: {
          DEFAULT: "var(--color-tertiary)",
          foreground: "var(--color-on-tertiary)",
          container: "var(--color-tertiary-container)",
        },
        destructive: {
          DEFAULT: "var(--color-error)",
          foreground: "var(--color-on-error)",
        },
        muted: {
          DEFAULT: "var(--color-surface-container-high)",
          foreground: "var(--color-on-surface-variant)",
        },
        accent: {
          DEFAULT: "var(--color-surface-tint)",
          foreground: "var(--color-on-primary)",
        },
        popover: {
          DEFAULT: "var(--color-surface-container-lowest)",
          foreground: "var(--color-on-surface)",
        },
        card: {
          DEFAULT: "var(--color-surface)",
          foreground: "var(--color-on-surface)",
        },
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.25rem",
        DEFAULT: "0.5rem",
        xl: "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
