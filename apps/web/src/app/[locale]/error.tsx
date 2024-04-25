"use client";

import { Button } from "@tietokilta/ui";
import { useI18n } from "../../locales/client";

export const metadata = {
  title: "Jotain meni pieleen",
  description: "Hups, jotain meni pieleen.",
};

function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const i18n = useI18n();

  return (
    <main className="relative mb-8 flex flex-col items-center gap-2 md:gap-6">
      <header className="flex h-[15svh] w-full items-center justify-center bg-gray-900 text-gray-100 md:h-[25svh]">
        <h1 className="font-mono text-4xl md:text-5xl">
          {i18n("headings.general-error")}
        </h1>
      </header>

      <div className="relative m-auto flex max-w-prose flex-col gap-8 p-4 md:p-6">
        <p className="shadow-solid max-w-prose rounded-md border-2 border-gray-900 p-4 md:p-6">
          {i18n("errors.general-error")}
          {i18n("errors.error-code")}{" "}
          <code className="font-mono">{error.digest}</code>.
        </p>
        <Button onClick={reset} type="button">
          {i18n("action.Try again")}
        </Button>
      </div>
    </main>
  );
}

export default Error;
