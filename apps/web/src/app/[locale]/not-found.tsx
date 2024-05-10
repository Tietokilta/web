"use client";
import { Button } from "@tietokilta/ui";
import Link from "next/link";
import { DinoGame } from "../../components/dino-game";
import {
  I18nProviderClient,
  useCurrentLocale,
  useScopedI18n,
} from "../../locales/client";

function Page() {
  const t = useScopedI18n("not-found");
  return (
    <main className="relative mb-8 flex flex-col items-center gap-2 md:gap-6">
      <header className="flex h-[15svh] w-full items-center justify-center bg-gray-900 text-gray-100 md:h-[25svh]">
        <h1 className="font-mono text-4xl md:text-5xl">
          404 - {t("Sivua ei löytynyt")}
        </h1>
      </header>

      <div className="relative m-auto flex max-w-prose flex-col gap-8 p-4 md:p-6">
        <p className="shadow-solid max-w-prose rounded-md border-2 border-gray-900 p-4 md:p-6">
          {t("Sivua ei löytynyt. Tarkista osoite tai palaa etusivulle.")}
        </p>
        <Button asChild variant="link">
          <Link href="/">{t("Etusivulle")}</Link>
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
