"use client";

import { NavigationMenuItem, NavigationMenuLink } from "@tietokilta/ui";
import type { Media } from "@tietokilta/cms-types/payload";
import NextLink from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCurrentLocale } from "../../locales/client";
import TiKLogo from "../../assets/TiK-logo-white.png";

export function LogoLink({ image }: { image: Media | undefined }) {
  const locale = useCurrentLocale();
  const href = `/${locale}`;
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <NavigationMenuItem>
      <NavigationMenuLink active={isActive} asChild>
        <NextLink className="h-6 rounded-full hover:text-gray-400" href={href}>
          <Image
            alt="Tietokilta"
            className="h-20 w-20 p-2"
            priority
            width={image?.width ? Math.trunc(image.width) : undefined}
            height={image?.height ? Math.trunc(image.height) : undefined}
            src={image?.url ?? TiKLogo}
          />
        </NextLink>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}
