/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#208AEF", // Brand Primary
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          DEFAULT: "#208AEF",
        },
        secondary: {
          50: "#f5f3ff",
          DEFAULT: "#6D28D9",
          dark: "#5B21B6",
        },
        accent: {
          DEFAULT: "#F59E0B",
          dark: "#D97706",
        },
        background: {
          light: "#FFFFFF",
          dark: "#0F172A", // Slate 900
        },
        surface: {
          light: "#F8FAFC", // Slate 50
          dark: "#1E293B", // Slate 800
        },
        border: {
          light: "#E2E8F0", // Slate 200
          dark: "#334155", // Slate 700
        },
      },
      borderRadius: {
        "4xl": "32px",
        "5xl": "40px",
      },
      spacing: {
        "18": "72px",
      },
      boxShadow: {
        premium: "0 10px 25px -5px rgba(32, 138, 239, 0.3)",
      }
    },
  },
  plugins: [],
};
