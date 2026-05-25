import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,vue}",
    "../../packages/ui-vue/src/**/*.ts",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        coral: "var(--coral)",
        indigo: "var(--indigo)",
        ink: "var(--ink)",
        line: "var(--line)",
        muted: "var(--muted)",
        surface: "var(--surface)",
        "surface-strong": "var(--surface-strong)",
        teal: "var(--teal)",
      },
      boxShadow: {
        soft: "var(--shadow)",
      },
      borderRadius: {
        ui: "8px",
      },
      maxWidth: {
        page: "1180px",
      },
      screens: {
        xs: "420px",
      },
    },
  },
  plugins: [],
} satisfies Config;
