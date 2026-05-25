import { defineComponent, h, type CSSProperties, type PropType } from "vue";

export type LearningArchitectureItem = {
  label: string;
  value: string;
  description: string;
  tone: "coral" | "indigo" | "lime" | "teal";
};

const toneStyles: Record<LearningArchitectureItem["tone"], CSSProperties> = {
  coral: {
    background: "color-mix(in srgb, var(--coral) 14%, var(--surface))",
    color: "var(--coral)",
  },
  indigo: {
    background: "color-mix(in srgb, var(--indigo) 14%, var(--surface))",
    color: "var(--indigo)",
  },
  lime: {
    background: "color-mix(in srgb, var(--lime) 18%, var(--surface))",
    color: "var(--success-ink)",
  },
  teal: {
    background: "color-mix(in srgb, var(--teal) 14%, var(--surface))",
    color: "var(--teal)",
  },
};

const panelStyle: CSSProperties = {
  background: "var(--surface)",
  border: "1px solid var(--line)",
  borderRadius: "8px",
  boxShadow: "0 12px 32px rgb(23 29 38 / 7%)",
  display: "grid",
  gap: "16px",
  marginTop: "24px",
  padding: "18px",
};

const eyebrowStyle: CSSProperties = {
  color: "var(--teal)",
  fontSize: "0.78rem",
  fontWeight: 800,
  textTransform: "uppercase",
};

const badgeStyle: CSSProperties = {
  alignItems: "center",
  borderRadius: "8px",
  display: "inline-flex",
  fontSize: "0.78rem",
  fontWeight: 800,
  justifyContent: "center",
  minHeight: "30px",
  padding: "4px 10px",
  width: "fit-content",
};

export const defaultArchitectureItems: LearningArchitectureItem[] = [
  {
    label: "packages/ui-vue",
    value: "Shared Vue components",
    description: "Reusable presentational pieces that do not know about routes or API calls.",
    tone: "teal",
  },
  {
    label: "apps/web-vue",
    value: "Consumes shared UI",
    description: "The Vite app imports Vue primitives through a workspace alias.",
    tone: "indigo",
  },
  {
    label: "docs + tests",
    value: "Architecture stays reviewable",
    description: "Every migration step carries tests so the Vue parity path remains auditable.",
    tone: "coral",
  },
];

export const LearningArchitecturePanel = defineComponent({
  name: "LearningArchitecturePanel",
  props: {
    eyebrow: {
      type: String,
      required: true,
    },
    headingId: {
      type: String,
      default: "shared-ui-architecture-heading",
    },
    items: {
      type: Array as PropType<LearningArchitectureItem[]>,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    return () =>
      h("section", { "aria-labelledby": props.headingId, style: panelStyle }, [
        h("div", { style: { display: "grid", gap: "8px" } }, [
          h("span", { style: eyebrowStyle }, props.eyebrow),
          h("h2", { id: props.headingId, style: { margin: 0 } }, props.title),
          h(
            "p",
            { style: { color: "var(--muted)", margin: 0, maxWidth: "68ch" } },
            props.summary,
          ),
        ]),
        h(
          "div",
          {
            style: {
              display: "grid",
              gap: "12px",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            },
          },
          props.items.map((item) =>
            h(
              "article",
              {
                key: item.label,
                style: {
                  border: "1px solid var(--line)",
                  borderRadius: "8px",
                  display: "grid",
                  gap: "8px",
                  minHeight: "150px",
                  padding: "14px",
                },
              },
              [
                h("span", { style: { ...badgeStyle, ...toneStyles[item.tone] } }, item.label),
                h("strong", item.value),
                h("p", { style: { color: "var(--muted)", margin: 0 } }, item.description),
              ],
            ),
          ),
        ),
      ]);
  },
});
