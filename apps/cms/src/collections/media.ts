import path from "path";
import type { CollectionConfig } from "payload/types";
import { type PayloadHandler } from "payload/config";
import { signedIn } from "../access/signed-in";
import { useCloudStorage } from "../util";
import { mediaImportController } from "../controllers/media-import-controller";

export const Media = {
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
    staticURL: "/media",
    staticDir: !useCloudStorage()
      ? path.resolve(__dirname, "../../uploads/media")
      : undefined,
  },
  fields: [
    {
      name: "alt",
      label: "Alt Text",
      localized: true,
      type: "text",
      required: true,
      minLength: 1,
    },
    { name: "photographer", type: "text" },
    {
      name: "mediaType",
      label: "Media Type",
      type: "select",
      options: [
        {
          label: "Image",
          value: "image",
        },
        {
          label: "Logo",
          value: "logo",
        },
      ],
      defaultValue: "image",
    },
  ],
  endpoints: [
    {
      path: "/upload",
      method: "post",
      handler: (req, res, next) => {
        mediaImportController(req, res).then(null, next);
      },
    },
  ],
} as const satisfies CollectionConfig;

export type MediaSlug = (typeof Media)["slug"];
