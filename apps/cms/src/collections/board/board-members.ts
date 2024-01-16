import type { CollectionConfig } from "payload/types";
import { signedIn } from "../../access/signed-in";
import { guildYearField } from "../../fields/guild-year";

export const BoardMembers: CollectionConfig = {
  slug: "board-members",
  defaultSort: "-guildYear",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["guildYear", "photo", "name", "title"],
  },
  access: {
    read: () => true,
    create: signedIn,
    update: signedIn,
    delete: signedIn,
  },
  fields: [
    guildYearField({
      name: "guildYear",
      required: true,
    }),
    {
      name: "photo",
      type: "relationship",
      relationTo: "media",
    },
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "email",
      type: "email",
      required: true,
    },
    {
      name: "telegram",
      type: "text",
      required: true,
    },
  ],
};
