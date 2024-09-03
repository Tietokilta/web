import type { CollectionConfig, FieldHook } from "payload/types";
import { type WeeklyNewsletter } from "@tietokilta/cms-types/payload";
import { signedIn } from "../../access/signed-in";
import { revalidateCollection } from "../../hooks/revalidate-collection";
import { publishedOrSignedIn } from "../../access/published-or-signed-in";

const formatSlug: FieldHook<WeeklyNewsletter, WeeklyNewsletter["slug"]> = ({
  data,
  req,
}) => {
  if (!data?.title) {
    req.payload.logger.warn("No title found for slug generation");
    return;
  }

  return data.title
    .toLocaleLowerCase("en-US")
    .replace(/\s/g, "-")
    .replace(/[^a-z0-9-]/g, "");
};

export const WeeklyNewsletters: CollectionConfig = {
  slug: "weekly-newsletters",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "newsItems", "updatedAt", "createdAt"],
  },
  access: {
    read: publishedOrSignedIn,
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
    {
      name: "slug",
      type: "text",
      localized: true,
      hooks: {
        beforeChange: [formatSlug],
      },
      admin: {
        readOnly: true,
        position: "sidebar",
      },
    },
  ],
  hooks: {
    afterChange: [revalidateCollection<WeeklyNewsletter>("weekly-newsletters")],
  },
  versions: {
    drafts: true,
  },
};
