import type { GlobalConfig } from "payload/types";

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
      name: "body",
      type: "richText",
      required: true,
      localized: true,
    },
  ],
};
