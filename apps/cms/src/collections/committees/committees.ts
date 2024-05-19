import type { Committee } from "@tietokilta/cms-types/payload";
import type { CollectionConfig, FilterOptions } from "payload/types";
import { type PayloadHandler } from "payload/config";
import { signedIn } from "../../access/signed-in";
import { guildYearField } from "../../fields/guild-year";
import { revalidateCollection } from "../../hooks/revalidate-collection";
import { importController } from "../../controllers/import-controller";

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
      name: "committeeMembers",
      type: "array",
      required: true,
      minRows: 1,
      fields: [
        {
          name: "committeeMember",
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
      handler: importController as PayloadHandler,
    },
  ],
} as const satisfies CollectionConfig;

export type CommitteesSlug = (typeof Committees)["slug"];
