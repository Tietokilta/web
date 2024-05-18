"use client";

import TiKLogo from "../../assets/TiK-logo-white.png"
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { Logo } from "@tietokilta/cms-types/payload";

export function LogoLink({ locale, image }: { locale: string, image: Logo | string}) {
  const href = `/${locale}`;
  const pathname = usePathname();
  const isActive = pathname === href;
  const logo = image as Logo;
  return (
    <Link
      aria-current={isActive ? "page" : undefined}
      className="rounded-full hover:text-gray-400"
      href={href}
    >
      <Image
        alt="Tietokilta"
        className="w-20 h-20 p-2"
        priority
        width={logo?.width ?? undefined}
        height={logo?.height ?? undefined}
        src={logo?.url ?? TiKLogo}
      />
    </Link>
  );
}
