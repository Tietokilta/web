import payload from "payload";
import type { Response } from "express";
import type { PayloadRequest } from "payload/types";
import { type File } from "payload/dist/uploads/types";
import { signedIn } from "../access/signed-in";
import type { MediaSlug } from "../collections/media";

export const mediaImportController = async (
  req: PayloadRequest,
  res: Response,
): Promise<void> => {
  if (!signedIn({ req }) || !req.user) {
    res.sendStatus(401);
    return;
  }

  // Check that content type is multipart form data
  if (req.headers["content-type"] === "multipart/form-data") {
    res.status(400).send("File type not supported");
    return;
  }

  // Get the alt and photographer from the request body
  const { alt, photographer } = req.body as {
    alt: string;
    photographer: string;
  };

  // Get the file from the request
  const rawFile = req.files?.file;
  if (!rawFile) {
    res.status(400).send("Missing file");
    return;
  }
  const file: File = rawFile;

  // Save the image to the database
  await payload.create({
    collection: "media" as MediaSlug,
    data: {
      alt,
      photographer,
      mediaType: "image",
    },
    file,
  });

  res.status(200).send("File uploaded");
};
