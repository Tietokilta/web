import type { CollectionConfig, FieldHook } from "payload/types";
import type { AwardedHonor } from "@tietokilta/cms-types/payload";
import { signedIn } from "../../access/signed-in";
import { guildYearField } from "../../fields/guild-year";

const formatDisplayTitle: FieldHook<AwardedHonor> = ({
  data: awardedHonor,
}) => {
  if (!awardedHonor?.name) {
    return "Untitled member";
  }

  if (!awardedHonor.guildYear) {
    return awardedHonor.name;
  }

  return `${awardedHonor.name}, ${awardedHonor.guildYear}`;
};

export const AwardedHonors = {
  slug: "awarded-honors",
  defaultSort: "-guildYear",
  admin: {
    useAsTitle: "displayTitle",
    defaultColumns: ["description", "guildYear"],
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
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
      required: false,
      localized: true,
    },
  ],
} as const satisfies CollectionConfig;
