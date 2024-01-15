import type { GeneratePreviewURL } from "payload/config";

export const generatePreviewUrl =
  <T>(getUrl: (doc: T) => string): GeneratePreviewURL =>
  (doc) =>
    `${process.env.PUBLIC_FRONTEND_URL}/api/preview?url=${getUrl(doc as T)}`;