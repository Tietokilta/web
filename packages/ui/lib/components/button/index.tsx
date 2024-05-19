import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../utils";

/**
 * Adds button styles to any component, for use with Next.js <Link /> components.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-mono text-sm font-bold ring-offset-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-2 border-gray-900 bg-primary-500 text-primary-900 shadow-solid hover:bg-primary-600/90",
        destructive:
          "border-2 border-gray-900 bg-danger-500 text-danger-100 shadow-solid hover:bg-danger-500/90",
        outline:
          "border-2 border-gray-900 hover:border-gray-800 hover:bg-gray-300/90 hover:text-gray-800",
        secondary:
          "border-2 border-gray-900 bg-gray-200 text-gray-800 shadow-solid hover:bg-gray-300/80",
        ghost: "hover:bg-gray-100",
        link: "after:content-alt-empty aria-[current='page']:after:content-alt-empty justify-between rounded-none border-b-2 border-gray-900 text-gray-900 after:ml-2 after:content-['>>'] hover:after:translate-x-1 aria-[current='page']:shadow-underline aria-[current='page']:after:content-['xx'] aria-[current='page']:hover:after:translate-x-0",
        backLink:
          "before:content-alt-empty aria-[current='page']:before:content-alt-empty aria-[current='page']:hover:before:translate-x-0 justify-between rounded-none text-gray-900 before:mr-2 before:content-['<<'] hover:before:-translate-x-1 aria-[current='page']:shadow-underline aria-[current='page']:before:content-['xx']",
        outlineLink:
          "border-2 border-gray-900 shadow-solid hover:border-gray-800 hover:bg-gray-300/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
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
