import type { Meta, StoryObj } from "@storybook/react-vite";

import { EmptyState } from "./EmptyState";

const meta = {
  args: {
    message: "Try another filter or clear the current search.",
    title: "No products found",
  },
  component: EmptyState,
  tags: ["autodocs"],
  title: "Primitives/EmptyState",
} satisfies Meta<typeof EmptyState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Compact: Story = {
  args: {
    message: "The current segment has no records.",
    style: {
      minHeight: 96,
      width: "min(100%, 360px)",
    },
    title: "Nothing to review",
  },
};
