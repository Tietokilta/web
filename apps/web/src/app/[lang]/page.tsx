import type { EditorState } from "@tietokilta/cms-types/lexical";
import { EventsDisplay } from "../../components/events-display";
import { Hero } from "../../components/hero";
import { LexicalSerializer } from "../../components/lexical/lexical-serializer";
import { fetchLandingPage } from "../../lib/api/landing-page";
import { getDictionary } from "../../lib/dictionaries";

function Content({ content }: { content?: EditorState }) {
  if (!content) return null;

  return (
    <article className="prose prose-headings:scroll-mt-24 max-w-prose">
      <LexicalSerializer nodes={content.root.children} />
    </article>
  );
}

export default async function Home({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const dictionary = await getDictionary(lang);

  const landingPageData = await fetchLandingPage({});
  if (!landingPageData) {
    // TODO: Real error handling / show error page
    return "Unable to fetch landing page data, please refresh";
  }

  const body = landingPageData.body as unknown as EditorState | undefined;

  return (
    <main className="flex min-h-screen flex-col">
      <Hero
        images={landingPageData.heroImages
          .map(({ image }) => (typeof image === "string" ? null : image?.url))
          .filter((url): url is string => Boolean(url))}
        text={landingPageData.heroText}
      />
      <div className="container mx-auto grid grid-cols-1 gap-12 px-6 py-12 lg:grid-cols-2">
        <section className="space-y-4">
          <h1 className="font-mono text-4xl font-bold text-gray-900">
            Tietokilta
          </h1>
          <Content content={body} />
        </section>
        <EventsDisplay
          ilmoheaderText={dictionary.heading["Upcoming events"]}
          ilmolinkText={dictionary.action["Sign up"]}
        />
      </div>
    </main>
  );
}
