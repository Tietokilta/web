import type { CollectionConfig, FieldHook } from "payload";
import { type WeeklyNewsletter } from "@payload-types";
import { publishedOrSignedIn } from "../../access/published-or-signed-in";
import { signedIn } from "../../access/signed-in";
import {
  getEmailController,
  getTelegramMessageController,
  newsletterSenderController,
} from "../../controllers/newsletter-controller";
import { revalidateCollection } from "../../hooks/revalidate-collection";

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
      name: "publishDate",
      type: "date",
      required: false,
      localized: false,
      admin: {
        description:
          "If empty, value will be set to publish date when newsletter is first published",
      },
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
    {
      name: "sendEmailButton",
      type: "ui",
      admin: {
        components: {
          Field:
            "/src/collections/weekly-newsletters/newsletter-button#NewsletterButton",
        },
        position: "sidebar",
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({
        data,
        originalDoc,
      }: {
        data?: Partial<WeeklyNewsletter>;
        originalDoc?: WeeklyNewsletter;
      }) => {
        const isPublishing =
          data?._status === "published" && originalDoc?._status !== "published";

        if (isPublishing && !originalDoc?.publishDate) {
          return {
            ...data,
            publishDate: new Date().toISOString(),
          };
        }

        return data;
      },
    ],
    afterChange: [revalidateCollection<WeeklyNewsletter>("weekly-newsletters")],
  },
  endpoints: [
    {
      path: "/mail/:newsletterId",
      method: "post",
      handler: newsletterSenderController,
    },
    {
      path: "/mail/:newsletterId",
      method: "get",
      handler: getEmailController,
    },
    {
      path: "/telegram/:newsletterId",
      method: "get",
      handler: getTelegramMessageController,
    },
  ],
  versions: {
    drafts: true,
  },
};
