import * as React from "react";
import {
  type NewsItem,
  type WeeklyNewsletter,
} from "@tietokilta/cms-types/payload";
import { type EditorState } from "@tietokilta/cms-types/lexical";
import {
  formatDateYear,
  isNextWeek,
  isThisWeek,
  type TocItem,
} from "./utils/utils";
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

  const greetings = newsletter.greetings as EditorState | undefined;

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
    (newsItem) => newsItem.date && isNextWeek(newsItem.date),
  );
  const signupsThisWeek = allNewsItems.filter(
    (newsItem) =>
      newsItem.signupStartDate && isThisWeek(newsItem.signupStartDate),
  );
  const showCalendar =
    eventsThisWeek.length > 0 ||
    eventsNextWeek.length > 0 ||
    signupsThisWeek.length > 0;
  const toc: TocItem[] = [
    showCalendar ? { text: t[locale].calendar, children: [] } : null,
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
  const newsletterCategories = [
    { title: t[locale].guild, newsItems: guildNewsItems },
    { title: t[locale]["ayy-aalto"], newsItems: ayyAaltoNewsItems },
    { title: t[locale].other, newsItems: otherNewsItems },
    { title: t[locale]["bottom-corner"], newsItems: bottomCornerNewsItems },
  ];
  return (
    <div>
      <div>
        <h1>{newsletter.title}</h1>
        <p>{formatDateYear(newsletter.createdAt)}</p>
        <Greetings content={greetings} />
        <h2>{t[locale].summary}</h2>
        <TableOfContents toc={toc} />

        <Calendar
          eventsThisWeek={eventsThisWeek}
          eventsNextWeek={eventsNextWeek}
          signupsThisWeek={signupsThisWeek}
          locale={locale}
          order={"1."}
        />
        {newsletterCategories
          .filter((c) => c.newsItems.length > 0)
          .map((category, index) => (
            <NewsletterCategory
              title={category.title}
              newsItems={category.newsItems}
              locale={locale}
              order={
                showCalendar
                  ? `${(index + 2).toString()}.`
                  : `${(index + 1).toString()}.`
              }
            />
          ))}
      </div>

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
    </div>
  );
};

export default Newsletter;
