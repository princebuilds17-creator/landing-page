import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#101116",
        background: "#101116",
        surface: {
          DEFAULT: "#1B1C25",
          elevated: "#232533",
          hover: "#2B2E40",
          subtle: "#161720",
        },
        border: {
          subtle: "rgba(255, 255, 255, 0.08)",
          active: "rgba(155, 138, 255, 0.40)",
          DEFAULT: "rgba(255, 255, 255, 0.08)",
        },
        primary: {
          DEFAULT: "#9B8AFF",
          hover: "#8974F8",
          active: "#775DF6",
          subdued: "rgba(155, 138, 255, 0.12)",
          foreground: "#101116",
        },
        secondary: {
          DEFAULT: "#72E6B1",
          hover: "#5FD19E",
          subdued: "rgba(114, 230, 177, 0.12)",
          foreground: "#101116",
        },
        warning: {
          DEFAULT: "#E5C07B",
          subdued: "rgba(229, 192, 123, 0.12)",
        },
        danger: {
          DEFAULT: "#FF6B6B",
          subdued: "rgba(255, 107, 107, 0.12)",
        },
        text: {
          primary: "#F5F5F7",
          secondary: "#9DA3B4",
          muted: "#6B7280",
          inverted: "#101116",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        "display-hero": ["56px", { lineHeight: "64px", letterSpacing: "-0.03em", fontWeight: "700" }],
        "display-hero-mobile": ["36px", { lineHeight: "44px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.02em", fontWeight: "600" }],
        "headline-lg-mobile": ["26px", { lineHeight: "34px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-md": ["24px", { lineHeight: "32px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-sm": ["18px", { lineHeight: "26px", letterSpacing: "0em", fontWeight: "600" }],
        "body-lg": ["16px", { lineHeight: "26px", letterSpacing: "0em", fontWeight: "400" }],
        "body-md": ["14px", { lineHeight: "22px", letterSpacing: "0em", fontWeight: "400" }],
        "body-sm": ["12px", { lineHeight: "18px", letterSpacing: "0.01em", fontWeight: "400" }],
        "label-md": ["14px", { lineHeight: "20px", letterSpacing: "0.01em", fontWeight: "600" }],
        "label-sm": ["12px", { lineHeight: "16px", letterSpacing: "0.02em", fontWeight: "600" }],
        "code-sm": ["12px", { lineHeight: "18px", letterSpacing: "0em", fontWeight: "400" }],
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
