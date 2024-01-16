"use client";

import { TikLogo } from "@tietokilta/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function LogoLink({ locale }: { locale: string }) {
  const href = `/${locale}`;
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      aria-current={isActive ? "page" : undefined}
      className="rounded-full hover:text-gray-400"
      href={href}
    >
      <TikLogo className="h-16 w-16" />
    </Link>
  );
}
