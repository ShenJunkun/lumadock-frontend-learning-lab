import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  defaultArchitectureItems,
  LearningArchitecturePanel,
} from "./LearningArchitecturePanel";

const meta = {
  args: {
    eyebrow: "Workspace boundary",
    items: defaultArchitectureItems,
    summary:
      "Shared UI stays presentational so apps can compose it without coupling routes, stores, or API calls.",
    title: "Component package ownership",
  },
  component: LearningArchitecturePanel,
  tags: ["autodocs"],
  title: "Patterns/LearningArchitecturePanel",
} satisfies Meta<typeof LearningArchitecturePanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ResponsivePreview: Story = {
  args: {
    items: [
      ...defaultArchitectureItems,
      {
        description:
          "Storybook documents component states before they enter the product shell.",
        label: "storybook",
        tone: "lime",
        value: "Independent review",
      },
    ],
  },
};
