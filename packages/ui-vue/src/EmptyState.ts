import { defineComponent, h, type CSSProperties, type PropType } from "vue";

import { designTokens } from "./designTokens";

export const EmptyState = defineComponent({
  name: "EmptyState",
  props: {
    message: {
      type: String,
      required: true,
    },
    style: {
      type: [Object, String] as PropType<CSSProperties | string>,
      default: undefined,
    },
    title: {
      type: String,
      required: true,
    },
  },
  setup(props, { attrs }) {
    return () =>
      h(
        "div",
        {
          ...attrs,
          style: [
            {
              background: designTokens.color.surface,
              border: `1px solid ${designTokens.color.line}`,
              borderRadius: designTokens.radius.ui,
              color: designTokens.color.muted,
              display: "grid",
              gap: designTokens.space.xs,
              minHeight: "120px",
              padding: designTokens.space.lg,
              placeContent: "center",
              textAlign: "center",
            },
            props.style,
          ],
        },
        [
          h("strong", { style: { color: designTokens.color.ink } }, props.title),
          h("span", props.message),
        ],
      );
  },
});
