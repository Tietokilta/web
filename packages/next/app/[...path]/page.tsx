import React from "react";
import { notFound } from "next/navigation";
import { fetchPage } from "../../api/pages";
import { AdminBar } from "../../components/AdminBar";
import { LexicalSerializer } from "../../components/lexical/LexicalSerializer";
import { SerializedLexicalEditorState } from "../../components/lexical/types";

type NextPage<Params extends { [key: string]: unknown }> = {
  params: Params;
  searchParams: { [key: string]: string | string[] | undefined };
};

const Page = async ({ params: { path } }: NextPage<{ path: string[] }>) => {
  if (path.length !== 1 && path.length !== 2) {
    return notFound();
  }

  const page = await fetchPage(
    path.length === 1 ? { slug: path[0] } : { slug: path[1], topic: path[0] }
  );

  if (!page) return notFound();

  return (
    <>
      <AdminBar collection="pages" id={page.id} />
      <h1>{page.title}</h1>
      <LexicalSerializer
        nodes={
          (
            page.content as unknown as {
              jsonContent: SerializedLexicalEditorState;
            }
          ).jsonContent.root.children
        }
      />
    </>
  );
};

export default Page;
