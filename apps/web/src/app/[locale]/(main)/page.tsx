import { type Metadata } from "next";
import type { EditorState } from "@lexical-types";
import type { News, Page as CMSPage } from "@payload-types";
import { EventsDisplay } from "@components/events-display";
import { Hero } from "@components/hero";
import { LexicalSerializer } from "@components/lexical/lexical-serializer";
import { fetchLandingPage } from "@lib/api/landing-page";
import { AnnouncementCard } from "@components/announcement-card";
import { getCurrentLocale } from "@locales/server";
import AprilFoolsAlert from "@components/april-fools/april-fools-alert";
import { type NonNullableKeys, cn } from "@lib/utils";
import { fetchMainNavigation } from "@lib/api/main-navigation";

function Content({ content }: { content?: EditorState }) {
  if (!content) return null;

  return (
    <div className="prose max-w-prose prose-headings:scroll-mt-24">
      <LexicalSerializer nodes={content.root.children} />
    </div>
  );
}

export const metadata: Metadata = {
  openGraph: {
    type: "website",
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

  const mainNav = await fetchMainNavigation(locale)({});
  const systemSeven = mainNav?.enableSystemSevenTheme ?? false;

  const body = landingPageData.body as unknown as EditorState | undefined;
  const announcement = landingPageData.announcement as News | undefined;
  const eventsListPage = landingPageData.eventsListPage as CMSPage | undefined;
  const pageInt = parseInt(String(page), 10);

  return (
    <main id="main" className="flex min-h-screen flex-col overflow-x-hidden">
      <Hero
        images={landingPageData.heroImages
          .map(({ image }) =>
            typeof image === "string"
              ? null
              : { url: image?.url, photographer: image?.photographer },
          )
          .filter(
            (img): img is NonNullableKeys<NonNullable<typeof img>, "url"> =>
              Boolean(img?.url),
          )}
        texts={landingPageData.heroTexts
          .map(({ text }) => (typeof text === "string" ? text : null))
          .filter((url): url is string => Boolean(url))}
        systemSeven={systemSeven}
      />
      {/* Desktop view */}
      <div className="container mx-auto hidden grid-cols-2 gap-12 px-6 py-12 lg:grid">
        <section className="order-first space-y-4">
          <h1
            className={cn(
              "font-mono text-4xl font-bold text-gray-900",
              systemSeven && "glitch layers",
            )}
            data-text="Tietokilta"
          >
            Tietokilta
          </h1>
          <Content content={body} />
        </section>
        <div className="space-y-8">
          {announcement ? <AnnouncementCard news={announcement} /> : null}
          <EventsDisplay
            eventsListPath={eventsListPage?.path ?? undefined}
            currentPage={!isNaN(pageInt) ? pageInt : undefined}
            systemSeven={systemSeven}
          />
        </div>
      </div>
      {/* Mobile view */}
      <div className="container mx-auto flex flex-col gap-12 px-6 py-12 lg:hidden">
        <div className="space-y-8">
          {announcement ? <AnnouncementCard news={announcement} /> : null}
        </div>
        <section className="space-y-4">
          <h1
            className={cn(
              "font-mono text-4xl font-bold text-gray-900",
              systemSeven && "glitch layers",
            )}
            data-text="Tietokilta"
          >
            Tietokilta
          </h1>
          <Content content={body} />
        </section>
        <EventsDisplay
          eventsListPath={eventsListPage?.path ?? undefined}
          currentPage={!isNaN(pageInt) ? pageInt : undefined}
          systemSeven={systemSeven}
        />
      </div>
      <AprilFoolsAlert />
    </main>
  );
}
