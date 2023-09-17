import { ScrollArea } from ".";

import { Separator } from "../Separator";

import * as React from "react";

import type { Meta, StoryObj } from "@storybook/react";

/**
 * ```typescript
 * import { ScrollArea } from "@tietokilta/ui";
 * ```
 */
const meta = {
  title: "ScrollArea",
  component: ScrollArea,
} satisfies Meta<typeof ScrollArea>;
export default meta;

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v0.0.0-dev.${a.length - i}`,
);

type Story = StoryObj<typeof ScrollArea>;

export const Default = {
  render: () => (
    <ScrollArea className="h-72 w-48 rounded-md border-2 border-gray-900 bg-gray-100">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {tags.map((tag) => (
          <React.Fragment key={tag}>
            <div className="font-mono text-sm" key={tag}>
              {tag}
            </div>
            <Separator className="my-2" />
          </React.Fragment>
        ))}
      </div>
    </ScrollArea>
  ),
} satisfies Story;
