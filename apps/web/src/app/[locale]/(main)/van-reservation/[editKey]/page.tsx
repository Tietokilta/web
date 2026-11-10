import { type Metadata } from "next";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "@locales/client";
import { getLocale, getTranslations } from "@locales/server";
import { CancelForm } from "./cancel-form";

interface PageProps {
  params: Promise<{ editKey: string }>;
}

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("pakuvaraus.manage");
  return {
    title: t("Your van reservation"),
    robots: { index: false },
  };
};

// Reached from the link in the confirmation email. pakuvaraus cannot look up a
// reservation by its key yet, so this page cannot show the times or status.
export default async function Page(props: PageProps) {
  const { editKey } = await props.params;
  const locale = await getLocale();
  const messages = await getMessages();
  const t = await getTranslations("pakuvaraus.manage");

  return (
    <main
      id="main"
      className="relative mb-8 flex flex-col items-center gap-2 md:gap-6"
    >
      <div className="relative flex w-full max-w-prose flex-col gap-8 p-4 md:p-6">
        <h1 className="font-mono text-2xl md:text-4xl">
          {t("Your van reservation")}
        </h1>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <CancelForm editKey={editKey} />
        </NextIntlClientProvider>
      </div>
    </main>
  );
}
