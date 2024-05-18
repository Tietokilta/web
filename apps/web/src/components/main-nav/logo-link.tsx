"use client";

import {
  NavigationMenuItem,
  NavigationMenuLink,
} from "@tietokilta/ui";
import type { Logo } from "@tietokilta/cms-types/payload";
import NextLink from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCurrentLocale } from "../../locales/client";
import TiKLogo from "../../assets/TiK-logo-white.png"

export function LogoLink({ image }: { image: Logo | string }) {
  const locale = useCurrentLocale();
  const href = `/${locale}`;
  const pathname = usePathname();
  const isActive = pathname === href;
  const logo = image as Logo;
  return (
    <NavigationMenuItem>
      <NavigationMenuLink active={isActive} asChild>
        <NextLink className="rounded-full hover:text-gray-400" href={href}>
          <Image
            alt="Tietokilta"
            className="w-20 h-20 p-2"
            priority
            width={logo?.width ?? undefined}
            height={logo?.height ?? undefined}
            src={logo?.url ?? TiKLogo}
          />
        </NextLink>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}
