import { richTextField } from "../fields/richTextField";

import { GlobalConfig } from "payload/types";

const LandingPage: GlobalConfig = {
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
    richTextField({
      name: "body",
      required: true,
      localized: true,
    }),
  ],
};

export default LandingPage;