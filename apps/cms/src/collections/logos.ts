import path from "path";
import type { CollectionConfig } from "payload/types";
import { signedIn } from "../access/signed-in";
import { useCloudStorage } from "../util";

export const Logos: CollectionConfig = {
  slug: "logos",
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
    staticURL: "/logos",
    staticDir: !useCloudStorage()
      ? path.resolve(__dirname, "../../uploads/logos")
      : undefined,
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
