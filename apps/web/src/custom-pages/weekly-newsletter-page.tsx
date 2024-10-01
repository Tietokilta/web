import { notFound } from "next/navigation";
import Link from "next/link";
import { type EditorState } from "@tietokilta/cms-types/lexical";
import { type NewsItem } from "@tietokilta/cms-types/payload";
import {
  fetchWeeklyNewsletter,
  fetchWeeklyNewsletterBySlug,
} from "../lib/api/weekly-newsletters";
import { getCurrentLocale, getScopedI18n } from "../locales/server";
import {
  byDate,
  formatDate,
  formatDateYear,
  formatDateYearOptions,
  isNextWeek,
  isThisWeek,
  stringToId,
  type TocItem,
} from "../lib/utils";
import { LexicalSerializer } from "../components/lexical/lexical-serializer";
import { TableOfContents } from "../components/table-of-contents";
import { DateTime } from "../components/datetime";

async function NewsItemContent({ item }: { item: NewsItem }) {
  const t = await getScopedI18n("weeklyNewsletter");
  const content = item.content as unknown as EditorState | null;

  return (
    <div className="prose prose-headings:scroll-mt-40 prose-headings:xl:scroll-mt-24 max-w-prose hyphens-auto text-pretty">
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
          {t("link-to-sign-up")}{" "}
          <span className="sr-only">{` ${t("for-event")} ${item.title}`}</span>
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
    <section className="prose prose-headings:scroll-mt-40 prose-headings:xl:scroll-mt-24 max-w-prose hyphens-auto text-pretty">
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
  const t = await getScopedI18n("weeklyNewsletter");

  if (
    eventsThisWeek.length === 0 &&
    eventsNextWeek.length === 0 &&
    signupsThisWeek.length === 0
  ) {
    return null;
  }

  return (
    <section className="prose prose-headings:scroll-mt-40 prose-headings:xl:scroll-mt-24 max-w-prose hyphens-auto text-pretty">
      <h2 id={stringToId(t("calendar"))}>{t("calendar")}</h2>
      {eventsThisWeek.length > 0 ? (
        <div>
          <span>{t("this-week")}:</span>
          <ol className="not-prose ml-[4ch]">
            {eventsThisWeek.toSorted(byDate).map((newsItem) => (
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
          <span>{t("next-week")}:</span>
          <ol className="not-prose ml-[4ch]">
            {eventsNextWeek.toSorted(byDate).map((newsItem) => (
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
          <span>{t("this-week-signups")}:</span>
          <ol className="not-prose ml-[4ch]">
            {signupsThisWeek.toSorted(byDate).map((newsItem) => (
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
    <div className="prose prose-headings:scroll-mt-40 prose-headings:xl:scroll-mt-24 max-w-prose hyphens-auto text-pretty">
      <LexicalSerializer nodes={content.root.children} />
    </div>
  );
}

export const legacyUrl =
  process.env.PUBLIC_LEGACY_URL ?? "https://tietokilta.fi";

export default async function Page({ slug }: { slug?: string }) {
  const locale = await getCurrentLocale();
  const t = await getScopedI18n("weeklyNewsletter");
  const weeklyNewsletter = await (slug
    ? fetchWeeklyNewsletterBySlug({
        where: { slug: { equals: slug } },
        locale,
      })
    : fetchWeeklyNewsletter({ locale }));

  if (!weeklyNewsletter) {
    return notFound();
  }

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
    (newsItem) => newsItem.date && isNextWeek(newsItem.date),
  );
  const signupsThisWeek = allNewsItems.filter(
    (newsItem) =>
      newsItem.signupStartDate && isThisWeek(newsItem.signupStartDate),
  );

  const toc: TocItem[] = [
    eventsThisWeek.length > 0 ||
    eventsNextWeek.length > 0 ||
    signupsThisWeek.length > 0
      ? { level: 2, text: t("calendar") }
      : null,
    guildNewsItems.length > 0 ? { level: 2, text: t("guild") } : null,
    ...guildNewsItems.map((newsItem) => ({
      level: 3,
      text: newsItem.title,
    })),
    ayyAaltoNewsItems.length > 0 ? { level: 2, text: t("ayy-aalto") } : null,
    ...ayyAaltoNewsItems.map((newsItem) => ({
      level: 3,
      text: newsItem.title,
    })),
    otherNewsItems.length > 0 ? { level: 2, text: t("other") } : null,
    ...otherNewsItems.map((newsItem) => ({
      level: 3,
      text: newsItem.title,
    })),
    bottomCornerNewsItems.length > 0
      ? { level: 2, text: t("bottom-corner") }
      : null,
    ...bottomCornerNewsItems.map((newsItem) => ({
      level: 3,
      text: newsItem.title,
    })),
  ].filter((itemOrNull): itemOrNull is TocItem => Boolean(itemOrNull));

  return (
    <main
      id="main"
      className="relative mb-8 flex flex-col items-center gap-2 md:gap-6"
    >
      <div className="relative m-auto flex max-w-full flex-col gap-8 p-4 md:p-6">
        <TableOfContents toc={toc} />
        <pre>{JSON.stringify(weeklyNewsletter, null, 2)}</pre>
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
          <NewsletterCategory title={t("guild")} newsItems={guildNewsItems} />
          <NewsletterCategory
            title={t("ayy-aalto")}
            newsItems={ayyAaltoNewsItems}
          />
          <NewsletterCategory title={t("other")} newsItems={otherNewsItems} />
          <NewsletterCategory
            title={t("bottom-corner")}
            newsItems={bottomCornerNewsItems}
          />
        </div>

        <footer className="prose prose-headings:scroll-mt-40 prose-headings:xl:scroll-mt-24 max-w-prose hyphens-auto text-pretty">
          <p>
            {t("read")} <a href={`/${locale}/${t("path")}`}>{t("old-link")}</a>
          </p>
          <p>
            {t("read")}{" "}
            <a
              target="_blank"
              href={
                locale === "fi"
                  ? `${legacyUrl}/arkisto/viikkomailit/`
                  : `${legacyUrl}/arkisto/weekly_mails/`
              }
              rel="noopener"
            >
              {t("super-old-link")}
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
