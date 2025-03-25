import type { CollectionConfig } from "payload";
import { signedIn } from "../access/signed-in";
import { isCloudStorageEnabled } from "../util";
import { Media } from "./media";

export const Documents = {
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
    // staticURL: "/documents",
    staticDir: !isCloudStorageEnabled()
      ? "documents" // new URL("../../uploads/documents", import.meta.url).pathname
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
} as const satisfies CollectionConfig;
