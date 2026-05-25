import { defineComponent, h, type CSSProperties, type PropType } from "vue";

import { designTokens } from "./designTokens";

export type StatusBadgeTone = "accent" | "neutral" | "success" | "warning";

const toneStyles: Record<StatusBadgeTone, CSSProperties> = {
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
};

export const StatusBadge = defineComponent({
  name: "StatusBadge",
  props: {
    style: {
      type: [Object, String] as PropType<CSSProperties | string>,
      default: undefined,
    },
    tone: {
      type: String as PropType<StatusBadgeTone>,
      default: "neutral",
    },
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        "span",
        {
          ...attrs,
          "data-tone": props.tone,
          style: [
            {
              alignItems: "center",
              borderRadius: designTokens.radius.ui,
              display: "inline-flex",
              fontSize: "0.78rem",
              fontWeight: 800,
              justifyContent: "center",
              minHeight: "30px",
              padding: "4px 10px",
              textTransform: "uppercase",
              width: "fit-content",
            },
            toneStyles[props.tone],
            props.style,
          ],
        },
        slots.default?.(),
      );
  },
});
