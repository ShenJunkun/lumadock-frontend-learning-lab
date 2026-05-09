import type { ButtonHTMLAttributes, ReactNode } from "react";

import { designTokens } from "./designTokens";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
};

const variantStyles = {
  ghost: {
    background: "transparent",
    borderColor: "transparent",
    color: designTokens.color.teal,
  },
  primary: {
    background: designTokens.color.ink,
    borderColor: designTokens.color.ink,
    color: "var(--bg)",
  },
  secondary: {
    background: designTokens.color.surface,
    borderColor: designTokens.color.line,
    color: designTokens.color.ink,
  },
} as const;

export function Button({
  children,
  icon,
  style,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      style={{
        alignItems: "center",
        border: "1px solid",
        borderRadius: designTokens.radius.ui,
        display: "inline-flex",
        fontWeight: 800,
        gap: designTokens.space.sm,
        justifyContent: "center",
        minHeight: 44,
        padding: "10px 16px",
        ...variantStyles[variant],
        ...style,
      }}
      {...props}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}
