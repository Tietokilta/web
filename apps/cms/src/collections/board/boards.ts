import type { Board } from "@tietokilta/cms-types/payload";
import type { CollectionConfig, FilterOptions } from "payload/types";
import { signedIn } from "../../access/signed-in";
import { guildYearField } from "../../fields/guild-year";

const filterCurrentYear: FilterOptions<Board> = ({ data }) => ({
  guildYear: {
    equals: data.year,
  },
});

export const Boards: CollectionConfig = {
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
      name: "description",
      maxLength: 360,
      type: "textarea",
      localized: true,
      required: true,
    },
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
};
