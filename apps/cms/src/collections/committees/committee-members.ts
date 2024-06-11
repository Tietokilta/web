import type { CollectionConfig, FieldHook } from "payload/types";
import { signedIn } from "../../access/signed-in";
import { guildYearField } from "../../fields/guild-year";
import { revalidateCollection } from "../../hooks/revalidate-collection";
import { CommitteeMember } from "@tietokilta/cms-types/payload";

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
        beforeChange: [
          ({ siblingData }) => {
            // ensures data is not stored in DB
            delete siblingData.displayTitle;
          },
        ],
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
