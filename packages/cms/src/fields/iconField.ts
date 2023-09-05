import type { Field, FieldBase } from "payload/dist/fields/config/types";

export const iconField = (
  base: Omit<FieldBase, "name"> & { name?: string } = {},
): Field => ({
  name: "icon",
  hasMany: false,
  ...base,
  type: "select",
  options: [
    { label: "PhotographOutline", value: "PhotographOutline" },
    { label: "CashOutline", value: "CashOutline" },
    { label: "BookmarkAltOutline", value: "BookmarkAltOutline" },
  ], // TODO: load these automatically from the UI library
});
