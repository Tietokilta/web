import type { Block } from "payload/types";
import { PartnerStatusField } from "../collections/partners";

export const PartnersBlock = {
  slug: "partners",
  fields: [
    {
      name: "size",
      type: "select",
      options: ["small", "medium", "large"],
    },
    {
      name: "types",
      type: "select",
      hasMany: true,
      options: PartnerStatusField.options.filter(
        (option) => option.value !== "inactive",
      ),
    },
  ],
} satisfies Block;
