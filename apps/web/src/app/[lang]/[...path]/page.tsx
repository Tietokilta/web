import { notFound } from "next/navigation";
import { AdminBar } from "../../../components/admin-bar";
import { LexicalSerializer } from "../../../components/lexical/lexical-serializer";
import type { SerializedLexicalEditorState } from "../../../components/lexical/types";
import { fetchPage } from "../../../lib/api/pages";

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
    | SerializedLexicalEditorState
    | undefined;

  return (
    <>
      <AdminBar collection="pages" id={page.id} />
      <h1>{page.title}</h1>
      {content ? <LexicalSerializer nodes={content.root.children} /> : null}
    </>
  );
};

export default Page;
