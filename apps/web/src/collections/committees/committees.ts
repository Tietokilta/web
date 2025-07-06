import type { CollectionConfig, FilterOptions } from "payload";
import type { Committee } from "@payload-types";
import { signedIn } from "../../access/signed-in";
import { guildYearField } from "../../fields/guild-year";
import { revalidateCollection } from "../../hooks/revalidate-collection";
import { committeesImportController } from "../../controllers/committees-import-controller";

const filterCurrentYear: FilterOptions<Committee> = ({ data }) => ({
  guildYear: {
    equals: data.year,
  },
});

export const Committees = {
  slug: "committees",
  defaultSort: "-year",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["year", "name", "committeeMembers"],
  },
  access: {
    read: () => true,
    create: signedIn,
    update: signedIn,
    delete: signedIn,
  },
  fields: [
    guildYearField({
      name: "year",
      required: true,
    }),
    {
      name: "name",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "hidden",
      type: "checkbox",
      defaultValue: false,
      required: true,
    },
    {
      name: "committeeMembers",
      type: "array",
      required: true,
      minRows: 1,
      fields: [
        {
          name: "committeeMember",
          required: true,
          type: "relationship",
          relationTo: "committee-members",
          filterOptions: filterCurrentYear,
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateCollection<Committee>("committees")],
  },
  endpoints: [
    {
      path: "/import",
      method: "post",
      handler: committeesImportController,
    },
  ],
} as const satisfies CollectionConfig;

export type CommitteesSlug = (typeof Committees)["slug"];
