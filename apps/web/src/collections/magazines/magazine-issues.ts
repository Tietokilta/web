import type { MagazineIssue } from "@tietokilta/cms-types/payload";
import type { CollectionConfig, FieldHook } from "payload";
import { signedIn } from "../../access/signed-in";
import { guildYearField } from "../../fields/guild-year";
import { revalidateCollection } from "../../hooks/revalidate-collection";

const formatTitle: FieldHook<MagazineIssue> = ({ data }) => {
  if ((!data?.issueNumber && data?.issueNumber !== 0) || !data.year) return "";
  let baseTitle = "";
  if (data.textIssueNumber) {
    baseTitle = `${data.textIssueNumber}/${data.year}`;
  } else {
    baseTitle = `${data.issueNumber.toString()}/${data.year}`;
  }
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
    // {
    //   name: "file",
    //   type: "relationship",
    //   relationTo: "documents",
    //   required: true,
    // },
    // {
    //   name: "thumbnail",
    //   type: "relationship",
    //   relationTo: "media",
    //   required: true,
    // },
    {
      name: "name",
      type: "text",
      admin: {
        description:
          "Optional name to be displayed after issue number and year. Mainly used for older Alkorytmi issues.",
      },
    },
    {
      name: "textIssueNumber",
      type: "text",
      admin: {
        description:
          "Optional text to be displayed instead of numerical issue number. Order of issues is still determined by numerical issueNumber.",
      },
    },
  ],
  hooks: {
    afterChange: [
      revalidateCollection("magazine-issues"),
      revalidateCollection("magazines"),
    ],
  },
};
