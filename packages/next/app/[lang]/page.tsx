import { Hero } from "./Hero";

import { fetchLandingPage } from "../../api/pages";
import { LexicalSerializer } from "../../components/lexical/LexicalSerializer";
import { SerializedLexicalEditorState } from "../../components/lexical/types";

export default async function LandingPage() {
  const landingPageData = await fetchLandingPage({});

  if (!landingPageData) {
    return "error"; // TODO
  }

  const body = landingPageData.body as unknown as SerializedLexicalEditorState | undefined;

  return (
    <main className="min-h-screen">
      <Hero
        images={landingPageData.heroImages
          .map(({ image }) => (typeof image === "string" ? null : image?.url))
          .filter((url): url is string => !!url)}
        text={landingPageData.heroText}
      />

      <div className="container mx-auto py-12 px-6 grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div>
        {body && <LexicalSerializer nodes={body.root.children} />}
        </div>
        <div>
          ilmot
        </div>
      </div>
    </main>
  );
}
