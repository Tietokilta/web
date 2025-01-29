import type { LinkRowBlockLink } from "@tietokilta/cms-types/payload";
import type { Block, GlobalConfig } from "payload/types";
import { iconField } from "../fields/icon-field";
import { PartnerStatusField } from "../collections/partners";

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
              _: Partial<NonNullable<LinkRowBlockLink>[number]>,
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
              _: Partial<NonNullable<LinkRowBlockLink>[number]>,
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
  interfaceName: "SponsorLogoRowBlock",
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
    },
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
          required: true,
        },
      ],
    },
  ],
};

const PartnersRowBlock = {
  slug: "partners-row",
  interfaceName: "PartnersRowBlock",
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "size",
      type: "select",
      options: ["small", "medium", "large"],
    },
    {
      name: "types",
      type: "select",
      hasMany: true,
      options: PartnerStatusField.options.filter(
        (option) => option.value !== "inactive",
      ),
    },
  ],
} satisfies Block;

export const Footer: GlobalConfig = {
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
      blocks: [LinkRowBlock, LogoRowBlock, PartnersRowBlock],
    },
  ],
};
