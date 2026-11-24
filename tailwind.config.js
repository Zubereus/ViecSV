/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Be Vietnam Pro"', "system-ui", "-apple-system", "sans-serif"],
        display: ['"Lexend"', '"Be Vietnam Pro"', "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#f0f7f4",
          100: "#dcf0e7",
          200: "#bae0d2",
          500: "#1e6b54",
          600: "#144e3b",
          700: "#0f3d2e", // primary brand color
          800: "#0b2c21",
          900: "#071c15",
          accent: "#d97706", // warm amber accent
          "accent-hover": "#b45309",
          "accent-light": "#fef3c7",
          "accent-dark": "#78350f",
        },
        surface: {
          ground: "#fbfbfa",
          card: "#ffffff",
          subtle: "#f4f5f1",
          muted: "#e9eae5",
        },
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(15, 61, 46, 0.04), 0 1px 2px -1px rgba(15, 61, 46, 0.04)",
        elevated: "0 4px 12px -2px rgba(15, 61, 46, 0.06), 0 2px 6px -1px rgba(15, 61, 46, 0.04)",
        dropdown: "0 10px 25px -3px rgba(15, 61, 46, 0.08), 0 4px 6px -2px rgba(15, 61, 46, 0.03)",
      },
    },
  },
  plugins: [],
};
