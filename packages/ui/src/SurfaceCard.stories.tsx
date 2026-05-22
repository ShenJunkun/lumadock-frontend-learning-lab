import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./Button";
import { StatusBadge } from "./StatusBadge";
import { SurfaceCard } from "./SurfaceCard";

const meta = {
  component: SurfaceCard,
  tags: ["autodocs"],
  title: "Primitives/SurfaceCard",
} satisfies Meta<typeof SurfaceCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <SurfaceCard style={{ maxWidth: 420 }}>
      <div className="storybook-stack">
        <StatusBadge tone="success">Ready</StatusBadge>
        <div>
          <h3 style={{ margin: "0 0 6px" }}>Shared surface</h3>
          <p style={{ color: "var(--muted)", margin: 0 }}>
            A quiet frame for repeated UI content in the learning workspace.
          </p>
        </div>
        <div className="storybook-row">
          <Button variant="primary">Open</Button>
          <Button variant="ghost">Details</Button>
        </div>
      </div>
    </SurfaceCard>
  ),
};

export const ResponsiveStack: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gap: 12,
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      }}
    >
      {["Preview", "Staging", "Production"].map((label) => (
        <SurfaceCard key={label}>
          <StatusBadge tone={label === "Production" ? "warning" : "accent"}>
            {label}
          </StatusBadge>
          <h3 style={{ margin: "12px 0 6px" }}>{label}</h3>
          <p style={{ color: "var(--muted)", margin: 0 }}>
            Release state remains scannable.
          </p>
        </SurfaceCard>
      ))}
    </div>
  ),
};
