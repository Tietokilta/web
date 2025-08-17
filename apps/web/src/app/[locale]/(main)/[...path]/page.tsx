import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Card } from "@tietokilta/ui";
import type { Page as CMSPage } from "@payload-types";
import type { EditorState } from "@lexical-types";
import WeeklyNewslettersListPage from "@custom-pages/weekly-newsletters-list-page";
import EventsPage from "@custom-pages/events-page";
import AllEventsPage from "@custom-pages/all-events-page";
import WeeklyNewsletterPage from "@custom-pages/weekly-newsletter-page";
import { AdminBar } from "@components/admin-bar";
import { LexicalSerializer } from "@components/lexical/lexical-serializer";
import { TableOfContents } from "@components/table-of-contents";
import { fetchPage } from "@lib/api/pages";
import { getCurrentLocale, type Locale } from "@locales/server";
import { generateTocFromRichText } from "@lib/utils";

interface NextPage<Params extends Record<string, unknown>> {
  params: Promise<Params>;
}

type Props = NextPage<{ path: string[] }>;

const getPage = async (path: string[], locale: Locale) => {
  if (path.length !== 1 && path.length !== 2) {
    return notFound();
  }

  const pagePath = `/${path.join("/")}`;
  const fullPath = `/${locale}${pagePath}`;

  const page = await fetchPage({
    where: {
      path: {
        equals: fullPath,
      },
    },
    locale,
  });

  if (!page) {
    const otherLang = locale === "fi" ? "en" : "fi";
    const otherFullPath = `/${otherLang}${pagePath}`;
    const localizedPathKey = `path.${otherLang}` as const;

    const otherPage = await fetchPage({
      // @ts-expect-error Typescript doesn't get as const keys in object assignments it seems
      where: {
        [localizedPathKey]: {
          equals: otherFullPath,
        },
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

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const params = await props.params;
  const { path } = params;

  const locale = await getCurrentLocale();
  const page = await getPage(path, locale);

  return {
    title: page.title,
    description: page.description,
    openGraph: {
      type: "article",
      publishedTime: page.createdAt,
      modifiedTime: page.updatedAt,
      images: `/next_api/og/cms-page?title=${encodeURIComponent(page.title)}&description=${encodeURIComponent(page.description)}`,
    },
  };
};

function Content({ content }: { content?: EditorState }) {
  if (!content) return null;

  return (
    <article className="prose max-w-prose hyphens-auto text-pretty prose-headings:scroll-mt-40 xl:prose-headings:scroll-mt-24">
      <LexicalSerializer nodes={content.root.children} />
    </article>
  );
}

async function Page(props: Props) {
  const params = await props.params;
  const { path } = params;

  const locale = await getCurrentLocale();
  const page = await getPage(path, locale);

  if (page.type === "events-list") {
    return <EventsPage />;
  }

  if (page.type === "all-events-list") {
    return <AllEventsPage />;
  }

  if (page.type === "weekly-newsletter") {
    return <WeeklyNewsletterPage />;
  }

  if (page.type === "weekly-newsletters-list") {
    return <WeeklyNewslettersListPage />;
  }

  if (page.type === "redirect") {
    const redirectToPage = page.redirectToPage as CMSPage | undefined;
    if (!redirectToPage?.path) {
      // eslint-disable-next-line no-console -- nice to know
      console.error("Redirect page missing redirect target", page);
      return notFound();
    }

    return redirect(redirectToPage.path);
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- extra safety just in case
  if (page.type !== "standard") {
    // eslint-disable-next-line no-console -- nice to know
    console.error("Unknown page type", page.type);
    // eslint-disable-next-line no-console -- we really should start using logger
    console.error(page);
    return notFound();
  }

  const content = page.content as unknown as EditorState | undefined;

  return (
    <>
      <main
        id="main"
        className="relative mb-8 flex flex-col items-center gap-2 md:gap-6"
      >
        <header className="flex h-[15svh] w-full items-center justify-center bg-gray-900 p-2 text-gray-100 md:h-[25svh]">
          <h1 className="font-mono text-4xl md:text-5xl">{page.title}</h1>
        </header>

        <div className="relative m-auto flex max-w-full flex-col gap-8 p-4 md:p-6">
          {page.tableOfContents !== "none" ? (
            <TableOfContents
              toc={generateTocFromRichText(
                content,
                page.tableOfContents === "top-level",
              )}
              topLevelOnly={page.tableOfContents === "top-level"}
            />
          ) : null}
          <Card className="max-w-prose">
            <p>{page.description}</p>
          </Card>
          <Content content={content} />
        </div>
      </main>
      <AdminBar collection="pages" id={page.id} />
    </>
  );
}

export default Page;
