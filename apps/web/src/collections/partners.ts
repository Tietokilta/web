import type { CollectionConfig, SelectField } from "payload";
import { signedIn } from "../access/signed-in";
import { revalidateCollection } from "../hooks/revalidate-collection";

export const PartnerStatusField = {
  name: "status",
  type: "select",
  options: [
    { label: "Partner", value: "partner" },
    { label: "Main Partner", value: "mainPartner" },
    { label: "Inactive", value: "inactive" },
  ],
  required: true,
} satisfies SelectField;

export const Partners = {
  slug: "partners",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "logo", "status"],
  },
  access: {
    read: () => true,
    create: signedIn,
    update: signedIn,
    delete: signedIn,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "logo",
      type: "relationship",
      relationTo: "media",
      required: true,
    },
    {
      name: "logoMonochrome",
      type: "relationship",
      relationTo: "media",
      required: false,
      admin: {
        description:
          "Monochrome logo variant for different backgrounds (inverted based on contrast when needed)",
      },
    },
    PartnerStatusField,
    {
      name: "externalLink",
      type: "text",
      required: true,
    },
  ],
  hooks: {
    afterChange: [revalidateCollection("partners")],
  },
} as const satisfies CollectionConfig;

export type PartnersSlug = (typeof Partners)["slug"];
