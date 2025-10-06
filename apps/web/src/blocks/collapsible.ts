import { lexicalEditor } from "@payloadcms/richtext-lexical";
import type { Block } from "payload";

export const Collapsible = {
  slug: "collapsible",
  fields: [
    {
      name: "header",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "content",
      type: "richText",
      editor: lexicalEditor({}),
      required: true,
      localized: true,
    },
  ],
} satisfies Block;
