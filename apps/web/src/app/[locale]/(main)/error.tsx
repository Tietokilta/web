"use client";

import { Button, Card } from "@tietokilta/ui";
import { useParams } from "next/navigation";
import { NextIntlClientProvider, useTranslations } from "@locales/client";
import { locales, type Messages } from "@locales/index";
import type { Locale } from "@i18n/routing";

function ErrorContent({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  return (
    <main className="relative mb-8 flex flex-col items-center gap-2 md:gap-6">
      <header className="flex h-[15svh] w-full items-center justify-center bg-gray-900 p-2 text-gray-100 md:h-[25svh]">
        <h1 className="font-mono text-4xl md:text-5xl">
          {t("Something went wrong")}
        </h1>
      </header>

      <div className="relative m-auto flex max-w-prose flex-col gap-8 p-4 md:p-6">
        <Card className="max-w-prose">
          <p>
            {t("errorWithId")} <code className="font-mono">{error.digest}</code>
            .
          </p>
        </Card>
        <Button onClick={reset} type="button">
          {t("Try again")}
        </Button>
      </div>
    </main>
  );
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams<{ locale: Locale }>();
  const locale = params.locale;
  const messages = locales[locale] as Messages;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ErrorContent error={error} reset={reset} />
    </NextIntlClientProvider>
  );
}
