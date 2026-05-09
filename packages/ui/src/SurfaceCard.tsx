import type { HTMLAttributes } from "react";

import { designTokens } from "./designTokens";

export type SurfaceCardProps = HTMLAttributes<HTMLDivElement>;

export function SurfaceCard({ children, style, ...props }: SurfaceCardProps) {
  return (
    <div
      style={{
        background: designTokens.color.surface,
        border: `1px solid ${designTokens.color.line}`,
        borderRadius: designTokens.radius.ui,
        boxShadow: designTokens.shadow.soft,
        padding: designTokens.space.lg,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
