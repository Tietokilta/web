import payload, { type PayloadHandler, type File } from "payload";
import { signedIn } from "../access/signed-in";
import type { MediaSlug } from "../collections/media";

export const mediaImportController: PayloadHandler = async (req) => {
  if (!signedIn({ req }) || !req.user) {
    return new Response(null, { status: 401 });
  }

  // Check that content type is multipart form data
  const contentType = req.headers.get("content-type");
  if (contentType === "multipart/form-data") {
    return new Response("File type not supported", { status: 415 });
  }

  // Get the alt and photographer from the request body
  const body = (await req.json?.()) as {
    alt: string;
    photographer: string;
  };
  const { alt, photographer } = body;

  // Get the file from the request
  const rawFile = req.file;
  if (!rawFile) {
    return new Response("Missing file", { status: 400 });
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

  return new Response("File uploaded", { status: 200 });
};
