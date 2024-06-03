import type { Block } from "payload/types";

export const ImageLinkGrid = {
  slug: "image-link-grid",
  fields: [
    {
      name: "size",
      type: "select",
      options: ["small", "medium", "large"],
    },
    {
      name: "images",
      type: "array",
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
        {
          name: "caption",
          type: "text",
          localized: true,
        },
        {
          name: "externalLink",
          type: "text",
          localized: true,
        },
      ],
    },
  ],
} satisfies Block;
