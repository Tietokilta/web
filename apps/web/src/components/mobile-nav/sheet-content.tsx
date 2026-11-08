"use client";

import { SheetContent } from "@tietokilta/ui";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../../lib/utils";

export function MobileNavSheetContent({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof SheetContent>) {
  return (
    <SheetContent
      className={cn("focus-visible:outline-none", className)}
      // Radix skips links when picking what to focus, which would start
      // keyboard users in the middle of the menu. Start from the panel.
      onOpenAutoFocus={(event) => {
        event.preventDefault();
        (event.currentTarget as HTMLElement).focus();
      }}
      {...props}
    />
  );
}
