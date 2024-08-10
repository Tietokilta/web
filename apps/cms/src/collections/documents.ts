import path from "path";
import type { CollectionConfig } from "payload/types";
import { signedIn } from "../access/signed-in";
import { useCloudStorage } from "../util";
import { Media } from "./media";

export const Documents: CollectionConfig = {
  slug: "documents",
  access: {
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
    staticURL: "/documents",
    staticDir: !useCloudStorage()
      ? path.resolve(__dirname, "../../uploads/documents")
      : undefined,
  },
  fields: [
    {
      name: "title",
      type: "text",
    },
    {
      name: "thumbnail",
      type: "upload",
      relationTo: Media.slug,
      displayPreview: true,
    },
  ],
};
