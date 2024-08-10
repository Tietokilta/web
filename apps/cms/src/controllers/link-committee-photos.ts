import type { Response } from "express";
import type { PayloadRequest } from "payload/types";
import payload from "payload";
import { signedIn } from "../access/signed-in";
import { type CommitteeMembersSlug } from "../collections/committees/committee-members";
import { type MediaSlug } from "../collections/media";

export const linkCommitteePhotos = async (
  req: PayloadRequest,
  res: Response,
): Promise<void> => {
  if (!signedIn({ req }) || !req.user) {
    res.sendStatus(401);
  }

  const { year } = req.body as { year: number };

  if (!year) {
    res.status(400).send("Missing required fields");
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

  if (!committeeMembers) {
    res.status(500).send("No committee members found for the given year");
  }

  for (const committeeMember of committeeMembers.docs) {
    // Find committee member picture firstname_lastname_year.jpg
    const name = (committeeMember.name as string).split(" ");
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
        photo: picture.id as string,
      },
    });
  }

  res.sendStatus(200);
};
