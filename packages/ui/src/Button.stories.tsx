import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./Button";

const meta = {
  args: {
    children: "Reserve demo",
  },
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Primitives/Button",
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
  },
};

export const StateMatrix: Story = {
  render: () => (
    <div className="storybook-stack">
      <div className="storybook-row">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
      <div className="storybook-row">
        <Button disabled variant="primary">
          Disabled
        </Button>
        <Button icon={<span aria-hidden="true">+</span>} variant="secondary">
          With icon
        </Button>
      </div>
    </div>
  ),
};
