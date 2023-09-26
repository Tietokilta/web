import { azureBlobStorageAdapter } from "@payloadcms/plugin-cloud-storage/azure";
import type { Adapter } from "@payloadcms/plugin-cloud-storage/dist/types";

export const createAzureBlobAdapter = (
  connectionString: string,
  containerName: string,
  baseURL: string,
): Adapter =>
  azureBlobStorageAdapter({
    connectionString,
    containerName,
    allowContainerCreate:
      process.env.AZURE_STORAGE_ALLOW_CONTAINER_CREATE === "true",
    baseURL,
  });
