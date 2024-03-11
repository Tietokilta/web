import type { CollectionConfig } from "payload/types";
import { signedIn } from "../../access/signed-in";

export const WeeklyNewsletters: CollectionConfig = {
  slug: "weekly-newsletters",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "newsItems", "updatedAt", "createdAt"],
  },
  access: {
    read: () => true,
    create: signedIn,
    update: signedIn,
    delete: signedIn,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "greetings",
      type: "richText",
      required: true,
      localized: true,
    },
    {
      name: "newsItems",
      localized: true,
      type: "array",
      fields: [
        {
          name: "newsItem",
          type: "relationship",
          relationTo: "news-items",
          required: true,
        },
      ],
    },
  ],
};
