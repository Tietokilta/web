"use client";

import { NavigationMenuItem, NavigationMenuLink } from "@tietokilta/ui";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

export function DarkModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <NavigationMenuItem className="absolute left-16 top-0 flex h-20 items-center justify-center xl:left-24">
      <NavigationMenuLink
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="dark:text-dark-text dark:border-dark-fg cursor-pointer select-none"
      >
        {theme === "dark" ? "Light" : "Dark"}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}
