import type { MagazineIssue } from "@tietokilta/cms-types/payload";
import type { CollectionConfig, FieldHook } from "payload/types";
import { signedIn } from "../../access/signed-in";
import { guildYearField } from "../../fields/guild-year";

const formatTitle: FieldHook<MagazineIssue> = ({ data }) => {
  if (!data) return "";
  const baseTitle = `${data.issueNumber}/${data.year}`;
  if (!data.name) {
    return baseTitle;
  }
  return `${baseTitle}: ${data.name}`;
};

export const MagazineIssues: CollectionConfig = {
  slug: "magazine-issues",
  admin: {
    useAsTitle: "title",
  },
  access: {
    read: () => true,
    create: signedIn,
    update: signedIn,
    delete: signedIn,
  },
  fields: [
    {
      name: "title",
      type: "text",
      hooks: {
        afterRead: [formatTitle],
      },
      admin: {
        readOnly: true,
      },
    },
    guildYearField({
      name: "year",
      required: true,
    }),
    {
      name: "issueNumber",
      type: "number",
      required: true,
    },
    {
      name: "file",
      type: "relationship",
      relationTo: "documents",
      required: true,
    },
    {
      name: "thumbnail",
      type: "relationship",
      relationTo: "media",
      required: true,
    },
    {
      name: "name",
      type: "text",
    },
  ],
};
