"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Media } from "@payload-types";
import TiKLogo from "../../assets/TiK-logo-white.png";

export function LogoLink({
  locale,
  image,
}: {
  locale: string;
  image: Media | undefined;
}) {
  const href = `/${locale}`;
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      aria-current={isActive ? "page" : undefined}
      className="rounded-full hover:text-gray-400"
      href={href}
    >
      <Image
        alt="Tietokilta"
        className="size-16 p-2"
        priority
        width={image?.width ? Math.trunc(image.width) : undefined}
        height={image?.height ? Math.trunc(image.height) : undefined}
        src={image?.url ?? TiKLogo}
      />
    </Link>
  );
}
