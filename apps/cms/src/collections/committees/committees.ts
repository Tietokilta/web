import type { Committee } from "@tietokilta/cms-types/payload";
import type { CollectionConfig, FilterOptions } from "payload/types";
import { signedIn } from "../../access/signed-in";
import { guildYearField } from "../../fields/guild-year";

const filterCurrentYear: FilterOptions<Committee> = ({ data }) => ({
  guildYear: {
    equals: data.year,
  },
});

export const Committees: CollectionConfig = {
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
      name: "description",
      type: "richText",
      localized: true,
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
          type: "relationship",
          relationTo: "committee-members",
          filterOptions: filterCurrentYear,
        },
      ],
    },
  ],
};
