"use client";
import { Button, Card } from "@tietokilta/ui";
import Link from "next/link";
import { DinoGame } from "@components/dino-game";
import {
  I18nProviderClient,
  useCurrentLocale,
  useScopedI18n,
} from "@locales/client";

function Page() {
  const t = useScopedI18n("not-found");
  return (
    <main
      id="main"
      className="relative mb-8 flex flex-col items-center gap-2 md:gap-6"
    >
      <header className="flex h-[15svh] w-full items-center justify-center bg-gray-900 p-2 text-gray-100 md:h-[25svh]">
        <h1 className="font-mono text-4xl md:text-5xl">
          404 - {t("Page not found")}
        </h1>
      </header>

      <div className="relative m-auto flex max-w-prose flex-col gap-8 p-4 md:p-6">
        <Card className="max-w-prose">
          <p>
            {t("Page not found. Check the URL or return to the front page")}
          </p>
        </Card>
        <Button asChild variant="link">
          <Link href="/">{t("To front page")}</Link>
        </Button>
        <DinoGame />
      </div>
    </main>
  );
}
function PageWrapper() {
  const locale = useCurrentLocale();
  return (
    <I18nProviderClient locale={locale}>
      <Page />
    </I18nProviderClient>
  );
}
export default PageWrapper;
