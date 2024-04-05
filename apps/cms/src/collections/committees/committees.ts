import type { Committee } from "@tietokilta/cms-types/payload";
import type { CollectionConfig, FilterOptions } from "payload/types";
import { signedIn } from "../../access/signed-in";
import { guildYearField } from "../../fields/guild-year";
import { revalidatePage } from "../../hooks/revalidate-page";
import { getLocale } from "../../util";
import { importController } from "../../controllers/import-controller";

const filterCurrentYear: FilterOptions<Committee> = ({ data }) => ({
  guildYear: {
    equals: data.year,
  },
});

export const Committees = {
  slug: "committees",
  defaultSort: "-year",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["year", "name", "committeeMembers"],
  },
  access: {
    read: () => true,
    create: signedIn,
    update: signedIn,
    delete: signedIn,
  },
  fields: [
    guildYearField({
      name: "year",
      required: true,
    }),
    {
      name: "name",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "committeeMembers",
      type: "array",
      required: true,
      minRows: 1,
      fields: [
        {
          name: "committeeMember",
          type: "relationship",
          relationTo: "committee-members",
          filterOptions: filterCurrentYear,
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      // eslint-disable-next-line @typescript-eslint/require-await -- revalidate page wants promise
      revalidatePage<Committee>("committees", async (doc, req) => {
        const locale = getLocale(req);
        if (!locale) {
          req.payload.logger.error(
            "locale not set, cannot revalidate properly",
          );
          return;
        }
        return {
          where: {
            year: { equals: doc.year },
          },
          locale,
        };
      }),
    ],
  },
  endpoints: [
    {
      path: "/import",
      method: "post",
      handler: importController,
    },
  ],
} as const satisfies CollectionConfig;

export type CommitteesSlug = (typeof Committees)["slug"];
