"use client";

import { useTranslations, useLocale, NextIntlClientProvider } from "next-intl";
import { useExtracted } from "next-intl";

// Re-export for convenience
export { useTranslations, useLocale, useExtracted, NextIntlClientProvider };

// Convenience aliases for migration
export const useCurrentLocale = useLocale;
export const useScopedI18n = useTranslations;
export const useI18n = useExtracted;
export const I18nProviderClient = NextIntlClientProvider;
