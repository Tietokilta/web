import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        className={cn(
          "shadow-solid rounded-md border-2 border-gray-900 p-4 md:p-6",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Card.displayName = "Card";

export { Card };
