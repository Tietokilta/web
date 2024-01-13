import path from "path";
import type { CollectionConfig } from "payload/types";
import { signedIn } from "../access/signed-in";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    // TODO: this
    read: () => true,
    create: signedIn,
    update: signedIn,
    delete: signedIn,
  },
  admin: {
    useAsTitle: "filename",
    group: "Other",
  },
  upload: {
    // TODO: this
    staticURL: "/media",
    staticDir: path.resolve(__dirname, "../../uploads"),
  },
  fields: [
    {
      name: "alt",
      label: "Alt Text",
      localized: true,
      type: "text",
      required: true,
      minLength: 20,
    },
  ],
};
