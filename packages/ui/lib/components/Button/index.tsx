import { cn } from "../../utils";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

/**
 * Adds button styles to any component, for use with Next.js <Link /> components.
 */
const buttonVariants = cva(
  "inline-flex font-mono items-center justify-center rounded-md text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-gray-100",
  {
    variants: {
      variant: {
        default:
          "border-2 border-gray-900 bg-primary-500 text-primary-900 hover:bg-primary-600/90 shadow-solid",
        destructive:
          "border-2 border-gray-900 bg-danger-500 text-danger-100 hover:bg-danger-500/90 shadow-solid",
        outline:
          "border-2 border-gray-900 hover:border-gray-800 hover:bg-gray-300/90 hover:text-gray-800",
        secondary:
          "border-2 border-gray-900 bg-gray-200 text-gray-800 hover:bg-gray-300/80 shadow-solid",
        ghost: "hover:bg-gray-100",
        link: "justify-between border-b-2 border-gray-900 rounded-none text-gray-900 after:content-['>>'] after:ml-2 hover:after:translate-x-1 aria-[current='page']:after:content-['xx'] aria-[current='page']:hover:after:translate-x-0",
        outlineLink:
          "border-2 border-gray-900 hover:border-gray-800 hover:bg-gray-300/90 shadow-solid",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot : "button";
    return (
      <Component
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
