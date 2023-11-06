import { iconField } from "../fields/iconField";

import { FilterOptions } from "payload/dist/fields/config/types";
import { GlobalConfig } from "payload/types";

import type {
  MainNavigation,
  MainNavigationItem,
  MainNavigationTopicConfig,
} from "payload/generated-types";

const filterPagesOfTopic: FilterOptions<MainNavigation> = ({
  data,
  siblingData,
}) => ({
  "topic.value": {
    equals:
      data.items.find(
        (item) =>
          item.topicConfig?.categories.some(
            (category) =>
              category.pages?.some(
                (page) => page.id === (siblingData as { id: string }).id,
              ),
          ),
      )?.topicConfig?.topic ?? null,
  },
});

const MainNavigation: GlobalConfig = {
  slug: "main-navigation",
  access: {
    read: () => true,
  },
  fields: [
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
                ) => !!siblingData.topic,
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

export default MainNavigation;
