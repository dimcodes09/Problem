import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0f",
        foreground: "#ffffff",
        crisis:  "#ff2e4c",
        amber:   "#f59e0b",
        safe:    "#22c55e",
        data:    "#38bdf8",
        frost:   "#94a3b8",
        ghost:   "rgba(255,255,255,0.04)",
        violet:  "#a78bfa",
      },
      fontFamily: {
        syne:  ["var(--font-syne)", "sans-serif"],
        space: ["var(--font-space)", "sans-serif"],
        mono:  ["var(--font-mono)", "monospace"],
      },
      animation: {
        "pulse-glow": "glow-pulse 2s ease-in-out infinite",
        "spin-slow":  "slow-spin 180s linear infinite",
        "float":      "float-up 4s ease-in-out infinite",
      },
      keyframes: {
        "glow-pulse": {
          "0%, 100%": { opacity: "0.5" },
          "50%":      { opacity: "1"   },
        },
        "slow-spin": {
          from: { transform: "rotate(0deg)"   },
          to:   { transform: "rotate(360deg)" },
        },
        "float-up": {
          "0%":   { transform: "translateY(0px)"  },
          "50%":  { transform: "translateY(-6px)" },
          "100%": { transform: "translateY(0px)"  },
        },
      },
      backgroundImage: {
        "grid-pattern": `linear-gradient(rgba(56,189,248,0.04) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(56,189,248,0.04) 1px, transparent 1px)`,
      },
      boxShadow: {
        "glow-crisis": "0 0 24px rgba(255,46,76,0.3)",
        "glow-amber":  "0 0 24px rgba(245,158,11,0.3)",
        "glow-data":   "0 0 24px rgba(56,189,248,0.3)",
        "glow-safe":   "0 0 24px rgba(34,197,94,0.3)",
      },
    },
  },
  plugins: [],
};
export default config;
