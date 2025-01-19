"use client";

import { Button, Card } from "@tietokilta/ui";
import {
  I18nProviderClient,
  useCurrentLocale,
  useScopedI18n,
} from "../../../locales/client";

function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useScopedI18n("error");

  return (
    <main className="relative mb-8 flex flex-col items-center gap-2 md:gap-6">
      <header className="flex h-[15svh] w-full items-center justify-center bg-gray-900 p-2 text-gray-100 md:h-[25svh]">
        <h1 className="font-mono text-4xl md:text-5xl">
          {t("Jotain meni pieleen")}
        </h1>
      </header>

      <div className="relative m-auto flex max-w-prose flex-col gap-8 p-4 md:p-6">
        <Card className="max-w-prose">
          <p>
            {t(
              "Oho, nyt meni jotain pieleen. Ota yhteyttä sivuston ylläpitäjään. Virheen tunniste on",
            )}{" "}
            <code className="font-mono">{error.digest}</code>.
          </p>
        </Card>
        <Button onClick={reset} type="button">
          {t("Yritä uudelleen")}
        </Button>
      </div>
    </main>
  );
}
function ErrorWrapper({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = useCurrentLocale();
  return (
    <I18nProviderClient locale={locale}>
      <Error error={error} reset={reset} />
    </I18nProviderClient>
  );
}
export default ErrorWrapper;
