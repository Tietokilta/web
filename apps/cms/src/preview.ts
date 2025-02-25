import type { GeneratePreviewURL } from "payload/config";

export const generatePreviewUrl =
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters -- naive typed wrapper
  <T>(getUrl: (doc: T) => string): GeneratePreviewURL =>
    (doc) =>
      `/next_api/preview?url=${getUrl(doc as T)}`;
