import type { Block } from "payload/types";

export const GoogleForm = {
  slug: "google-form",
  fields: [
    {
      name: "link",
      type: "text",
      required: true,
      admin: {
        description: "Copy link from src attribute of embed HTML",
      },
    },
  ],
} satisfies Block;
