"use client";

import { SheetClose } from "@tietokilta/ui";
import NextLink, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import type { HTMLProps } from "react";

export function Link({
  href,
  ...props
}: Omit<LinkProps & HTMLProps<HTMLAnchorElement>, "ref">) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <SheetClose asChild>
      <NextLink
        aria-current={isActive ? "page" : undefined}
        href={href}
        {...props}
      />
    </SheetClose>
  );
}
