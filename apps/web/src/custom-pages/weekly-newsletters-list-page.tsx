import { notFound } from "next/navigation";
import Link from "next/link";
import { FileIcon } from "@tietokilta/ui";
import { type Node } from "@lexical-types";
import { fetchWeeklyNewsletters } from "../lib/api/weekly-newsletters";
import { getCurrentLocale, getScopedI18n } from "../locales/server";
import { lexicalNodeToTextContent } from "../lib/utils";

export default async function Page() {
  const locale = await getCurrentLocale();
  const t = await getScopedI18n("weeklyNewsletter");
  const weeklyNewsletters = await fetchWeeklyNewsletters({ locale });

  if (!weeklyNewsletters || weeklyNewsletters.length === 0) {
    return notFound();
  }

  return (
    <main
      id="main"
      className="relative mb-8 flex flex-col items-center gap-2 md:gap-6"
    >
      <div className="relative m-auto flex max-w-full flex-col gap-8 p-4 md:p-6">
        <div className="max-w-4xl space-y-4 md:my-8 md:space-y-8">
          <h1 className="text-4xl font-bold">{t("title")}</h1>
          {weeklyNewsletters.map((newsletter) => (
            <Link
              className="not-prose hover:bg-gray-300/90 my-4 flex w-fit items-center gap-4 rounded-md border-2 border-gray-900 p-4 shadow-solid hover:border-gray-800"
              data-relation
              href={`/${locale}/${t("path")}/${newsletter.slug ?? "#no-path"}`}
              key={newsletter.id}
            >
              <FileIcon className="size-6" />
              <p className="flex flex-col">
                <span className="font-mono font-semibold">
                  {newsletter.title}
                </span>
                <span className="line-clamp-2 max-w-80 text-sm text-gray-700">
                  {lexicalNodeToTextContent(newsletter.greetings.root as Node)}
                </span>
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
