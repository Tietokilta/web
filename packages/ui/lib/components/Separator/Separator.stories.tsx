import { Separator } from ".";

import type { Meta, StoryObj } from "@storybook/react";

/**
 * ```typescript
 * import { Separator } from "@tietokilta/ui";
 * ```
 */
const meta = {
  title: "Separator",
  component: Separator,
} satisfies Meta<typeof Separator>;
export default meta;

type Story = StoryObj<typeof Separator>;

export const Default = {
  render: () => (
    <div>
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
        <p className="text-muted-foreground text-sm">
          An open-source UI component library.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  ),
} satisfies Story;
