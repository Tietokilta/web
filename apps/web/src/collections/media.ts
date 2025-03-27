import type { CollectionConfig } from "payload";
import { signedIn } from "../access/signed-in";
import { isCloudStorageEnabled } from "../util";
// import { mediaImportController } from "../controllers/media-import-controller";

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
    staticDir: !isCloudStorageEnabled()
      ? "uploads/api/media/file" // new URL("../../uploads/media", import.meta.url).pathname
      : undefined,
    // For audio and _especially_ video, please redirect to using something like YouTube
    mimeTypes: ["image/*"],
    // workaround for https://github.com/payloadcms/payload/issues/7624
    modifyResponseHeaders({ headers }) {
      if (headers.get("content-type") === "application/xml") {
        headers.set("content-type", "image/svg+xml; charset=utf-8");
      }
      return headers;
    },
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
  // endpoints: [
  //   {
  //     path: "/upload",
  //     method: "post",
  //     handler: (req, res, next) => {
  //       mediaImportController(req, res).then(null, next);
  //     },
  //   },
  // ],
} as const satisfies CollectionConfig;
