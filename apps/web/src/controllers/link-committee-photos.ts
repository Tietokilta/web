/* eslint-disable no-console -- Allow console logs for this file */
/* eslint-disable @typescript-eslint/restrict-template-expressions -- Allow string concatenation for logging */
import payload, { type PayloadHandler } from "payload";
import { signedIn } from "../access/signed-in";
import { type CommitteeMembersSlug } from "../collections/committees/committee-members";
import { type MediaSlug } from "../collections/media";

export const linkCommitteePhotos: PayloadHandler = async (req) => {
  if (!signedIn({ req }) || !req.user) {
    return new Response(null, { status: 401 });
  }

  const data = (await req.json?.()) as { year: number };
  const { year } = data;

  if (!year) {
    return new Response("Missing required fields", { status: 400 });
  }

  const committeeMembers = await payload.find({
    collection: "committee-members" as CommitteeMembersSlug,
    where: {
      guildYear: {
        equals: year,
      },
    },
    pagination: false,
  });

  if (committeeMembers.docs.length === 0) {
    return new Response("No committee members found for the given year", {
      status: 500,
    });
  }

  for (const committeeMember of committeeMembers.docs) {
    // Find committee member picture firstname_lastname_year.jpg
    const name = committeeMember.name.split(" ");
    if (name.length < 2) {
      continue;
    }
    const formatName = (s: string): string =>
      s.toLowerCase().replace("ä", "a").replace("ö", "o").replace("å", "a");
    const firstName = formatName(name[0]);
    const lastName = formatName(name[1]);
    const filename = `${firstName}_${lastName}_${year}.jpg`;
    const pictures = await payload.find({
      collection: "media" as MediaSlug,
      where: {
        filename: {
          equals: filename,
        },
      },
      pagination: false,
    });
    const picture = pictures.docs.length > 0 && pictures.docs[0];
    if (!picture) {
      console.log(`No picture found for ${filename}`);
      continue;
    }
    console.log(`Linking ${filename} to ${committeeMember.name}`);
    await payload.update({
      collection: "committee-members" as CommitteeMembersSlug,
      id: committeeMember.id,
      data: {
        photo: picture.id,
      },
    });
  }

  return new Response(null, { status: 200 });
};
