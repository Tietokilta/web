import { icons } from "@tietokilta/ui";
import type { Field, FieldBase } from "payload/dist/fields/config/types";

export const iconField = (
  base: Omit<FieldBase, "name"> & { name?: string } = {},
): Field => ({
  name: "icon",
  hasMany: false,
  ...base,
  type: "select",
  options: Object.keys(icons).map((label) => ({
    label,
    value: label,
  })),
});
