import type { Meta, StoryObj } from "@storybook/react-vite";

import { StatusBadge } from "./StatusBadge";

const meta = {
  args: {
    children: "Ready",
    tone: "neutral",
  },
  component: StatusBadge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Primitives/StatusBadge",
} satisfies Meta<typeof StatusBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Neutral: Story = {};

export const ToneMatrix: Story = {
  render: () => (
    <div className="storybook-row">
      <StatusBadge tone="neutral">Neutral</StatusBadge>
      <StatusBadge tone="accent">Accent</StatusBadge>
      <StatusBadge tone="success">Success</StatusBadge>
      <StatusBadge tone="warning">Warning</StatusBadge>
    </div>
  ),
};
