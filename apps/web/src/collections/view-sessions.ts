import type { CollectionConfig } from "payload";

/**
 * ViewSessions collection - tracks unique page views using hashed session identifiers.
 * Documents auto-expire after 24 hours via MongoDB TTL index.
 * Used internally by analytics middleware - not exposed via API.
 */
export const ViewSessions: CollectionConfig = {
  slug: "view-sessions",
  admin: {
    hidden: true, // Hide from admin panel - internal use only
  },
  access: {
    read: () => false,
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: "hash",
      type: "text",
      required: true,
      unique: true,
      index: true,
    },
    {
      name: "createdAt",
      type: "date",
      required: true,
      defaultValue: () => new Date().toISOString(),
      index: true,
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
    },
  ],
  // Disable timestamps since we manually handle createdAt for TTL
  timestamps: false,
};
