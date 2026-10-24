import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#fdfcf8",
          100: "#f8f5ec",
          200: "#f0ebdc",
        },
        forest: {
          50: "#f1f5f0",
          100: "#dde8da",
          500: "#4a6b47",
          600: "#3c5839",
          700: "#2f452d",
          800: "#243621",
        },
        clay: {
          400: "#c08457",
          500: "#a86d43",
          600: "#8a5733",
        },
        ink: "#2b2a26",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        container: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
