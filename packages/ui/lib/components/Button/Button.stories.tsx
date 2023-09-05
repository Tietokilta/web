import { Button } from ".";

import type { Meta, StoryFn } from "@storybook/react";

/**
 * ```typescript
 * import { Button } from "@tietokilta/ui";
 * ```
 */
export default {
  title: "Button",
  component: Button,
} as Meta<typeof Button>;

const Template: StoryFn<typeof Button> = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: "Button",
};

export const Destructive = Template.bind({});
Destructive.args = {
  ...Default.args,
  variant: "destructive",
};

export const Secondary = Template.bind({});
Secondary.args = {
  ...Default.args,
  variant: "secondary",
};

export const Outline = Template.bind({});
Outline.args = {
  ...Default.args,
  variant: "outline",
};

export const Ghost = Template.bind({});
Ghost.args = {
  ...Default.args,
  variant: "ghost",
};

export const Link = Template.bind({});
Link.args = {
  ...Default.args,
  variant: "link",
};

export const OutlineLink = Template.bind({});
OutlineLink.args = {
  ...Default.args,
  variant: "outlineLink",
};
