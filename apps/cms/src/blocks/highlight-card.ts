import { lexicalEditor } from "@payloadcms/richtext-lexical";
import type { Block } from "payload/types";

export const HighlightCard = {
  slug: "highlight-card",
  fields: [
    {
      name: "content",
      type: "richText",
      editor: lexicalEditor({}),
      required: true,
    },
  ],
} satisfies Block;
