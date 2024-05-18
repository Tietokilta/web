import type {
  MainNavigationItem,
  MainNavigationTopicConfig,
  MainNavigation as MainNavigationType,
  Media,
} from "@tietokilta/cms-types/payload";
import type { FilterOptions } from "payload/dist/fields/config/types";
import type { GlobalConfig } from "payload/types";
import { iconField } from "../fields/icon-field";

const filterPagesOfTopic: FilterOptions<MainNavigationType> = ({
  data,
  siblingData,
}) => ({
  "topic.value": {
    equals:
      data.items.find((item) =>
        item.topicConfig?.categories?.some((category) =>
          category.pages?.some(
            (page) => page.id === (siblingData as { id: string }).id,
          ),
        ),
      )?.topicConfig?.topic ?? null,
  },
});

const filterLogos: FilterOptions<Media> = () => ({
  and: [
    {
      mediaType: {
        equals: "logo",
      },
    },
  ],
});

export const MainNavigation: GlobalConfig = {
  slug: "main-navigation",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "logo",
      type: "relationship",
      relationTo: "media",
      required: true,
      filterOptions: filterLogos,
    },
    {
      name: "items",
      type: "array",
      required: true,
      interfaceName: "MainNavigationItem",
      fields: [
        {
          name: "type",
          type: "radio",
          options: [
            {
              label: "Page",
              value: "page",
            },
            {
              label: "Topic",
              value: "topic",
            },
          ],
          defaultValue: "page",
          admin: {
            layout: "horizontal",
          },
        },
        {
          name: "pageConfig",
          type: "group",
          admin: {
            hideGutter: true,
            condition: (_, item: MainNavigationItem[number]) =>
              item.type === "page",
          },
          fields: [
            {
              name: "page",
              type: "relationship",
              relationTo: "pages",
              required: true,
            },
          ],
        },
        {
          name: "topicConfig",
          type: "group",
          admin: {
            hideGutter: true,
            condition: (_, item: MainNavigationItem[number]) =>
              item.type === "topic",
          },
          interfaceName: "MainNavigationTopicConfig",
          fields: [
            {
              name: "topic",
              type: "relationship",
              relationTo: "topics",
              required: true,
            },
            {
              name: "categories",
              type: "array",
              required: true,
              minRows: 1,
              admin: {
                condition: (
                  _,
                  siblingData: Partial<MainNavigationTopicConfig>,
                ) => Boolean(siblingData.topic),
              },
              fields: [
                {
                  name: "title",
                  type: "text",
                  required: true,
                  localized: true,
                },
                {
                  name: "pages",
                  type: "array",
                  fields: [
                    {
                      name: "page",
                      type: "relationship",
                      relationTo: "pages",
                      required: true,
                      filterOptions: filterPagesOfTopic,
                    },
                  ],
                },
                {
                  name: "externalLinks",
                  type: "array",
                  fields: [
                    {
                      name: "title",
                      type: "text",
                      localized: true,
                      required: true,
                    },
                    {
                      name: "href",
                      type: "text",
                      required: true,
                    },
                    iconField({ required: true }),
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
