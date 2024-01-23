import type { EditorState } from "@tietokilta/cms-types/lexical";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { AdminBar } from "../../../components/admin-bar";
import { LexicalSerializer } from "../../../components/lexical/lexical-serializer";
import { TableOfContents } from "../../../components/table-of-contents";
import { fetchPage } from "../../../lib/api/pages";
import type { Locale } from "../../../lib/dictionaries";

interface NextPage<Params extends Record<string, unknown>> {
  params: Params;
  searchParams: Record<string, string | string[] | undefined>;
}

type Props = NextPage<{ path: string[]; lang: Locale }>;

const getPage = async (path: string[], lang: Locale) => {
  if (path.length !== 1 && path.length !== 2) {
    return notFound();
  }

  const page = await fetchPage({
    where:
      path.length === 1
        ? { slug: { equals: path[0] } }
        : { slug: { equals: path[1] }, topic: { slug: { equals: path[0] } } },
    locale: lang,
  });

  if (!page) {
    const otherLang = lang === "fi" ? "en" : "fi";
    const localizedSlug = `slug.${otherLang}` as const;
    const localizedTopic = `topic.${otherLang}` as const;
    const otherPage = await fetchPage({
      // @ts-expect-error Typescript doesn't get as const keys in object assignments it seems
      where:
        path.length === 1
          ? { [localizedSlug]: { equals: path[0] } }
          : {
              [localizedSlug]: { equals: path[1] },
              [localizedTopic]: { [localizedSlug]: { equals: path[0] } },
            },
      locale: "all",
    });

    if (!otherPage?.path) {
      return notFound();
    }

    const localizedPath = otherPage.path as unknown as Record<Locale, string>;

    if (!localizedPath[lang]) {
      return notFound();
    }

    return redirect(localizedPath[lang]);
  }

  return page;
};

export const generateMetadata = async ({
  params: { path, lang },
}: Props): Promise<Metadata> => {
  const page = await getPage(path, lang);

  return {
    title: page.title,
    description: page.description,
  };
};

function Content({ content }: { content?: EditorState }) {
  if (!content) return null;

  return (
    <article className="prose prose-headings:scroll-mt-40 prose-headings:xl:scroll-mt-24 max-w-prose">
      <LexicalSerializer nodes={content.root.children} />
    </article>
  );
}

const Page = async ({ params: { path, lang } }: Props) => {
  const page = await getPage(path, lang);
  const content = page.content as unknown as EditorState | undefined;

  return (
    <>
      <AdminBar collection="pages" id={page.id} />
      <main className="relative mb-8 flex flex-col items-center gap-2 md:gap-6">
        <header className="flex h-[15svh] w-full items-center justify-center bg-gray-900 text-gray-100 md:h-[25svh]">
          <h1 className="font-mono text-4xl md:text-5xl">{page.title}</h1>
        </header>

        <div className="relative m-auto flex max-w-prose flex-col gap-8 p-4 md:p-6">
          <TableOfContents content={content} />
          <p className="shadow-solid max-w-prose rounded-md border-2 border-gray-900 p-4 md:p-6">
            {page.description}
          </p>
          <Content content={content} />
        </div>
      </main>
    </>
  );
};

export default Page;
