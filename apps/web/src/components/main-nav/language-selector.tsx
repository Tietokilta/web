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
      <NavigationMenuItem className="absolute top-0 right-16 flex h-20 items-center justify-center xl:right-24">
        <NavigationMenuLink active={isFinnish} asChild>
          <NextLink
            className="underline-offset-2 hover:text-gray-400 hover:underline aria-[current=page]:font-bold aria-[current=page]:underline"
            href={pathname.replace(/^\/(?:en|fi)/, "/fi")}
            prefetch={false}
          >
            <span aria-hidden="true">FI</span>
            <span className="sr-only">Suomeksi</span>
          </NextLink>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem className="absolute top-0 right-6 flex h-20 items-center justify-center xl:right-12">
        <NavigationMenuLink active={isEnglish} asChild>
          <NextLink
            className="underline-offset-2 hover:text-gray-400 hover:underline aria-[current=page]:font-bold aria-[current=page]:underline"
            href={pathname.replace(/^\/(?:en|fi)/, "/en")}
            prefetch={false}
          >
            <span aria-hidden="true">EN</span>
            <span className="sr-only">In English</span>
          </NextLink>
        </NavigationMenuLink>
      </NavigationMenuItem>
    </>
  );
}
