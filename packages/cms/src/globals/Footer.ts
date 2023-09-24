import { iconField } from "../fields/iconField";
import { LinkRowBlockLink } from "../payload-types";

import { Block, GlobalConfig } from "payload/types";

const LinkRowBlock: Block = {
  slug: "link-row",
  interfaceName: "LinkRowBlock",
  fields: [
    {
      name: "showLabel",
      type: "checkbox",
      defaultValue: true,
      required: true,
    },
    {
      name: "links",
      type: "array",
      interfaceName: "LinkRowBlockLink",
      fields: [
        iconField({ required: true }),
        {
          name: "label",
          type: "text",
          required: true, // always required (used in alt text when showLabel = false)
          localized: true,
        },
        {
          name: "linkType",
          type: "radio",
          options: [
            {
              label: "External URL",
              value: "external",
            },
            {
              label: "Internal page",
              value: "internal",
            },
          ],
        },
        {
          name: "url",
          type: "text",
          required: true,
          admin: {
            condition: (
              _,
              siblingData: Partial<NonNullable<LinkRowBlockLink>[number]>,
            ) => siblingData.linkType === "external",
          },
        },
        {
          name: "page",
          type: "relationship",
          relationTo: "pages",
          required: true,
          admin: {
            condition: (
              _,
              siblingData: Partial<NonNullable<LinkRowBlockLink>[number]>,
            ) => siblingData.linkType === "internal",
          },
        },
      ],
    },
  ],
};

const LogoRowBlock: Block = {
  slug: "logo-row",
  interfaceName: "LogoRowBlock",
  fields: [
    {
      name: "logos",
      type: "array",
      fields: [
        {
          name: "image",
          type: "relationship",
          relationTo: "media",
          required: true,
        },
        {
          name: "link",
          type: "text",
        },
      ],
    },
  ],
};

const Footer: GlobalConfig = {
  slug: "footer",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "layout",
      type: "blocks",
      required: true,
      minRows: 1,
      blocks: [LinkRowBlock, LogoRowBlock],
    },
  ],
};

export default Footer;
