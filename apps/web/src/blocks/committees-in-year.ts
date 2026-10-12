import type { Block } from "payload";
import { guildYearField } from "../fields/guild-year";

export const CommitteesInYear = {
  slug: "committees-in-year",
  interfaceName: "CommitteesInYearBlock",
  fields: [
    guildYearField({
      name: "year",
      required: true,
    }),
  ],
} satisfies Block;
