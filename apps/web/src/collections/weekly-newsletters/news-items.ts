import type { CollectionConfig, FieldHook } from "payload";
import type { NewsItem } from "@payload-types";
import { signedIn } from "../../access/signed-in";
import { newsItemCategoryField } from "../../fields/news-item-category";
import { getLocale } from "../../util";
import { revalidateCollection } from "../../hooks/revalidate-collection";

const formatDisplayTitle: FieldHook<NewsItem> = ({ data: newsItem, req }) => {
  if (!newsItem?.title) {
    return "Untitled news item";
  }

  if (!newsItem.date) {
    return newsItem.title;
  }

  const locale = getLocale(req);
  const date = new Date(newsItem.date).toLocaleDateString(`${locale}-FI`);

  return `${newsItem.title} - ${date}`;
};

export const NewsItems = {
  slug: "news-items",
  admin: {
    useAsTitle: "displayTitle",
    defaultColumns: [
      "displayTitle",
      "newsItemCategory",
      "updatedAt",
      "createdAt",
    ],
  },
  access: {
    read: () => true,
    create: signedIn,
    update: signedIn,
    delete: signedIn,
  },
  fields: [
    {
      name: "displayTitle",
      type: "text",
      admin: {
        hidden: true,
      },
      hooks: {
        beforeChange: [formatDisplayTitle],
      },
    },
    {
      name: "title",
      type: "text",
      localized: true,
      required: true,
    },
    newsItemCategoryField({
      required: true,
    }),
    {
      name: "date",
      type: "date",
    },
    {
      type: "row",
      fields: [
        {
          name: "signupStartDate",
          type: "date",
        },
        {
          name: "signupEndDate",
          type: "date",
        },
      ],
    },
    {
      name: "linkToSignUp",
      type: "text",
      required: false,
      localized: false,
    },
    {
      name: "content",
      type: "richText",
      required: true,
      localized: true,
    },
  ],
  hooks: {
    afterChange: [
      revalidateCollection("news-items"),
      revalidateCollection("weekly-newsletters"),
    ],
  },
} as const satisfies CollectionConfig;
