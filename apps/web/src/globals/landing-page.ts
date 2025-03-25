import type { LandingPage as LandingPageType } from "@tietokilta/cms-types/payload";
import type { FilterOptions, GlobalConfig } from "payload";

const filterEventsListPages: FilterOptions<LandingPageType> = () =>
  ({
    and: [
      {
        type: {
          equals: "events-list",
        },
      },
    ],
  }) as const;

export const LandingPage: GlobalConfig = {
  slug: "landing-page",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "heroTexts",
      type: "array",
      localized: true,
      required: true,
      fields: [
        {
          name: "text",
          type: "text",
          maxLength: 120,
        },
      ],
    },
    {
      name: "heroImages",
      type: "array",
      required: true,
      minRows: 1,
      fields: [
        // {
        //   name: "image",
        //   type: "relationship",
        //   relationTo: "media",
        // },
      ],
    },
    {
      name: "eventsListPage",
      type: "relationship",
      relationTo: "pages",
      required: true,
      filterOptions: filterEventsListPages,
    },
    {
      name: "announcement",
      type: "relationship",
      relationTo: "news",
    },
    {
      name: "body",
      type: "richText",
      required: true,
      localized: true,
    },
  ],
};
