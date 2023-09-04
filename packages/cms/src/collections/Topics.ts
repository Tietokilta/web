import { loggedIn } from "../access/loggedIn";

import { CollectionConfig } from "payload/types";

const Topics: CollectionConfig = {
  slug: "topics",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["slug", "title"],
    listSearchableFields: ["slug", "title"],
  },
  access: {
    read: () => true,
    create: loggedIn,
    update: loggedIn,
    delete: loggedIn,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      localized: true,
    },
  ],
};

export default Topics;
