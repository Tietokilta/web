import { loggedIn } from "../access/loggedIn";

import { CollectionConfig } from "payload/types";

import path from "path";

const Media: CollectionConfig = {
  slug: "media",
  access: {
    // TODO: this
    read: () => true,
    create: loggedIn,
    update: loggedIn,
    delete: loggedIn,
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
    },
  ],
};

export default Media;
