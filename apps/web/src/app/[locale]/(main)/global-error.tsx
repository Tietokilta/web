"use client";

import { Button, Card } from "@tietokilta/ui";
import { NextIntlClientProvider, useTranslations } from "@locales/client";
import { locales } from "@locales/index";

function GlobalErrorContent({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");
  return (
    <body className="font-sans">
      <div className="flex min-h-screen flex-col">
        <main
          id="main"
          className="relative mb-8 flex flex-col items-center gap-2 md:gap-6"
        >
          <header className="flex h-[15svh] w-full items-center justify-center bg-gray-900 p-2 text-gray-100 md:h-[25svh]">
            <h1 className="font-mono text-4xl hyphens-auto md:text-5xl">
              {t("Something went wrong")}
            </h1>
          </header>

          <div className="relative m-auto flex max-w-prose flex-col gap-8 p-4 md:p-6">
            <Card className="max-w-prose">
              <p>
                {t("errorWithId")}{" "}
                <code className="font-mono">{error.digest}</code>.
              </p>
            </Card>
            <Button onClick={reset} type="button">
              {t("Try again")}
            </Button>
          </div>
        </main>
      </div>
    </body>
  );
}

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Global error replaces the layout, so we need to manually provide messages
  // Default to Finnish as the fallback locale
  const locale = "fi";
  const messages = locales[locale];

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <html lang={locale}>
        <GlobalErrorContent error={error} reset={reset} />
      </html>
    </NextIntlClientProvider>
  );
}
