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
      className={cn(
        "pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] focus-visible:outline-none",
        // The close button is positioned, so padding doesn't move it
        "[&>button]:top-[calc(1rem+env(safe-area-inset-top))] [&>button]:right-[calc(1rem+env(safe-area-inset-right))]",
        className,
      )}
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
