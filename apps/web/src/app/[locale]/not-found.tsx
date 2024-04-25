import { Button } from "@tietokilta/ui";
import Link from "next/link";
import { DinoGame } from "../../components/dino-game";
import { getI18n } from "../../locales/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  description: "Sivua ei löytynyt.",
};

async function Page() {
  const t = await getI18n();

  return (
    <main className="relative mb-8 flex flex-col items-center gap-2 md:gap-6">
      <title>{t("headings.404")}</title>
      <header className="flex h-[15svh] w-full items-center justify-center bg-gray-900 text-gray-100 md:h-[25svh]">
        <h1 className="font-mono text-4xl md:text-5xl">{t("headings.404")}</h1>
      </header>

      <div className="relative m-auto flex max-w-prose flex-col gap-8 p-4 md:p-6">
        <p className="shadow-solid max-w-prose rounded-md border-2 border-gray-900 p-4 md:p-6">
          {t("errors.page-not-found")}
        </p>
        <Button asChild variant="link">
          <Link href="/">{t("action.To the front page")}</Link>
        </Button>
        <DinoGame />
      </div>
    </main>
  );
}

export default Page;
