import type { Block } from "payload/types";
import { guildYearField } from "../fields/guild-year";

export const CommitteesInYear = {
  slug: "committees-in-year",
  fields: [
    guildYearField({
      name: "year",
      required: true,
    }),
  ],
} satisfies Block;
