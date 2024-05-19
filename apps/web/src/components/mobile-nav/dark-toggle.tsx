"use client";

import { Button, NavigationMenuItem, NavigationMenuLink } from "@tietokilta/ui";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

export function DarkModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant={"secondary"}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="dark:text-dark-text dark:border-dark-fg dark:shadow-dark-fg dark:bg-dark-bg ml-4 mt-4 w-fit"
      suppressHydrationWarning
    >
      {theme === "dark" ? "Light" : "Dark"}
    </Button>
  );
}
