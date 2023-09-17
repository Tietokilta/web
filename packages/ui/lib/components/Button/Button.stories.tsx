import { Button } from ".";

import type { Meta, StoryObj } from "@storybook/react";

/**
 * ```typescript
 * import { Button } from "@tietokilta/ui";
 * ```
 */
const meta = {
  title: "Button",
  component: Button,
} satisfies Meta<typeof Button>;
export default meta;

type Story = StoryObj<typeof Button>;

export const Default = {
  args: {
    children: "Button",
  },
} satisfies Story;

export const Destructive = {
  args: {
    ...Default.args,
    variant: "destructive",
  },
} satisfies Story;

export const Secondary = {
  args: {
    ...Default.args,
    variant: "secondary",
  },
} satisfies Story;

export const Outline = {
  args: {
    ...Default.args,
    variant: "outline",
  },
} satisfies Story;

export const Ghost = {
  args: {
    ...Default.args,
    variant: "ghost",
  },
} satisfies Story;

export const Link = {
  args: {
    ...Default.args,
    variant: "link",
  },
} satisfies Story;

export const OutlineLink = {
  args: {
    ...Default.args,
    variant: "outlineLink",
  },
} satisfies Story;
