import { notFound } from "next/navigation";
import Link from "next/link";
import { type EditorState } from "@lexical-types";
import { type NewsItem } from "@payload-types";
import {
  fetchWeeklyNewsletter,
  fetchWeeklyNewsletterBySlug,
} from "../lib/api/weekly-newsletters";
import { getLocale, getTranslations } from "../locales/server";
import {
  formatDate,
  formatDateYear,
  formatDateYearOptions,
  isThisWeek,
  makeUniqueId,
  stringToId,
  type TocItem,
} from "../lib/utils";
import { LexicalSerializer } from "../components/lexical/lexical-serializer";
import { TableOfContents } from "../components/table-of-contents";
import { DateTime } from "../components/datetime";

async function NewsItemContent({ item }: { item: NewsItem }) {
  const t = await getTranslations("weeklyNewsletter");
  const content = item.content as unknown as EditorState | null;

  return (
    <div className="prose max-w-prose text-pretty hyphens-auto prose-headings:scroll-mt-40 xl:prose-headings:scroll-mt-24">
      {item.linkToSignUp ? (
        <Link
          // Do not create relative links
          href={
            item.linkToSignUp.startsWith("http")
              ? item.linkToSignUp
              : `//${item.linkToSignUp}`
          }
          target="_blank"
          rel="noopener"
        >
          {t("To sign up")}{" "}
          <span className="sr-only">{` ${t("for event")} ${item.title}`}</span>
        </Link>
      ) : null}
      {content ? <LexicalSerializer nodes={content.root.children} /> : null}
    </div>
  );
}

function NewsSection({ newsItem }: { newsItem: NewsItem }) {
  return (
    <article>
      <h3 id={stringToId(newsItem.title)}>{newsItem.title}</h3>
      <NewsItemContent item={newsItem} />
    </article>
  );
}

function NewsletterCategory({
  title,
  newsItems,
}: {
  title: string;
  newsItems: NewsItem[];
}) {
  if (newsItems.length === 0) return null;

  return (
    <section className="prose max-w-prose text-pretty hyphens-auto prose-headings:scroll-mt-40 xl:prose-headings:scroll-mt-24">
      <h2 className="font-mono text-2xl" id={stringToId(title)}>
        {title}
      </h2>
      {newsItems.map((newsItem) => (
        <NewsSection key={newsItem.id} newsItem={newsItem} />
      ))}
    </section>
  );
}

async function Calendar({
  eventsThisWeek,
  eventsNextWeek,
  signupsThisWeek,
}: {
  eventsThisWeek: NewsItem[];
  eventsNextWeek: NewsItem[];
  signupsThisWeek: NewsItem[];
}) {
  const t = await getTranslations("weeklyNewsletter");

  if (
    eventsThisWeek.length === 0 &&
    eventsNextWeek.length === 0 &&
    signupsThisWeek.length === 0
  ) {
    return null;
  }

  return (
    <section className="prose max-w-prose text-pretty hyphens-auto prose-headings:scroll-mt-40 xl:prose-headings:scroll-mt-24">
      <h2 id={stringToId(t("Calendar"))}>{t("Calendar")}</h2>
      {eventsThisWeek.length > 0 ? (
        <div>
          <span>{t("This week")}:</span>
          <ol className="not-prose ml-[4ch]">
            {eventsThisWeek.map((newsItem) => (
              <li key={newsItem.id}>
                {newsItem.date ? (
                  <span>{formatDate(newsItem.date)} </span>
                ) : null}
                <span>{newsItem.title}</span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
      {eventsNextWeek.length > 0 ? (
        <div>
          <span>{t("Next week")}:</span>
          <ol className="not-prose ml-[4ch]">
            {eventsNextWeek.map((newsItem) => (
              <li key={newsItem.id}>
                {newsItem.date ? (
                  <span>{formatDate(newsItem.date)} </span>
                ) : null}
                <span>{newsItem.title}</span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
      {signupsThisWeek.length > 0 ? (
        <div>
          <span>{t("Sign ups open this week")}:</span>
          <ol className="not-prose ml-[4ch]">
            {signupsThisWeek.map((newsItem) => (
              <li key={newsItem.id}>
                {newsItem.signupStartDate ? (
                  <span>{formatDate(newsItem.signupStartDate)}</span>
                ) : null}
                {newsItem.signupEndDate ? (
                  <span>–{formatDate(newsItem.signupEndDate)} </span>
                ) : null}
                <span>{newsItem.title}</span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </section>
  );
}

function Greetings({ content }: { content?: EditorState }) {
  if (!content) return null;

  return (
    <div className="prose max-w-prose text-pretty hyphens-auto prose-headings:scroll-mt-40 xl:prose-headings:scroll-mt-24">
      <LexicalSerializer nodes={content.root.children} />
    </div>
  );
}

export const legacyUrl =
  process.env.PUBLIC_LEGACY_URL ?? "https://tietokilta.fi";

export default async function Page({ slug }: { slug?: string }) {
  const locale = await getLocale();
  const t = await getTranslations("weeklyNewsletter");
  const weeklyNewsletter = await (slug
    ? fetchWeeklyNewsletterBySlug({
        where: { slug: { equals: slug } },
        locale,
      })
    : fetchWeeklyNewsletter({ locale }));

  if (!weeklyNewsletter) {
    return notFound();
  }

  const path = t("path");

  const greetings = weeklyNewsletter.greetings as unknown as
    | EditorState
    | undefined;

  const allNewsItems =
    weeklyNewsletter.newsItems?.map((item) => item.newsItem as NewsItem) ?? [];

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

  const seenIds = new Map<string, number>();

  const toc: TocItem[] = [
    eventsThisWeek.length > 0 ||
    eventsNextWeek.length > 0 ||
    signupsThisWeek.length > 0
      ? {
          id: makeUniqueId(stringToId(t("Calendar")), seenIds),
          level: 2 as const,
          text: t("Calendar"),
        }
      : null,
    guildNewsItems.length > 0
      ? {
          id: makeUniqueId(stringToId(t("Guild")), seenIds),
          level: 2 as const,
          text: t("Guild"),
        }
      : null,
    ...guildNewsItems.map((newsItem) => ({
      id: makeUniqueId(stringToId(newsItem.title), seenIds),
      level: 3 as const,
      text: newsItem.title,
    })),
    ayyAaltoNewsItems.length > 0
      ? {
          id: makeUniqueId(stringToId(t("AYY & Aalto")), seenIds),
          level: 2 as const,
          text: t("AYY & Aalto"),
        }
      : null,
    ...ayyAaltoNewsItems.map((newsItem) => ({
      id: makeUniqueId(stringToId(newsItem.title), seenIds),
      level: 3 as const,
      text: newsItem.title,
    })),
    otherNewsItems.length > 0
      ? {
          id: makeUniqueId(stringToId(t("Other")), seenIds),
          level: 2 as const,
          text: t("Other"),
        }
      : null,
    ...otherNewsItems.map((newsItem) => ({
      id: makeUniqueId(stringToId(newsItem.title), seenIds),
      level: 3 as const,
      text: newsItem.title,
    })),
    bottomCornerNewsItems.length > 0
      ? {
          id: makeUniqueId(stringToId(t("Bottom Corner")), seenIds),
          level: 2 as const,
          text: t("Bottom Corner"),
        }
      : null,
    ...bottomCornerNewsItems.map((newsItem) => ({
      id: makeUniqueId(stringToId(newsItem.title), seenIds),
      level: 3 as const,
      text: newsItem.title,
    })),
  ].filter((itemOrNull): itemOrNull is NonNullable<typeof itemOrNull> =>
    Boolean(itemOrNull),
  );

  return (
    <main
      id="main"
      className="relative mb-8 flex flex-col items-center gap-2 md:gap-6"
    >
      <div className="relative m-auto flex max-w-full flex-col gap-8 p-4 md:p-6">
        <TableOfContents toc={toc} />

        <div className="max-w-4xl space-y-4 md:my-8 md:space-y-8">
          <header className="space-y-2">
            <h1 className="font-mono text-4xl">{weeklyNewsletter.title}</h1>
            <DateTime
              className="block text-lg text-gray-800"
              rawDate={weeklyNewsletter.createdAt}
              formatOptions={formatDateYearOptions}
              defaultFormattedDate={formatDateYear(weeklyNewsletter.createdAt)}
            />
          </header>
          <Greetings content={greetings} />
          <Calendar
            eventsThisWeek={eventsThisWeek}
            eventsNextWeek={eventsNextWeek}
            signupsThisWeek={signupsThisWeek}
          />
          <NewsletterCategory title={t("Guild")} newsItems={guildNewsItems} />
          <NewsletterCategory
            title={t("AYY & Aalto")}
            newsItems={ayyAaltoNewsItems}
          />
          <NewsletterCategory title={t("Other")} newsItems={otherNewsItems} />
          <NewsletterCategory
            title={t("Bottom Corner")}
            newsItems={bottomCornerNewsItems}
          />
        </div>

        <footer className="prose max-w-prose text-pretty hyphens-auto prose-headings:scroll-mt-40 xl:prose-headings:scroll-mt-24">
          <p>
            {t("Read")}{" "}
            <a href={`/${locale}/${path}`}>{t("old weekly newsletters")}</a>
          </p>
        </footer>
      </div>
    </main>
  );
}
