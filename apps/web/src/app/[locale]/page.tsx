import type { EditorState } from "@tietokilta/cms-types/lexical";
import type { News, Page as CMSPage } from "@tietokilta/cms-types/payload";
import { EventsDisplay } from "../../components/events-display";
import { Hero, type ImageWithPhotographer } from "../../components/hero";
import { LexicalSerializer } from "../../components/lexical/lexical-serializer";
import { fetchLandingPage } from "../../lib/api/landing-page";
import { AnnouncementCard } from "../../components/announcement-card";
import { getCurrentLocale } from "../../locales/server";

function Content({ content }: { content?: EditorState }) {
  if (!content) return null;

  return (
    <div className="prose prose-headings:scroll-mt-24 dark:prose-invert max-w-prose">
      <LexicalSerializer nodes={content.root.children} />
    </div>
  );
}

export default async function Home({
  searchParams: { page },
}: {
  searchParams: { page?: string | string[] };
}) {
  const locale = getCurrentLocale();

  const landingPageData = await fetchLandingPage(locale)({});
  if (!landingPageData) {
    throw new Error("Unable to fetch landing page data");
  }

  const body = landingPageData.body as unknown as EditorState | undefined;
  const announcement = landingPageData.announcement as News | undefined;
  const eventsListPage = landingPageData.eventsListPage as CMSPage | undefined;
  const pageInt = parseInt(String(page), 10);

  return (
    <main id="main" className="dark:bg-dark-bg flex min-h-screen flex-col">
      <Hero
        images={landingPageData.heroImages
          .map(({ image }) =>
            typeof image === "string"
              ? null
              : { url: image?.url, photographer: image?.photographer },
          )
          .filter((url): url is ImageWithPhotographer => Boolean(url))}
        texts={landingPageData.heroTexts
          .map(({ text }) => (typeof text === "string" ? text : null))
          .filter((url): url is string => Boolean(url))}
      />
      {/* Desktop view */}
      <div className="container mx-0 hidden min-w-full grid-cols-2 gap-12 bg-gradient-to-b from-stone-50 to-stone-400 px-24 py-12 lg:grid dark:from-stone-900 dark:to-gray-900">
        <section className="order-first space-y-4">
          <h1 className="dark:text-dark-heading font-mono text-4xl font-bold text-gray-900">
            Tietokilta
          </h1>
          <Content content={body} />
        </section>
        <div className="space-y-8">
          {announcement ? <AnnouncementCard news={announcement} /> : null}
          <EventsDisplay
            eventsListPath={eventsListPage?.path ?? undefined}
            currentPage={!isNaN(pageInt) ? pageInt : undefined}
          />
        </div>
      </div>
      {/* Mobile view */}
      <div className="container mx-auto flex flex-col gap-12 px-6 py-12 lg:hidden">
        <div className="space-y-8">
          {announcement ? <AnnouncementCard news={announcement} /> : null}
        </div>
        <section className="space-y-4">
          <h1 className="dark:text-dark-heading font-mono text-4xl font-bold text-gray-900">
            Tietokilta
          </h1>
          <Content content={body} />
        </section>
        <EventsDisplay
          eventsListPath={eventsListPage?.path ?? undefined}
          currentPage={!isNaN(pageInt) ? pageInt : undefined}
        />
      </div>
    </main>
  );
}
