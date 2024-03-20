import type { EditorState } from "@tietokilta/cms-types/lexical";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { AdminBar } from "../../../components/admin-bar";
import { LexicalSerializer } from "../../../components/lexical/lexical-serializer";
import { TableOfContents } from "../../../components/table-of-contents";
import { fetchPage } from "../../../lib/api/pages";
import { getCurrentLocale, type Locale } from "../../../locales/server";

interface NextPage<Params extends Record<string, unknown>> {
  params: Params;
  searchParams: Record<string, string | string[] | undefined>;
}

type Props = NextPage<{ path: string[] }>;

const getPage = async (path: string[], locale: Locale) => {
  if (path.length !== 1 && path.length !== 2) {
    return notFound();
  }

  const page = await fetchPage({
    where:
      path.length === 1
        ? { slug: { equals: path[0] } }
        : { slug: { equals: path[1] }, topic: { slug: { equals: path[0] } } },
    locale,
  });

  if (!page) {
    const otherLang = locale === "fi" ? "en" : "fi";
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

    const allLocalesPath = otherPage.path as unknown as Record<Locale, string>;
    const localizedPath = allLocalesPath[locale];

    if (!localizedPath) {
      return notFound();
    }

    return redirect(localizedPath);
  }

  return page;
};

export const generateMetadata = async ({
  params: { path },
}: Props): Promise<Metadata> => {
  const locale = getCurrentLocale();
  const page = await getPage(path, locale);

  return {
    title: page.title,
    description: page.description,
  };
};

function Content({ content }: { content?: EditorState }) {
  if (!content) return null;

  return (
    <article className="prose prose-headings:scroll-mt-40 prose-headings:xl:scroll-mt-24 max-w-prose hyphens-auto text-pretty">
      <LexicalSerializer nodes={content.root.children} />
    </article>
  );
}

async function Page({ params: { path } }: Props) {
  const locale = getCurrentLocale();
  const page = await getPage(path, locale);
  const content = page.content as unknown as EditorState | undefined;

  return (
    <>
      <AdminBar collection="pages" id={page.id} />
      <main className="relative mb-8 flex flex-col items-center gap-2 md:gap-6">
        <header className="flex h-[15svh] w-full items-center justify-center bg-gray-900 text-gray-100 md:h-[25svh]">
          <h1 className="font-mono text-4xl md:text-5xl">{page.title}</h1>
        </header>

        <div className="relative m-auto flex max-w-full flex-col gap-8 p-4 md:p-6">
          {!page.hideTableOfContents ? (
            <TableOfContents content={content} />
          ) : null}
          <p className="shadow-solid max-w-prose rounded-md border-2 border-gray-900 p-4 md:p-6">
            {page.description}
          </p>
          <Content content={content} />
        </div>
      </main>
    </>
  );
}

export default Page;
