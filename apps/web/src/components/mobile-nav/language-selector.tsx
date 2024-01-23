"use client";

import { SheetClose } from "@tietokilta/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function LanguageSelector() {
  const pathname = usePathname();
  const isFinnish = pathname.startsWith("/fi");
  const isEnglish = pathname.startsWith("/en");

  return (
    <div className="flex items-center gap-6 px-4 pt-4 text-lg font-medium">
      <SheetClose asChild>
        <Link
          aria-current={isFinnish ? "page" : undefined}
          className="underline-offset-2 hover:underline aria-[current=page]:font-bold aria-[current=page]:underline"
          href={pathname.replace(/^\/(?:en|fi)/, "/fi")}
        >
          FI
        </Link>
      </SheetClose>
      <SheetClose asChild>
        <Link
          aria-current={isEnglish ? "page" : undefined}
          className="underline-offset-2 hover:underline aria-[current=page]:font-bold aria-[current=page]:underline"
          href={pathname.replace(/^\/(?:en|fi)/, "/en")}
        >
          EN
        </Link>
      </SheetClose>
    </div>
  );
}
