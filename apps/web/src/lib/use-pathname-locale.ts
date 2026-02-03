"use client";

import { usePathname } from "next/navigation";
import { routing, type Locale } from "@i18n/routing";

/**
 * Get locale from the URL pathname.
 * Use this in components that are outside NextIntlClientProvider.
 * For components inside the provider, use useLocale() from next-intl.
 */
export function usePathnameLocale(): Locale {
  const pathname = usePathname();
  const localeFromPath = routing.locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );
  return localeFromPath ?? routing.defaultLocale;
}
