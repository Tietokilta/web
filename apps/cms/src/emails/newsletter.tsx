import * as React from "react";
import {
  type NewsItem,
  type WeeklyNewsletter,
} from "@tietokilta/cms-types/payload";
import { type EditorState } from "@tietokilta/cms-types/lexical";
import { formatDateYear, isThisWeek, type TocItem } from "./utils/utils";
import {
  Calendar,
  Greetings,
  NewsletterCategory,
  TableOfContents,
} from "./helper-components";

interface NewsletterEmailProps {
  newsletter: WeeklyNewsletter;
  locale: "en" | "fi";
  PUBLIC_LEGACY_URL: string;
  PUBLIC_FRONTEND_URL: string;
}

export const Newsletter = ({
  newsletter,
  locale,
  PUBLIC_LEGACY_URL,
  PUBLIC_FRONTEND_URL,
}: NewsletterEmailProps): React.ReactElement => {
  const t = {
    en: {
      calendar: "Calendar",
      guild: "Guild",
      "ayy-aalto": "Ayy & Aalto",
      other: "Other",
      "bottom-corner": "Bottom Corner",
      read: "Read",
      path: "weekly-newsletters",
      "old-link": "old weekly newsletters",
      "super-old-link": "very old weekly newsletters",
      summary: "Table of Contents",
    },
    fi: {
      calendar: "Kalenteri",
      guild: "Kilta",
      "ayy-aalto": "Ayy & Aalto",
      other: "Muut",
      "bottom-corner": "Pohjanurkkaus",
      read: "Lue",
      path: "viikkotiedotteet",
      "old-link": "vanhoja viikkotiedotteita",
      "super-old-link": "erittäin vanhoja viikkotiedotteita",
      summary: "Sisällysluettelo",
    },
  };

  const greetings = newsletter.greetings as unknown as EditorState | undefined;

  const allNewsItems =
    newsletter.newsItems?.map((item) => item.newsItem as NewsItem) ?? [];

  const guildNewsItems = allNewsItems.filter(
    (newsItem) => newsItem.newsItemCategory === "guild",
  );
  const ayyAaltoNewsItems = allNewsItems.filter(
    (newsItem) => newsItem.newsItemCategory === "ayy-aalto",
  );
  const otherNewsItems = allNewsItems.filter(
    (newsItem) => newsItem.newsItemCategory === "other",
  );
  const bottomCornerNewsItems = allNewsItems.filter(
    (newsItem) => newsItem.newsItemCategory === "bottom-corner",
  );

  const eventsThisWeek = allNewsItems.filter(
    (newsItem) => newsItem.date && isThisWeek(newsItem.date),
  );
  const eventsNextWeek = allNewsItems.filter(
    (newsItem) => newsItem.date && !isThisWeek(newsItem.date),
  );
  const signupsThisWeek = allNewsItems.filter(
    (newsItem) =>
      newsItem.signupStartDate && isThisWeek(newsItem.signupStartDate),
  );
  const toc: TocItem[] = [
    eventsThisWeek.length > 0 ||
    eventsNextWeek.length > 0 ||
    signupsThisWeek.length > 0
      ? { text: t[locale].calendar, children: [] }
      : null,
    guildNewsItems.length > 0
      ? {
          text: t[locale].guild,
          children: guildNewsItems.map((newsItem) => ({
            text: newsItem.title,
          })),
        }
      : null,
    ayyAaltoNewsItems.length > 0
      ? {
          text: t[locale]["ayy-aalto"],
          children: ayyAaltoNewsItems.map((newsItem) => ({
            text: newsItem.title,
          })),
        }
      : null,
    otherNewsItems.length > 0
      ? {
          text: t[locale].other,
          children: otherNewsItems.map((newsItem) => ({
            text: newsItem.title,
          })),
        }
      : null,
    bottomCornerNewsItems.length > 0
      ? {
          text: t[locale]["bottom-corner"],
          children: bottomCornerNewsItems.map((newsItem) => ({
            text: newsItem.title,
          })),
        }
      : null,
  ].filter((itemOrNull): itemOrNull is TocItem => Boolean(itemOrNull));
  return (
    <div className="relative m-auto flex max-w-full flex-col gap-8 p-4 md:p-6">
      <div className="max-w-4xl space-y-4 md:my-8 md:space-y-8">
        <header className="space-y-2">
          <h1 className="font-mono text-4xl">{newsletter.title}</h1>
          <p className="block text-lg text-gray-800">
            {formatDateYear(newsletter.createdAt)}
          </p>
        </header>
        <Greetings content={greetings} />
        <h2>{t[locale].summary}</h2>
        <TableOfContents toc={toc} />

        <Calendar
          eventsThisWeek={eventsThisWeek}
          eventsNextWeek={eventsNextWeek}
          signupsThisWeek={signupsThisWeek}
          locale={locale}
        />
        <NewsletterCategory
          title={t[locale].guild}
          newsItems={guildNewsItems}
          locale={locale}
        />
        <NewsletterCategory
          title={t[locale]["ayy-aalto"]}
          newsItems={ayyAaltoNewsItems}
          locale={locale}
        />
        <NewsletterCategory
          title={t[locale].other}
          newsItems={otherNewsItems}
          locale={locale}
        />
        <NewsletterCategory
          title={t[locale]["bottom-corner"]}
          newsItems={bottomCornerNewsItems}
          locale={locale}
        />
      </div>

      <footer className="prose prose-headings:scroll-mt-40 prose-headings:xl:scroll-mt-24 max-w-prose hyphens-auto text-pretty">
        <p>
          {t[locale].read}{" "}
          <a href={`${PUBLIC_FRONTEND_URL}/${locale}/${t[locale].path}`}>
            {t[locale]["old-link"]}
          </a>
        </p>
        <p>
          {t[locale].read}{" "}
          <a
            target="_blank"
            href={
              locale === "fi"
                ? `${PUBLIC_LEGACY_URL}/arkisto/viikkomailit/`
                : `${PUBLIC_LEGACY_URL}/arkisto/weekly_mails/`
            }
            rel="noopener"
          >
            {t[locale]["super-old-link"]}
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Newsletter;
