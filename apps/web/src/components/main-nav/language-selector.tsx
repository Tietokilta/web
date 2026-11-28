"use client";

import { NavigationMenuItem, NavigationMenuLink } from "@tietokilta/ui";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { rememberLocale } from "@i18n/locale-cookie";

export function LanguageSelector() {
  const pathname = usePathname();
  const isFinnish = pathname.startsWith("/fi");
  const isEnglish = pathname.startsWith("/en");

  return (
    <ul className="flex items-center gap-5">
      <NavigationMenuItem>
        <NavigationMenuLink active={isFinnish} asChild>
          <NextLink
            className="underline-offset-2 hover:text-gray-400 hover:underline aria-[current=page]:font-bold aria-[current=page]:underline"
            href={pathname.replace(/^\/(?:en|fi)/, "/fi")}
            onClick={() => rememberLocale("fi")}
            prefetch={false}
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
            onClick={() => rememberLocale("en")}
            prefetch={false}
          >
            <span aria-hidden="true">EN</span>
            <span className="sr-only">In English</span>
          </NextLink>
        </NavigationMenuLink>
      </NavigationMenuItem>
    </ul>
  );
}
