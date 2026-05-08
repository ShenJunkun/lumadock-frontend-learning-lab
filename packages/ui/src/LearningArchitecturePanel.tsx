export type LearningArchitectureItem = {
  label: string;
  value: string;
  description: string;
  tone: "coral" | "indigo" | "lime" | "teal";
};

export type LearningArchitecturePanelProps = {
  eyebrow: string;
  title: string;
  summary: string;
  items: LearningArchitectureItem[];
  headingId?: string;
};

const toneStyles = {
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
} as const;

const panelStyle = {
  background: "var(--surface)",
  border: "1px solid var(--line)",
  borderRadius: 8,
  boxShadow: "0 12px 32px rgb(23 29 38 / 7%)",
  display: "grid",
  gap: 16,
  marginTop: 24,
  padding: 18,
} as const;

const headerStyle = {
  display: "grid",
  gap: 8,
} as const;

const eyebrowStyle = {
  color: "var(--teal)",
  fontSize: "0.78rem",
  fontWeight: 800,
  textTransform: "uppercase",
} as const;

const gridStyle = {
  display: "grid",
  gap: 12,
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
} as const;

const itemStyle = {
  border: "1px solid var(--line)",
  borderRadius: 8,
  display: "grid",
  gap: 8,
  minHeight: 150,
  padding: 14,
} as const;

const badgeStyle = {
  alignItems: "center",
  borderRadius: 8,
  display: "inline-flex",
  fontSize: "0.78rem",
  fontWeight: 800,
  justifyContent: "center",
  minHeight: 30,
  padding: "4px 10px",
  width: "fit-content",
} as const;

export const defaultArchitectureItems: LearningArchitectureItem[] = [
  {
    label: "packages/ui",
    value: "Shared components",
    description: "Reusable presentational pieces that do not know about routes or API calls.",
    tone: "teal",
  },
  {
    label: "apps/web",
    value: "Consumes shared UI",
    description: "The Vite app imports the package through an alias before a full workspace move.",
    tone: "indigo",
  },
  {
    label: "docs + tests",
    value: "Architecture stays reviewable",
    description: "Every P3 step carries docs and tests so the learning path remains auditable.",
    tone: "coral",
  },
];

export function LearningArchitecturePanel({
  eyebrow,
  headingId = "shared-ui-architecture-heading",
  items,
  summary,
  title,
}: LearningArchitecturePanelProps) {
  return (
    <section aria-labelledby={headingId} style={panelStyle}>
      <div style={headerStyle}>
        <span style={eyebrowStyle}>{eyebrow}</span>
        <h2 id={headingId} style={{ margin: 0 }}>
          {title}
        </h2>
        <p style={{ color: "var(--muted)", margin: 0, maxWidth: "68ch" }}>{summary}</p>
      </div>

      <div style={gridStyle}>
        {items.map((item) => (
          <article key={item.label} style={itemStyle}>
            <span style={{ ...badgeStyle, ...toneStyles[item.tone] }}>{item.label}</span>
            <strong>{item.value}</strong>
            <p style={{ color: "var(--muted)", margin: 0 }}>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
