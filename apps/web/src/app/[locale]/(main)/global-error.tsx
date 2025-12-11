"use client";

import { Button, Card } from "@tietokilta/ui";
import { NextIntlClientProvider, useLocale, useTranslations } from "@locales/client";

function GlobalError({
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
            <h1 className="font-mono text-4xl md:text-5xl">
              {t("Jotain meni pieleen")}
            </h1>
          </header>

          <div className="relative m-auto flex max-w-prose flex-col gap-8 p-4 md:p-6">
            <Card className="max-w-prose">
              <p>
                {t(
                  "Oho, nyt meni jotain pahasti pieleen. Ota yhteyttä sivuston ylläpitäjään. Virheen tunniste on",
                )}{" "}
                <code className="font-mono">{error.digest}</code>.
              </p>
            </Card>
            <Button onClick={reset} type="button">
              {t("Yritä uudelleen")}
            </Button>
          </div>
        </main>
      </div>
    </body>
  );
}
function GlobalErrorWrapper({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = useLocale();
  return (
    <NextIntlClientProvider locale={locale}>
      <html lang={locale}>
        <GlobalError error={error} reset={reset} />
      </html>
    </NextIntlClientProvider>
  );
}
export default GlobalErrorWrapper;
