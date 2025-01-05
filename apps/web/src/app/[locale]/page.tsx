import type { EditorState } from "@tietokilta/cms-types/lexical";
import type { News, Page as CMSPage } from "@tietokilta/cms-types/payload";
import { type Metadata } from "next";
import { EventsDisplay } from "../../components/events-display";
import { Hero, type ImageWithPhotographer } from "../../components/hero";
import { LexicalSerializer } from "../../components/lexical/lexical-serializer";
import { fetchLandingPage } from "../../lib/api/landing-page";
import { AnnouncementCard } from "../../components/announcement-card";
import { getCurrentLocale } from "../../locales/server";
import { openGraphImage } from "../shared-metadata";

function Content({ content }: { content?: EditorState }) {
  if (!content) return null;

  return (
    <div className="prose prose-headings:scroll-mt-24 max-w-prose">
      <LexicalSerializer nodes={content.root.children} />
    </div>
  );
}

export const metadata: Metadata = {
  openGraph: {
    type: "website",
    ...openGraphImage,
  },
};

export default async function Home(props: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const searchParams = await props.searchParams;
  const { page } = searchParams;

  const locale = await getCurrentLocale();

  const landingPageData = await fetchLandingPage(locale)({});
  if (!landingPageData) {
    throw new Error("Unable to fetch landing page data");
  }

  const body = landingPageData.body as unknown as EditorState | undefined;
  const announcement = landingPageData.announcement as News | undefined;
  const eventsListPage = landingPageData.eventsListPage as CMSPage | undefined;
  const pageInt = parseInt(String(page), 10);

  return (
    <main id="main" className="flex min-h-screen flex-col">
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
      <div className="container mx-auto hidden grid-cols-2 gap-12 px-6 py-12 lg:grid">
        <section className="order-first space-y-4">
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
      {/* Mobile view */}
      <div className="container mx-auto flex flex-col gap-12 px-6 py-12 lg:hidden">
        <div className="space-y-8">
          {announcement ? <AnnouncementCard news={announcement} /> : null}
        </div>
        <section className="space-y-4">
          <h1 className="font-mono text-4xl font-bold text-gray-900">
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
