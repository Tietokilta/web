import type { CollectionConfig, FilterOptions } from "payload";
import type { Admin } from "@payload-types";
import { signedIn } from "../../access/signed-in";
import { guildYearField } from "../../fields/guild-year";

const filterCurrentYear: FilterOptions<Admin> = ({ data }) => ({
  guildYear: {
    equals: data.year,
  },
});

export const Admins = {
  slug: "admins",
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
      name: "adminMembers",
      type: "array",
      required: true,
      minRows: 1,
      fields: [
        {
          name: "adminMember",
          type: "relationship",
          relationTo: "admin-members",
          filterOptions: filterCurrentYear,
        },
      ],
    },
  ],
} as const satisfies CollectionConfig;
