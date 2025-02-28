import type { FieldBase, SelectField } from "payload";

const currentYear = new Date().getFullYear();
const foundedYear = 1986;

export const guildYearField = (
  base: Omit<FieldBase, "name"> & { name?: string } = {},
): SelectField => ({
  name: "guildYear",
  hasMany: false,
  ...base,
  type: "select",
  defaultValue: currentYear.toFixed(),
  options: Array.from({ length: currentYear - foundedYear + 1 }, (_, i) =>
    (currentYear - i).toFixed(),
  ),
});
