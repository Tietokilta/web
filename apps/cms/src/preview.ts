import type { GeneratePreviewURL } from "payload/config";

export const generatePreviewUrl =
  <T>(getUrl: (doc: T) => string): GeneratePreviewURL =>
  (doc) =>
    `/next_api/preview?url=${getUrl(doc as T)}`;
