import type {
  Page,
  Topic,
  Page as PageType,
} from "@tietokilta/cms-types/payload";
import type {
  CollectionConfig,
  Field,
  FieldHook,
  FilterOptions,
  PayloadRequest,
} from "payload/types";
import { type Locale } from "payload/config";
import { publishedAndVisibleOrSignedIn } from "../access/published-and-visible-or-signed-in";
import { signedIn } from "../access/signed-in";
import { revalidatePage } from "../hooks/revalidate-page";
import { generatePreviewUrl } from "../preview";
import { getLocale } from "../util";

type Localized<TField> = Record<Locale["code"], TField>;

const formatPath: FieldHook<
  Page,
  Page["path"] | Localized<Page["path"]>
> = async ({ data, req }) => {
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

const filterCyclicPages: FilterOptions<PageType> = ({ data }) => ({
  id: {
    not_equals: data.id,
  },
});

const standardPageFields = [
  {
    name: "hideTableOfContents",
    type: "checkbox",
    required: true,
    defaultValue: false,
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

const specialPageFields = [
  {
    name: "specialPageType",
    type: "select",
    required: true,
    options: [
      {
        label: "Events List",
        value: "events-list",
      },
      {
        label: "Weekly Newsletter",
        value: "weekly-newsletter",
      },
      {
        label: "Weekly Newsletters List",
        value: "weekly-newsletters-list",
      },
    ],
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

export const Pages: CollectionConfig = {
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
          label: "Special Page",
          value: "special",
        },
        {
          label: "Redirect to Page",
          value: "redirect",
        },
      ],
    },
    ...standardPageFields.map((field) => ({
      ...field,
      admin: {
        ...field.admin,
        condition: (data: Partial<Page>) => data.type === "standard",
      },
    })),
    ...specialPageFields.map((field) => ({
      ...field,
      admin: {
        condition: (data: Partial<Page>) => data.type === "special",
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
      localized: true,
      hooks: {
        beforeChange: [formatPath],
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
    maxPerDoc: process.env.NODE_ENV === "production" ? 100 : 2,
    drafts: {
      autosave: true,
    },
  },
  hooks: {
    afterChange: [
      revalidatePage<Page>("pages", (doc, req) => {
        const locale = getLocale(req);
        if (!locale) {
          req.payload.logger.error(
            "locale not set, cannot revalidate properly",
          );
          return;
        }

        return {
          where: {
            path: { equals: doc.path },
          },
          locale,
        };
      }),
      revalidatePage<Page>("pages", async (doc, req) => {
        const localesData = await getAllLocalesData(doc, req);
        if (!localesData) {
          return;
        }
        const { allLocalesPagePath, localizedPathKey, locale } = localesData;

        return {
          where: {
            [localizedPathKey]: { equals: allLocalesPagePath[locale] },
          },
          locale: "all",
        };
      }),
      revalidatePage<Page>("pages", async (doc, req) => {
        const localesData = await getAllLocalesData(doc, req, true);
        if (!localesData) {
          return;
        }
        const { allLocalesPagePath, localizedPathKey, locale } = localesData;

        return {
          where: {
            [localizedPathKey]: { equals: allLocalesPagePath[locale] },
          },
          locale: "all",
        };
      }),
    ],
  },
};

async function getAllLocalesData(
  doc: Page,
  req: PayloadRequest,
  reverseLocale?: boolean,
): Promise<
  | {
      allLocalesPagePath: Localized<Page["path"]>;
      localizedPathKey: string;
      locale: string;
    }
  | undefined
> {
  const reqLocale = getLocale(req);
  if (!reqLocale) {
    req.payload.logger.error("locale not set, cannot revalidate properly");
    return;
  }

  let locale = reqLocale;
  if (reverseLocale) {
    locale = reqLocale === "fi" ? "en" : "fi";
  }

  const page = await req.payload.findByID({
    collection: "pages",
    id: doc.id,
    locale: "all",
  });
  const allLocalesPagePath = page.path as unknown as Localized<Page["path"]>;
  const localizedPathKey = `path.${locale}`;

  return {
    allLocalesPagePath,
    localizedPathKey,
    locale,
  };
}
