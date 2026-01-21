"use client";
import { Button, Card } from "@tietokilta/ui";
import Link from "next/link";
import { DinoGame } from "@components/dino-game";
import { useTranslations } from "next-intl";

export default function EventNotFound() {
  const t = useTranslations("not-found");
  return (
    <main
      id="main"
      className="relative mb-8 flex flex-col items-center gap-2 md:gap-6"
    >
      <header className="flex h-[15svh] w-full items-center justify-center bg-gray-900 p-2 text-gray-100 md:h-[25svh]">
        <h1 className="font-mono text-4xl md:text-5xl">
          404 - {t("Tapahtumaa ei löytynyt")}
        </h1>
      </header>

      <div className="relative m-auto flex max-w-prose flex-col gap-8 p-4 md:p-6">
        <Card className="max-w-prose">
          <p>{t("eventNotFoundDescription")}</p>
        </Card>
        <Button asChild variant="link">
          <Link href="/">{t("Tapahtumalistaukseen")}</Link>
        </Button>
        <DinoGame />
      </div>
    </main>
  );
}
