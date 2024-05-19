"use client";

import { NavigationMenuItem, NavigationMenuLink } from "@tietokilta/ui";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

export function LanguageSelector() {
  const pathname = usePathname();
  const isFinnish = pathname.startsWith("/fi");
  const isEnglish = pathname.startsWith("/en");

  return (
    <>
      <NavigationMenuItem>
        <NavigationMenuLink active={isFinnish} asChild>
          <NextLink
            className="underline-offset-2 hover:text-gray-400 hover:underline aria-[current=page]:font-bold aria-[current=page]:underline"
            href={pathname.replace(/^\/(?:en|fi)/, "/fi")}
          >
            <span aria-hidden="true">FI</span>
            <span className="sr-only">Suomeksi</span>
          </NextLink>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink active={isEnglish} asChild>
          <NextLink
            className="underline-offset-2 hover:text-gray-400 hover:underline aria-[current=page]:font-bold aria-[current=page]:underline"
            href={pathname.replace(/^\/(?:en|fi)/, "/en")}
          >
            <span aria-hidden="true">EN</span>
            <span className="sr-only">In English</span>
          </NextLink>
        </NavigationMenuLink>
      </NavigationMenuItem>
    </>
  );
}
