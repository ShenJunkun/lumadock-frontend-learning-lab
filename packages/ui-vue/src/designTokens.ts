export const designTokens = {
  color: {
    alertBg: "var(--alert-bg)",
    alertInk: "var(--alert-ink)",
    coral: "var(--coral)",
    ink: "var(--ink)",
    line: "var(--line)",
    muted: "var(--muted)",
    selectedBg: "var(--selected-bg)",
    selectedInk: "var(--selected-ink)",
    successBg: "var(--success-bg)",
    successInk: "var(--success-ink)",
    surface: "var(--surface)",
    teal: "var(--teal)",
  },
  radius: {
    ui: "8px",
  },
  shadow: {
    soft: "0 12px 32px rgb(23 29 38 / 7%)",
  },
  space: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "22px",
  },
} as const;

export type DesignTokens = typeof designTokens;
