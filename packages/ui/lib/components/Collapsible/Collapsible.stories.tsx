import { Collapsible, CollapsibleContent, CollapsibleTrigger } from ".";

import { ChevronsUpDownIcon } from "../../icons";
import { Button } from "../Button";

import type { Meta, StoryObj } from "@storybook/react";

/**
 * ```typescript
 * import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@tietokilta/ui";
 * ```
 */
const meta = {
  title: "Collapsible",
  component: Collapsible,
} satisfies Meta<typeof Collapsible>;
export default meta;

type Story = StoryObj<typeof Collapsible>;

export const Default = {
  render: () => (
    <Collapsible className="w-[350px] space-y-2 rounded-md border border-gray-900 bg-gray-100 p-1">
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="flex w-full items-center justify-between"
        >
          <span>Can I use this in my project?</span>
          <ChevronsUpDownIcon className="h-4 w-4" />
          <span className="sr-only">Toggle</span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-2">
        Yes. Free to use for personal and commercial projects. No attribution
        required.
      </CollapsibleContent>
    </Collapsible>
  ),
} satisfies Story;
