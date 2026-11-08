"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Media } from "@payload-types";
// import TiKLogo from "../../assets/TiK-logo-white.png";
import SyseLogo from "../../assets/syse/syse.png";

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
    <>
      {/* Same destination as the wordmark, so keyboard and screen reader users only get one stop */}
      <Link
        aria-hidden="true"
        className="rounded-full hover:text-gray-400"
        href={href}
        tabIndex={-1}
      >
        {/*
        <Image
          alt=""
          className="size-16 p-2"
          priority
          width={image?.width ? Math.trunc(image.width) : undefined}
          height={image?.height ? Math.trunc(image.height) : undefined}
          src={image?.url ?? TiKLogo}
        />
        */}
        <Image
          alt=""
          className="size-16 p-2"
          priority
          width={image?.width ? Math.trunc(image.width) : undefined}
          height={image?.height ? Math.trunc(image.height) : undefined}
          src={SyseLogo}
        />
      </Link>
      <Link
        aria-current={isActive ? "page" : undefined}
        className="font-mono text-2xl"
        href={href}
      >
        Tietokilta
      </Link>
    </>
  );
}
