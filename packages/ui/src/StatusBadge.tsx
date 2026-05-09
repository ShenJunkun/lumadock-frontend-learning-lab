import type { HTMLAttributes } from "react";

import { designTokens } from "./designTokens";

export type StatusBadgeTone = "accent" | "neutral" | "success" | "warning";

export type StatusBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: StatusBadgeTone;
};

const toneStyles = {
  accent: {
    background: "color-mix(in srgb, var(--teal) 14%, var(--surface))",
    color: designTokens.color.teal,
  },
  neutral: {
    background: "var(--surface-strong)",
    color: designTokens.color.muted,
  },
  success: {
    background: designTokens.color.successBg,
    color: designTokens.color.successInk,
  },
  warning: {
    background: designTokens.color.alertBg,
    color: designTokens.color.alertInk,
  },
} as const;

export function StatusBadge({
  children,
  style,
  tone = "neutral",
  ...props
}: StatusBadgeProps) {
  return (
    <span
      data-tone={tone}
      style={{
        alignItems: "center",
        borderRadius: designTokens.radius.ui,
        display: "inline-flex",
        fontSize: "0.78rem",
        fontWeight: 800,
        justifyContent: "center",
        minHeight: 30,
        padding: "4px 10px",
        textTransform: "uppercase",
        width: "fit-content",
        ...toneStyles[tone],
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  );
}
