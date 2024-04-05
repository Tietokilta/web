import type { Board } from "@tietokilta/cms-types/payload";
import type { CollectionConfig, FilterOptions } from "payload/types";
import { signedIn } from "../../access/signed-in";
import { guildYearField } from "../../fields/guild-year";

const filterCurrentYear: FilterOptions<Board> = ({ data }) => ({
  guildYear: {
    equals: data.year,
  },
});

export const Boards = {
  slug: "boards",
  defaultSort: "-year",
  admin: {
    useAsTitle: "year",
    defaultColumns: ["year", "groupPhoto"],
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
      name: "groupPhoto",
      type: "relationship",
      relationTo: "media",
    },
    {
      name: "boardMembers",
      type: "array",
      required: true,
      minRows: 3,
      fields: [
        {
          name: "boardMember",
          type: "relationship",
          relationTo: "board-members",
          filterOptions: filterCurrentYear,
        },
      ],
    },
  ],
} as const satisfies CollectionConfig;
