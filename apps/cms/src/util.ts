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
