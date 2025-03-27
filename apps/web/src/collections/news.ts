import type { CollectionConfig } from "payload";
import { signedIn } from "../access/signed-in";
import { revalidateCollection } from "../hooks/revalidate-collection";

export const News: CollectionConfig = {
  slug: "news",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["slug", "title", "excerpt"],
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
      maxLength: 80,
      localized: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      localized: true,
    },
    {
      name: "excerpt",
      type: "textarea",
      required: true,
      maxLength: 360,
      localized: true,
    },
    {
      name: "ctaType",
      type: "radio",
      required: true,
      defaultValue: "none",
      options: [
        {
          label: "None",
          value: "none",
        },
        {
          label: "NewsLink",
          value: "news",
        },
        {
          label: "PageLink",
          value: "page",
        },
        {
          label: "ExternalLink",
          value: "external",
        },
      ],
    },
    {
      name: "pageLink",
      type: "relationship",
      admin: {
        condition: (_, siblingData) => siblingData.ctaType === "page",
      },
      relationTo: "pages",
      required: true,
    },
    {
      name: "externalLink",
      type: "text",
      admin: {
        condition: (_, siblingData) => siblingData.ctaType === "external",
      },
      validate: (value: unknown) => {
        try {
          // eslint-disable-next-line no-new -- we want to throw an error if the URL is invalid
          new URL(value as string);
        } catch {
          return "Invalid URL";
        }

        return true;
      },
      required: true,
    },
    {
      name: "type",
      type: "select",
      defaultValue: "announcement",
      options: [
        { label: "Announcement", value: "announcement" },
        { label: "Warning", value: "warning" },
        { label: "Danger", value: "danger" },
      ],
    },
    {
      name: "author",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "content",
      type: "richText",
      required: true,
      localized: true,
    },
  ],
  hooks: {
    afterChange: [revalidateCollection("news")],
  },
};
