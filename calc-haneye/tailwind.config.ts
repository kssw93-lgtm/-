import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1B4DFF",
          dark: "#1339C7",
          light: "#EEF2FF",
        },
        ink: {
          DEFAULT: "#171B2B",
          soft: "#4B5163",
          muted: "#6B7280",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          subtle: "#F7F8FA",
        },
        positive: {
          DEFAULT: "#0F9D63",
          light: "#E7F7EF",
        },
        caution: {
          DEFAULT: "#B5690B",
          light: "#FFF4E5",
        },
        danger: {
          DEFAULT: "#D92D20",
          light: "#FEF3F2",
        },
        hairline: "#E7E9EE",
      },
      maxWidth: {
        content: "1160px",
      },
      borderRadius: {
        card: "16px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(23, 27, 43, 0.04), 0 4px 12px rgba(23, 27, 43, 0.06)",
      },
      fontFamily: {
        sans: [
          "Pretendard",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
