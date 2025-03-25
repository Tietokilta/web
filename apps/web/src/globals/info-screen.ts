import type { GlobalConfig } from "payload/types";

export const InfoScreen: GlobalConfig = {
  slug: "info-screen",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "showKanttiinit",
      type: "checkbox",
      defaultValue: true,
    },
    {
      name: "showEvents",
      type: "checkbox",
      defaultValue: true,
    },
    {
      name: "showHSL",
      type: "checkbox",
      defaultValue: true,
    },
    {
      name: "additionalIframes",
      type: "array",
      fields: [
        {
          name: "IframeUrl",
          required: true,
          type: "text",
        },
        {
          name: "IframeTitle",
          required: true,
          type: "text",
        },
        { name: "enabled", type: "checkbox", defaultValue: true },
      ],
    },
  ],
};
