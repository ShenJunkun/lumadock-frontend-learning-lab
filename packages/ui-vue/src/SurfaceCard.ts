import { defineComponent, h, type CSSProperties, type PropType } from "vue";

import { designTokens } from "./designTokens";

export const SurfaceCard = defineComponent({
  name: "SurfaceCard",
  props: {
    style: {
      type: [Object, String] as PropType<CSSProperties | string>,
      default: undefined,
    },
  },
  setup(props, { attrs, slots }) {
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
              boxShadow: designTokens.shadow.soft,
              padding: designTokens.space.lg,
            },
            props.style,
          ],
        },
        slots.default?.(),
      );
  },
});
