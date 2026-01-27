import type { CollectionConfig } from "payload";

/**
 * PageFeedback collection - stores thumbs up/down feedback for pages.
 * Uses hashed session identifiers for deduplication (one vote per visitor per page per day).
 * No PII is stored.
 */
export const PageFeedback: CollectionConfig = {
  slug: "page-feedback",
  admin: {
    group: "Analytics",
    defaultColumns: ["path", "vote", "createdAt"],
    useAsTitle: "path",
  },
  access: {
    // Only admins can view feedback in admin panel
    read: ({ req }) => Boolean(req.user),
    // Created via API only
    create: () => false,
    update: () => false,
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: "hash",
      type: "text",
      required: true,
      index: true,
      admin: {
        description: "Hashed session identifier for deduplication",
        readOnly: true,
      },
    },
    {
      name: "path",
      type: "text",
      required: true,
      index: true,
      admin: {
        description: "Page path where feedback was given",
        readOnly: true,
      },
    },
    {
      name: "vote",
      type: "select",
      required: true,
      options: [
        { label: "👍 Helpful", value: "up" },
        { label: "👎 Not helpful", value: "down" },
      ],
      admin: {
        readOnly: true,
      },
    },
    {
      name: "comment",
      type: "textarea",
      admin: {
        description: "Optional feedback comment",
        readOnly: true,
      },
    },
  ],
  timestamps: true,
};
