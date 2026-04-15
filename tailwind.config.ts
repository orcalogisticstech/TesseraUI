import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        page: {
          light: "#F5F7FA",
          dark: "#0B0D10"
        },
        surface: {
          light: "#FFFFFF",
          dark: "#14161B"
        },
        text: {
          lightPrimary: "#0B0D10",
          lightSecondary: "#4B5563",
          darkPrimary: "#F5F7FA",
          darkSecondary: "#D5DAE2"
        },
        border: {
          light: "rgba(11,13,16,0.10)",
          dark: "rgba(245,247,250,0.12)"
        },
        signal: "#D8FF2A",
        danger: "#FF3B30",
        warning: "#FFB020",
        success: "#34C759"
      },
      borderRadius: {
        card: "16px",
        appCard: "12px",
        button: "14px",
        marketingCard: "0px",
        marketingButton: "0px"
      },
      spacing: {
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        6: "24px",
        8: "32px",
        12: "48px",
        16: "64px",
        24: "96px"
      },
      maxWidth: {
        content: "1200px"
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "Inter", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        code: ["var(--font-jetbrains-mono)", "SF Mono", "monospace"]
      },
      keyframes: {
        "reveal-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        }
      },
      animation: {
        "reveal-up": "reveal-up 220ms ease-out forwards",
        pulse: "pulse 150ms ease-in-out infinite alternate"
      }
    }
  },
  plugins: []
};

export default config;
