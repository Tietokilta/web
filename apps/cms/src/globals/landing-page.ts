import type { LandingPage as LandingPageType } from "@tietokilta/cms-types/payload";
import type { FilterOptions, GlobalConfig } from "payload/types";

const filterEventsListPages: FilterOptions<LandingPageType> = () =>
  ({
    and: [
      {
        type: {
          equals: "special",
        },
      },
      {
        specialPageType: {
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
      name: "heroText",
      type: "text",
      localized: true,
      required: true,
    },
    {
      name: "heroImages",
      type: "array",
      required: true,
      minRows: 1,
      fields: [
        {
          name: "image",
          type: "relationship",
          relationTo: "media",
        },
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
