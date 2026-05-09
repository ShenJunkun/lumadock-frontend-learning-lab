import type { HTMLAttributes } from "react";

import { designTokens } from "./designTokens";

export type EmptyStateProps = HTMLAttributes<HTMLDivElement> & {
  message: string;
  title: string;
};

export function EmptyState({ message, style, title, ...props }: EmptyStateProps) {
  return (
    <div
      style={{
        background: designTokens.color.surface,
        border: `1px solid ${designTokens.color.line}`,
        borderRadius: designTokens.radius.ui,
        color: designTokens.color.muted,
        display: "grid",
        gap: designTokens.space.xs,
        minHeight: 120,
        padding: designTokens.space.lg,
        placeContent: "center",
        textAlign: "center",
        ...style,
      }}
      {...props}
    >
      <strong style={{ color: designTokens.color.ink }}>{title}</strong>
      <span>{message}</span>
    </div>
  );
}
