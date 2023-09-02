import { CollectionConfig } from "payload/types";
import path from "path";
import { loggedIn } from "../access/loggedIn";

const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: ({ req, id }) => !!req.user || !!id,
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
    staticDir: path.resolve(__dirname, "../../uploads"),
  },
  fields: [
    {
      name: "alt",
      label: "Alt Text",
      type: "text",
      required: true,
    },
  ],
  versions: {
    drafts: {
      autosave: true,
    },
  },
};

export default Media;
