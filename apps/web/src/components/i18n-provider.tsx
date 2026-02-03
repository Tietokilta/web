"use client";

import type { AbstractIntlMessages } from "next-intl";
import { NextIntlClientProvider, type Locale } from "@locales/client";

export default function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: AbstractIntlMessages;
  children: React.ReactNode;
}) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
