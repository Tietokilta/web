"use client";
import { Button, Card } from "@tietokilta/ui";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DinoGame } from "@components/dino-game";
import { NextIntlClientProvider, useTranslations } from "@locales/client";
import { locales, type Messages } from "@locales/index";
import type { Locale } from "@i18n/routing";

function NotFoundContent() {
  const t = useTranslations("not-found");
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
          <p>{t("pageNotFoundDescription")}</p>
        </Card>
        <Button asChild variant="link">
          <Link href="/">{t("To front page")}</Link>
        </Button>
        <DinoGame />
      </div>
    </main>
  );
}

export default function Page() {
  const params = useParams<{ locale: Locale }>();
  const locale = params.locale;
  const messages = locales[locale] as Messages;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <NotFoundContent />
    </NextIntlClientProvider>
  );
}
