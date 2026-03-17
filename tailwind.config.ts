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
        signal: "#D8FF2A"
      },
      borderRadius: {
        card: "16px",
        button: "15px"
      },
      maxWidth: {
        content: "1200px"
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "Inter", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"]
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
        "reveal-up": "reveal-up 220ms ease-out forwards"
      }
    }
  },
  plugins: []
};

export default config;
