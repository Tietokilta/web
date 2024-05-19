"use client";

import * as React from "react";
import {
  NavigationMenuItem,
  NavigationMenuLink,
  RenderIcon,
} from "@tietokilta/ui";
import { useTheme } from "next-themes";

export function DarkModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div />;
  }

  return (
    <NavigationMenuItem suppressHydrationWarning>
      <NavigationMenuLink
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="dark:text-dark-text dark:border-dark-fg cursor-pointer select-none"
      >
        <RenderIcon
          name={theme === "dark" ? "Sun" : "Moon"}
          className="dark:text-dark-fg h-6 w-6"
        />
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}
