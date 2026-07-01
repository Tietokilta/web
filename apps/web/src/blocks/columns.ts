import { lexicalEditor } from "@payloadcms/richtext-lexical";
import type { Block } from "payload";

export const Columns = {
  slug: "columns",
  fields: [
    {
      name: "columns",
      type: "array",
      required: true,
      minRows: 2,
      labels: { singular: "Column", plural: "Columns" },
      fields: [
        {
          name: "content",
          type: "richText",
          editor: lexicalEditor({}),
          required: true,
          localized: true,
        },
      ],
    },
  ],
} satisfies Block;
