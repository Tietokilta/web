import { cn } from "../../utils";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";

export type TabsProps = TabsPrimitive.TabsProps;
export type TabsListProps = TabsPrimitive.TabsListProps;
export type TabsContentProps = TabsPrimitive.TabsContentProps;
export type TabsTriggerProps = TabsPrimitive.TabsTriggerProps;

const Tabs = TabsPrimitive.Root;
const TabsList = TabsPrimitive.List;
const TabsContent = TabsPrimitive.Content;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "border-2 border-gray-900 bg-gray-100 px-4 py-1 font-mono font-bold outline-none drop-shadow-[4px_4px_black] first:rounded-l-lg last:rounded-r-lg data-[state=active]:translate-x-1 data-[state=active]:translate-y-1 data-[state=active]:border-l-0 data-[state=active]:border-r-0 data-[state=active]:bg-gray-400 data-[state=active]:drop-shadow-none data-[state=active]:first:border-l-2 data-[state=active]:last:border-r-2",
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };
