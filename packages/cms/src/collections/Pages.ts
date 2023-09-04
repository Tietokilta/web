import { loggedIn } from "../access/loggedIn";
import { publishedAndVisibleOrLoggedIn } from "../access/publishedAndVisibleOrLoggedIn";
import { revalidatePage } from "../hooks/revalidatePage";
import { generatePreviewUrl } from "../preview";

import { Page } from "payload/generated-types";

import { isNil, pick, omitBy } from "lodash";
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

const formatPath: FieldHook<Page> = ({ data }) => {
  if (data) {
    if (data.topic && data.slug) {
      return "/".concat(data.topic, "/").concat(data.slug);
    } else if (data.slug) {
      return "/".concat(data.slug);
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
      type: "text",
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
      revalidatePage<Page>("pages", (doc) =>
        omitBy(pick(doc, ["slug", "topic"]), isNil),
      ),
    ],
  },
};

export default Pages;
