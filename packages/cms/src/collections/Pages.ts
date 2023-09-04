import { loggedIn } from "../access/loggedIn";
import { publishedAndVisibleOrLoggedIn } from "../access/publishedAndVisibleOrLoggedIn";
import { revalidatePage } from "../hooks/revalidatePage";
import { generatePreviewUrl } from "../preview";

import { Page } from "payload/generated-types";

import { isNil, omitBy } from "lodash";
import { CollectionConfig, FieldHook } from "payload/types";
import {
  HorizontalRuleFeature,
  LinkFeature,
  YouTubeFeature,
  lexicalRichTextField,
} from "payload-plugin-lexical";

const onlyJsonContentForUnauthorized: FieldHook<Page> = ({
  data,
  req: { user },
}) => {
  if (user) {
    return data?.content;
  } else if (data) {
    // Warning: the content data can contain, for example, `comments`, which are not public
    return {
      jsonContent: (data.content as unknown as { jsonContent: unknown })
        .jsonContent,
    };
  }
};

const formatPath: FieldHook<Page> = async ({ data, req }) => {
  if (data) {
    if (data.topic && data.slug) {
      const topic = await req.payload.findByID({
        collection: "topics",
        id: data.topic.value,
      });
      return `/${topic.slug}/${data.slug}`;
    } else if (data.slug) {
      return `/${data.slug}`;
    }
  }
};

const Pages: CollectionConfig = {
  slug: "pages",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["path", "title"],
    listSearchableFields: ["path", "title"],
    preview: generatePreviewUrl<Page>((doc) => doc.path ?? "/"),
  },
  access: {
    read: publishedAndVisibleOrLoggedIn,
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
    lexicalRichTextField({
      name: "content",
      localized: true,
      required: true,
      editorConfigModifier: (defaultEditorConfig) => {
        defaultEditorConfig.debug = false;
        defaultEditorConfig.toggles.textColor.enabled = true;
        defaultEditorConfig.toggles.textBackground.enabled = true;
        defaultEditorConfig.toggles.fontSize.enabled = true;
        defaultEditorConfig.toggles.font.enabled = false;
        defaultEditorConfig.toggles.align.enabled = true;
        defaultEditorConfig.toggles.tables.enabled = true;
        defaultEditorConfig.toggles.tables.display = true;
        defaultEditorConfig.toggles.comments.enabled = true;
        defaultEditorConfig.toggles.upload.enabled = true;

        defaultEditorConfig.features = [
          LinkFeature({}),
          YouTubeFeature({}),
          HorizontalRuleFeature({}),
        ];

        return defaultEditorConfig;
      },
      hooks: {
        afterRead: [onlyJsonContentForUnauthorized],
      },
    }),
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
      revalidatePage<Page>("pages", (doc) => ({
        where: omitBy(
          {
            slug: { equals: doc.slug },
            topic:
              typeof doc?.topic?.value === "object"
                ? { slug: { equals: doc.topic.value.slug } }
                : null,
          },
          isNil,
        ),
      })),
    ],
  },
};

export default Pages;
