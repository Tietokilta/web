import type { Page } from "@tietokilta/cms-types/payload";
import { isNil, omitBy } from "lodash";
import type { CollectionConfig, FieldHook } from "payload/types";
import { publishedAndVisibleOrSignedIn } from "../access/published-and-visible-or-signed-in";
import { signedIn } from "../access/signed-in";
import { revalidatePage } from "../hooks/revalidate-page";
import { generatePreviewUrl } from "../preview";
import { getLocale } from "../util";

const formatPath: FieldHook<Page> = async ({ data, req }) => {
  if (!data?.slug || !req.payload.config.localization) {
    req.payload.logger.warn(
      "Could not format page path: missing slug or localization config",
      data,
    );
    return;
  }

  const availableLocales = req.payload.config.localization.localeCodes;
  const reqLocale = getLocale(req) ?? "fi";
  const requestedAllLocales = reqLocale === "all" || reqLocale === "*";

  if (!data.topic) {
    if (!requestedAllLocales) {
      return `/${reqLocale}/${data.slug}`;
    }

    const slug = data.slug as unknown as Record<string, string>;
    const localizedPaths = availableLocales.reduce<Record<string, string>>(
      (allPaths, locale) => ({
        ...allPaths,
        [locale]: `/${locale}/${slug[locale]}`,
      }),
      {},
    );

    return localizedPaths;
  }

  const topic = await req.payload.findByID({
    collection: "topics",
    id: data.topic.value as string,
    locale: req.locale,
  });

  if (!requestedAllLocales) {
    return `/${reqLocale}/${topic.slug}/${data.slug}`;
  }

  const topicSlug = topic.slug as unknown as Record<string, string>;
  const pageSlug = data.slug as unknown as Record<string, string>;
  const localizedPaths = availableLocales.reduce<Record<string, string>>(
    (allPaths, locale) => ({
      ...allPaths,
      [locale]: `/${locale}/${topicSlug[locale]}/${pageSlug[locale]}`,
    }),
    {},
  );

  return localizedPaths;
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
      revalidatePage<Page>("pages", async (doc, req) => {
        const locale = getLocale(req);
        if (!locale) {
          req.payload.logger.error(
            "locale not set, cannot revalidate properly",
          );
          return;
        }

        const page = await req.payload.findByID({
          collection: "pages",
          id: doc.id,
          locale: "all",
        });
        const topic =
          doc.topic &&
          (await req.payload.findByID({
            collection: "topics",
            id: doc.topic.value as string,
            locale: "all",
          }));

        const allLocalesPageSlug = page.slug as unknown as Record<
          string,
          string
        >;
        const localizedTopicSlug = topic?.slug as unknown as
          | Record<string, string>
          | undefined;

        const localizedSlugKey = `slug.${locale}`;
        const localizedTopicKey = `topic.${locale}`;

        return {
          where: omitBy(
            {
              [localizedSlugKey]: { equals: allLocalesPageSlug[locale] },
              [localizedTopicKey]: localizedTopicSlug
                ? {
                    [localizedSlugKey]: {
                      equals: localizedTopicSlug[locale],
                    },
                  }
                : null,
            },
            isNil,
          ),
          locale: "all",
        };
      }),
    ],
  },
};
