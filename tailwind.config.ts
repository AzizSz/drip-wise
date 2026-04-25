import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Surface scale — #0a0a0a → #333
        surface: {
          950: "#0a0a0a",
          900: "#141414",
          800: "#1a1a1a",
          700: "#222222",
          600: "#2a2a2a",
          500: "#333333",
          400: "#3d3d3d",
        },
        // Text scale — primary #e5e5e5 → muted #4b5563
        ink: {
          100: "#e5e5e5",
          200: "#d4d4d4",
          300: "#a3a3a3",
          400: "#6b7280",
          500: "#4b5563",
        },
        // Accent — lavender/violet
        accent: {
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",   // highlight / soft purple
          500: "#8b9cf7",   // primary accent / soft lavender
          600: "#7c7cf0",
          700: "#6366f1",
          950: "#1e1b4b",   // deep tint for backgrounds
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-down": "slideDown 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-glow": "pulseGlow 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 10px rgba(139,156,247,0.2)" },
          "50%": { boxShadow: "0 0 28px rgba(139,156,247,0.45)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
