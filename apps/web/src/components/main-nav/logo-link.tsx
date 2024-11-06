"use client";

import { NavigationMenuItem, NavigationMenuLink } from "@tietokilta/ui";
import Image from "next/image";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { usePathnameLocale } from "@lib/use-pathname-locale";
import type { Media } from "@payload-types";
import SyseLogo from "../../assets/syse/syse.png";

export function LogoLink({ image }: { image: Media | undefined }) {
  const locale = usePathnameLocale();
  const href = `/${locale}`;
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <NavigationMenuItem>
      <NavigationMenuLink active={isActive} asChild>
        <NextLink className="h-6 rounded-full hover:text-gray-400" href={href}>
          {/*
          <Image
            alt="Tietokilta"
            className="size-20 p-2"
            priority
            width={image?.width ? Math.trunc(image.width) : undefined}
            height={image?.height ? Math.trunc(image.height) : undefined}
            src={image?.url ?? TiKLogo}
          />
          */}
          <Image
            alt="SystemSeven"
            className="size-20 p-2"
            priority
            width={image?.width ? Math.trunc(image.width) : undefined}
            height={image?.height ? Math.trunc(image.height) : undefined}
            src={SyseLogo}
          />
        </NextLink>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}
