import type { CollectionConfig, FieldHook } from "payload/types";
import type { CommitteeMember } from "@tietokilta/cms-types/payload";
import { type PayloadHandler } from "payload/config";
import { signedIn } from "../../access/signed-in";
import { guildYearField } from "../../fields/guild-year";
import { revalidateCollection } from "../../hooks/revalidate-collection";
import { linkCommitteePhotos } from "../../controllers/link-committee-photos";

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
        beforeChange: [formatDisplayTitle],
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
  endpoints: [
    {
      path: "/link-photos",
      method: "post",
      handler: linkCommitteePhotos as PayloadHandler,
    },
  ],
} as const satisfies CollectionConfig;

export type CommitteeMembersSlug = (typeof CommitteeMembers)["slug"];
