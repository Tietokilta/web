import type { Page } from "@tietokilta/cms-types/payload";
import { isNil, omitBy } from "lodash";
import type { CollectionConfig, FieldHook } from "payload/types";
import { publishedAndVisibleOrSignedIn } from "../access/published-and-visible-or-signed-in";
import { signedIn } from "../access/signed-in";
import { revalidatePage } from "../hooks/revalidate-page";
import { generatePreviewUrl } from "../preview";
import { getLocale } from "../util";

const formatPath: FieldHook<Page> = async ({ data, req }) => {
  const locale = getLocale(req) ?? "fi";
  if (data) {
    if (data.topic && data.slug) {
      const topic = await req.payload.findByID({
        collection: "topics",
        id: data.topic.value as string,
        locale,
      });
      return `/${locale}/${topic.slug}/${data.slug}`;
    } else if (data.slug) {
      return `/${locale}/${data.slug}`;
    }
  }
};

export const Pages: CollectionConfig = {
  slug: "pages",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["path", "title"],
    listSearchableFields: ["path", "title"],
    preview: generatePreviewUrl<Page>((doc) => {
      return doc.path ?? "/";
    }),
  },
  access: {
    read: publishedAndVisibleOrSignedIn,
    create: signedIn,
    update: signedIn,
    delete: signedIn,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "description",
      maxLength: 360,
      type: "textarea",
      localized: true,
      required: true,
    },
    {
      name: "content",
      type: "richText",
      localized: true,
      required: true,
    },
    {
      name: "path",
      type: "text",
      hooks: {
        afterRead: [formatPath],
      },
      admin: {
        readOnly: true,
        position: "sidebar",
      },
    },
    {
      name: "topic",
      type: "relationship",
      relationTo: ["topics"],
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      localized: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "hidden",
      type: "checkbox",
      required: true,
      defaultValue: false,
      label: "Hide from public",
      admin: {
        position: "sidebar",
      },
    },
  ],
  versions: {
    drafts: {
      autosave: true,
    },
  },
  hooks: {
    afterChange: [
      revalidatePage<Page>("pages", async (doc, req) => {
        const locale = getLocale(req);
        if (!locale) {
          req.payload.logger.error(
            "locale not set, cannot revalidate properly",
          );
          return;
        }
        const topic =
          doc.topic &&
          (await req.payload.findByID({
            collection: "topics",
            id: doc.topic.value as string,
            locale,
          }));
        return {
          where: omitBy(
            {
              slug: { equals: doc.slug },
              topic: topic ? { slug: { equals: topic.slug } } : null,
            },
            isNil,
          ),
          locale,
        };
      }),
    ],
  },
};
