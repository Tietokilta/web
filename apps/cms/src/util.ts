import type { PayloadRequest } from "payload/types";

export const useCloudStorage = (): boolean => {
  return (
    typeof process.env.AZURE_STORAGE_CONNECTION_STRING === "string" &&
    typeof process.env.AZURE_STORAGE_CONTAINER_NAME === "string" &&
    typeof process.env.AZURE_STORAGE_ACCOUNT_BASEURL === "string"
  );
};
export const useGoogleAuth = (): boolean => {
  return (
    typeof process.env.GOOGLE_OAUTH_CLIENT_ID === "string" &&
    typeof process.env.GOOGLE_OAUTH_CLIENT_SECRET === "string"
  );
};
export function getLocale(req: PayloadRequest): string | undefined {
  const res =
    typeof req.query.locale === "string" ? req.query.locale : req.locale;
  if (!res) {
    req.payload.logger.warn(`locale not set for ${req.path}, defaulting to fi`);
  }
  return res;
}
