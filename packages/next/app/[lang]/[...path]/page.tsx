import { fetchPage } from "../../../api/pages";
import { AdminBar } from "../../../components/AdminBar";
import { LexicalSerializer } from "../../../components/lexical/LexicalSerializer";
import { SerializedLexicalEditorState } from "../../../components/lexical/types";

import { notFound } from "next/navigation";

interface NextPage<Params extends Record<string, unknown>> {
  params: Params;
  searchParams: Record<string, string | string[] | undefined>;
}

const Page = async ({
  params: { path, lang },
}: NextPage<{ path: string[]; lang: string }>) => {
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

  if (!page) return notFound();

  const content = page.content as unknown as
    | {
        jsonContent: SerializedLexicalEditorState;
      }
    | undefined;

  return (
    <>
      <AdminBar collection="pages" id={page.id} />
      <h1>{page.title}</h1>
      {content && (
        <LexicalSerializer nodes={content.jsonContent.root.children} />
      )}
    </>
  );
};

export default Page;
