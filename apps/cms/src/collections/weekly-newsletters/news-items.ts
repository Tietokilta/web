import type { CollectionConfig, FieldHook } from "payload/types";
import type { NewsItem } from "@tietokilta/cms-types/payload";
import { signedIn } from "../../access/signed-in";
import { newsItemCategoryField } from "../../fields/news-item-category";
import { getLocale } from "../../util";

const formatDisplayTitle: FieldHook<NewsItem> = ({ data: newsItem, req }) => {
  if (!newsItem?.title) {
    return "Untitled news item";
  }

  if (!newsItem.date) {
    return newsItem.title;
  }

  const locale = getLocale(req) ?? "fi";
  const date = new Date(newsItem.date).toLocaleDateString(`${locale}-FI`);

  return `${newsItem.title} - ${date}`;
};

export const NewsItems: CollectionConfig = {
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
        beforeChange: [
          ({ siblingData }) => {
            // ensures data is not stored in DB
            delete siblingData.displayTitle;
          },
        ],
        afterRead: [formatDisplayTitle],
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
      name: "content",
      type: "richText",
      required: true,
      localized: true,
    },
  ],
};
