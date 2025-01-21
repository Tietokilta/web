import type { Field, FieldBase } from "payload/dist/fields/config/types";

export const newsItemCategoryField = (
  base: Omit<FieldBase, "name"> & { name?: string } = {},
): Field => ({
  name: "newsItemCategory",
  hasMany: false,
  ...base,
  type: "select",
  options: [
    {
      label: {
        fi: "Kilta",
        en: "Guild",
      },
      value: "guild",
    },
    {
      label: {
        fi: "Ayy & Aalto",
        en: "Ayy & Aalto",
      },
      value: "ayy-aalto",
    },
    {
      label: {
        fi: "Muut",
        en: "Other",
      },
      value: "other",
    },
    {
      label: {
        fi: "Pohjanurkkaus",
        en: "Bottom Corner",
      },
      value: "bottom-corner",
    },
  ],
  defaultValue: "guild",
});
