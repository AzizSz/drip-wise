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
        surface: {
          950: "#0c0906",
          900: "#131009",
          800: "#1c1610",
          700: "#252018",
          600: "#302a1f",
          500: "#3d3528",
          400: "#4a4030",
        },
        ink: {
          100: "#f0e8dc",
          200: "#d9cebc",
          300: "#a8997f",
          400: "#6b5e47",
          500: "#4a4030",
        },
        accent: {
          300: "#e8c98a",
          400: "#d4a853",
          500: "#c49a3c",
          600: "#a07d28",
          950: "#1f1608",
        },
        hot:  "#e07040",
        iced: "#5ab4d4",
        good: "#5a9e6f",
        warn: "#c49a3c",
        bad:  "#c45c3c",
      },
      fontFamily: {
        sans: ["ThmanyahSans", "Segoe UI", "system-ui", "sans-serif"],
        serif: ["ThmanyahSerif", "ThmanyahSans", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      animation: {
        "fade-in":     "fadeIn 0.3s ease-in-out",
        "slide-down":  "slideDown 0.3s ease-out",
        "slide-up":    "slideUp 0.3s ease-out",
        "number-pop":  "numberPop 0.25s ease-out",
        "result-in":   "resultIn 0.3s ease-out",
        "glow-pulse":  "glowPulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideDown: {
          "0%":   { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        numberPop: {
          "0%":   { transform: "scale(1)" },
          "50%":  { transform: "scale(1.08)" },
          "100%": { transform: "scale(1)" },
        },
        resultIn: {
          "0%":   { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 12px rgba(196,154,60,0.15)" },
          "50%":      { boxShadow: "0 0 28px rgba(196,154,60,0.35)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
