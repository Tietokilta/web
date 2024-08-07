import type { CollectionConfig, FieldHook } from "payload/types";
import type { CommitteeMember } from "@tietokilta/cms-types/payload";
import { signedIn } from "../../access/signed-in";
import { guildYearField } from "../../fields/guild-year";
import { revalidateCollection } from "../../hooks/revalidate-collection";

const formatDisplayTitle: FieldHook<CommitteeMember> = ({
  data: committeeMember,
}) => {
  if (!committeeMember?.name) {
    return "Untitled member";
  }

  if (!committeeMember.title) {
    return committeeMember.name;
  }

  return `${committeeMember.name}, ${committeeMember.title}`;
};

export const CommitteeMembers = {
  slug: "committee-members",
  defaultSort: "-guildYear",
  admin: {
    useAsTitle: "displayTitle",
    defaultColumns: ["displayTitle", "guildYear", "photo"],
  },
  access: {
    read: () => true,
    create: signedIn,
    update: signedIn,
    delete: signedIn,
  },
  fields: [
    {
      name: "displayTitle",
      type: "text",
      admin: {
        hidden: true,
      },
      hooks: {
        afterRead: [formatDisplayTitle],
      },
    },
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
      name: "chair",
      type: "checkbox",
    },
    {
      name: "telegramUsername",
      type: "text",
    },
  ],
  hooks: {
    afterChange: [
      revalidateCollection("committee-members"),
      revalidateCollection("committees"),
    ],
  },
} as const satisfies CollectionConfig;
