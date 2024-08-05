import * as React from "react";
import { cn } from "../../utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border-2 border-gray-900 bg-gray-100 px-3 py-2 text-sm ring-offset-gray-800 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export type CheckboxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
>;

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      type="checkbox"
      className={cn(
        "peer size-4 shrink-0 cursor-pointer rounded border border-gray-900 accent-gray-900 ring-offset-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-gray-900 data-[state=checked]:text-gray-100",
        className,
      )}
      {...props}
    />
  ),
);
Checkbox.displayName = "Checkbox";

type RadioProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">;

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      type="radio"
      className={cn(
        "peer size-4 shrink-0 cursor-pointer rounded border border-gray-900 accent-gray-900 ring-offset-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-gray-900 data-[state=checked]:text-gray-100",
        className,
      )}
      {...props}
    />
  ),
);
Radio.displayName = "Radio";

export { Input, Checkbox, Radio };
