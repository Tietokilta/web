import type {
  CollectionConfig,
  Field,
  FieldHook,
  FieldHookArgs,
  FilterOptions,
  PayloadRequest,
  Locale,
} from "payload";
import { customAlphabet } from "nanoid";
import type { Page, Topic, Page as PageType } from "@payload-types";
import { publishedAndVisibleOrSignedIn } from "../access/published-and-visible-or-signed-in";
import { signedIn } from "../access/signed-in";
import { revalidateCollection } from "../hooks/revalidate-collection";
import { generatePreviewUrl } from "../util/preview";
import { iconField } from "../fields/icon-field";
import { appendToStringOrLocalizedString, getLocale } from "../util";

const nanoid = customAlphabet("abcdefghjklmnpqrstuvwxyz23456789", 6);

type Localized<TField> = Record<Locale["code"], TField>;

const getFormattedPath = async (
  data: Partial<Page> | undefined,
  req: PayloadRequest,
): Promise<Page["path"] | Localized<Page["path"]>> => {
  if (!data?.slug || !req.payload.config.localization) {
    req.payload.logger.warn(
      "Could not format page path: missing slug or localization config",
      data,
    );
    return;
  }

  const availableLocales = req.payload.config.localization.localeCodes;
  const reqLocale = getLocale(req);
  const requestedAllLocales = reqLocale === "all";

  if (!data.topic) {
    if (!requestedAllLocales) {
      return `/${reqLocale}/${data.slug}`;
    }

    const slug = data.slug as unknown as Localized<Page["slug"]>;
    const localizedPaths = availableLocales.reduce<Localized<Page["path"]>>(
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

  const topicSlug = topic.slug as unknown as Localized<Topic["slug"]>;
  const pageSlug = data.slug as unknown as Localized<Page["slug"]>;
  const localizedPaths = availableLocales.reduce<Localized<Page["path"]>>(
    (allPaths, locale) => ({
      ...allPaths,
      [locale]: `/${locale}/${topicSlug[locale]}/${pageSlug[locale]}`,
    }),
    {},
  );

  return localizedPaths;
};

const formatPath: FieldHook<
  Page,
  Page["path"] | Localized<Page["path"]>
> = async ({ originalDoc, data, req }) => {
  const reqLocale = getLocale(req);
  if (!reqLocale) {
    req.payload.logger.warn("Could not format page path: missing locale", data);
    return data?.path;
  }
  const formattedPath = await getFormattedPath(data, req);

  if (!formattedPath || !Object.values(formattedPath).every(Boolean)) {
    return data?.path;
  }

  const existingPages = (
    await req.payload.find({
      collection: "pages",
      limit: 5,
      pagination: false,
      where: {
        ...(typeof formattedPath === "string"
          ? {
              [`path.${reqLocale}`]: { equals: formattedPath },
            }
          : {
              or: Object.entries(formattedPath).map(([locale, path]) => ({
                [`path.${locale}`]: { equals: path },
              })),
            }),
      },
      locale: req.locale,
    })
  ).docs;
  const existsPageWithSamePath = existingPages.some(
    (page) => page.id !== originalDoc?.id,
  );

  if (existsPageWithSamePath) {
    const randomSlug = nanoid();
    return appendToStringOrLocalizedString(formattedPath, `-${randomSlug}`);
  }

  return formattedPath;
};

const filterCyclicPages: FilterOptions<PageType> = ({ data }) => ({
  id: {
    not_equals: data.id,
  },
});

const standardPageFields = [
  {
    name: "tableOfContents",
    type: "select",
    required: true,
    defaultValue: "all",
    options: [
      {
        label: "Show all headings",
        value: "all",
      },
      {
        label: "Show only top-level headings",
        value: "top-level",
      },
      {
        label: "Hide table of contents",
        value: "none",
      },
    ],
    admin: {
      position: "sidebar",
    },
  },
  {
    name: "content",
    type: "richText",
    localized: true,
    required: true,
  },
] satisfies Field[];

const redirectFields = [
  {
    name: "redirectToPage",
    type: "relationship",
    relationTo: "pages",
    required: true,
    filterOptions: filterCyclicPages,
  },
] satisfies Field[];

export const Pages = {
  slug: "pages",
  admin: {
    useAsTitle: "path",
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
      hooks: {
        beforeDuplicate: [
          ({ value }: FieldHookArgs<Page, string>) => {
            return value ? `${value} (Copy)` : value;
          },
        ],
      },
    },
    {
      name: "description",
      maxLength: 360,
      type: "textarea",
      localized: true,
      required: true,
    },
    {
      name: "type",
      hasMany: false,
      required: true,
      type: "select",
      defaultValue: "standard",
      options: [
        {
          label: "Standard Page",
          value: "standard",
        },
        {
          label: "Redirect to Page",
          value: "redirect",
        },
        {
          label: "Special: Events List",
          value: "events-list",
        },
        {
          label: "Special: All Events List",
          value: "all-events-list",
        },
        {
          label: "Special: Weekly Newsletter",
          value: "weekly-newsletter",
        },
        {
          label: "Special: Weekly Newsletters List",
          value: "weekly-newsletters-list",
        },
      ],
    },
    iconField({ required: false }),
    ...standardPageFields.map((field) => ({
      ...field,
      admin: {
        ...field.admin,
        condition: (data: Partial<Page>) => data.type === "standard",
      },
    })),
    ...redirectFields.map((field) => ({
      ...field,
      admin: {
        condition: (data: Partial<Page>) => data.type === "redirect",
      },
    })),
    {
      name: "path",
      type: "text",
      index: true,
      localized: true,
      unique: true,
      hooks: {
        beforeChange: [formatPath],
        beforeDuplicate: [
          ({ value }: FieldHookArgs) => {
            return value ? `${value}-copy` : value;
          },
        ],
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
      hooks: {
        beforeDuplicate: [
          ({ value }: FieldHookArgs<Page, string>) =>
            value ? `${value}-copy` : value,
        ],
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
    maxPerDoc: process.env.NODE_ENV === "production" ? 100 : 2,
    drafts: {
      autosave: true,
    },
  },
  hooks: {
    afterChange: [revalidateCollection<Page>("pages")],
  },
} as const satisfies CollectionConfig;
