import { TypeWithID } from "payload/dist/collections/config/types";
import { FieldBase } from "payload/dist/fields/config/types";
import { FieldHook } from "payload/types";
import {
  HorizontalRuleFeature,
  LinkFeature,
  YouTubeFeature,
  lexicalRichTextField,
} from "payload-plugin-lexical";

const onlyJsonContentForUnauthorized =
  (key: string): FieldHook<TypeWithID> =>
  ({ data, req: { user } }) => {
    if (user) {
      return data?.[key] as unknown;
    } else if (data) {
      // Warning: the content data can contain, for example, `comments`, which are not public
      return {
        jsonContent: (data?.[key] as { jsonContent: unknown } | undefined)
          ?.jsonContent,
      };
    }
  };

export const richTextField = (base: FieldBase) =>
  lexicalRichTextField({
    ...base,
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
      afterRead: [onlyJsonContentForUnauthorized(base.name)],
    },
  });
