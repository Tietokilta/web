import type { Field, FieldBase } from "payload/dist/fields/config/types";

const currentYear = new Date().getFullYear();
const foundedYear = 1986;

export const guildYearField = (
  base: Omit<FieldBase, "name"> & { name?: string } = {},
): Field => ({
  name: "guildYear",
  hasMany: false,
  ...base,
  type: "select",
  defaultValue: currentYear.toFixed(),
  options: Array.from({ length: currentYear - foundedYear + 1 }, (_, i) =>
    (currentYear - i).toFixed(),
  ),
});
