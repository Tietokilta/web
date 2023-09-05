import { Tabs, TabsContent, TabsList, TabsTrigger } from ".";

import type { Meta, StoryFn } from "@storybook/react";

/**
 * ```typescript
 * import { Tabs, TabsList, TabsContent, TabsTrigger } from "@tietokilta/ui";
 * ```
 */
export default {
  title: "Tabs",
  component: Tabs,
} satisfies Meta<typeof Tabs>;

const lorem =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam accumsan nisi a arcu auctor, et placerat massa congue. Sed finibus interdum lectus a semper. Nulla erat leo, fermentum sit amet dolor at, euismod vehicula ex. Duis arcu elit, gravida eu sapien nec, pellentesque commodo massa. Aliquam commodo at elit elementum feugiat. Morbi egestas est id augue ornare, eu auctor tortor ornare. Donec in ipsum augue. Nunc scelerisque erat erat, ut tempor neque luctus quis. Mauris vel ex quis elit mattis mollis porttitor et ligula. Vivamus accumsan nibh tempor tortor tempus luctus. Donec finibus tincidunt sapien, eget hendrerit tellus tincidunt vel. Vivamus vulputate enim vel lorem sagittis mattis. Sed tristique fermentum tortor vitae malesuada.";

const Template: StoryFn<typeof Tabs> = (args) => (
  <Tabs {...args} defaultValue="1">
    <TabsList className="m-2 w-fit">
      <TabsTrigger value="1">Tab 1</TabsTrigger>
      <TabsTrigger value="2">Tab 2</TabsTrigger>
      <TabsTrigger value="3">Tab 3</TabsTrigger>
    </TabsList>
    <TabsContent value="1">
      <h2 className="text-xl">Content 1</h2>
      <p>{lorem}</p>
    </TabsContent>
    <TabsContent value="2">
      <h2 className="text-xl">Content 2</h2>
      <p>{lorem}</p>
    </TabsContent>
    <TabsContent value="3">
      <h2 className="text-xl">Content 3</h2>
      <p>{lorem}</p>
    </TabsContent>
  </Tabs>
);

export const Primary = Template.bind({});
