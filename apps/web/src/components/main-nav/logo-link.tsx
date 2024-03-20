"use client";

import {
  NavigationMenuItem,
  NavigationMenuLink,
  TikLogo,
} from "@tietokilta/ui";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useCurrentLocale } from "../../locales/client";

export function LogoLink() {
  const locale = useCurrentLocale();
  const href = `/${locale}`;
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <NavigationMenuItem>
      <NavigationMenuLink active={isActive} asChild>
        <NextLink className="rounded-full hover:text-gray-400" href={href}>
          <TikLogo className="h-20 w-20" />
        </NextLink>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}
