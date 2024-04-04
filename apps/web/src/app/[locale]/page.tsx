import type { EditorState } from "@tietokilta/cms-types/lexical";
import type { News, Page as CMSPage } from "@tietokilta/cms-types/payload";
import { EventsDisplay } from "../../components/events-display";
import { Hero } from "../../components/hero";
import { LexicalSerializer } from "../../components/lexical/lexical-serializer";
import { fetchLandingPage } from "../../lib/api/landing-page";
import { AnnouncementCard } from "../../components/announcement-card";
import { getCurrentLocale } from "../../locales/server";

function Content({ content }: { content?: EditorState }) {
  if (!content) return null;

  return (
    <article className="prose prose-headings:scroll-mt-24 max-w-prose">
      <LexicalSerializer nodes={content.root.children} />
    </article>
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
    <main className="flex min-h-screen flex-col">
      <Hero
        images={landingPageData.heroImages
          .map(({ image }) => (typeof image === "string" ? null : image?.url))
          .filter((url): url is string => Boolean(url))}
        text={landingPageData.heroText}
      />
      <div className="container mx-auto grid grid-cols-1 gap-12 px-6 py-12 lg:grid-cols-2">
        <section className="order-last space-y-4 lg:order-first">
          <h1 className="font-mono text-4xl font-bold text-gray-900">
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
    </main>
  );
}
