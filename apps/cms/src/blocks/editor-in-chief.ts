import type { Block } from "payload/types";

export const EditorInChief = {
  slug: "editor-in-chief",
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "type",
      type: "select",
      required: true,
      options: [
        {
          label: "Boring",
          value: "boring",
        },
        {
          label: "DVD",
          value: "dvd",
        },
      ],
      defaultValue: "boring",
    },
  ],
} satisfies Block;
