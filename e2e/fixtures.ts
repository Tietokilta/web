import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { BlobServiceClient } from "@azure/storage-blob";
import { test as base, expect } from "@playwright/test";
import sharp from "sharp";
import {
  GenericContainer,
  Network,
  Wait,
  type StartedNetwork,
  type StartedTestContainer,
} from "testcontainers";

const AZURITE_ACCOUNT = "ci";
const AZURITE_KEY = "Y2ktc21va2UtdGVzdC1rZXk=";
const AZURITE_CONNECTION_STRING = [
  "DefaultEndpointsProtocol=http",
  `AccountName=${AZURITE_ACCOUNT}`,
  `AccountKey=${AZURITE_KEY}`,
  `BlobEndpoint=http://azurite:10000/${AZURITE_ACCOUNT}`,
].join(";");

const repoRoot = path.resolve(import.meta.dirname, "..");
const seedDirectory = path.join(repoRoot, "data/gen/db");

async function stopContainers(
  containers: StartedTestContainer[],
  network: StartedNetwork,
) {
  for (const container of containers.reverse()) {
    await container.stop();
  }
  await network.stop();
}

async function withE2EApp(
  use: (url: string) => Promise<void>,
  workerIndex: number,
) {
  const image = process.env.E2E_IMAGE;
  if (!image) throw new Error("E2E_IMAGE must point to the image under test");

  const network = await new Network().start();
  const containers: StartedTestContainer[] = [];
  let webLogs = "";

  try {
    const mongo = await new GenericContainer("mongo:7")
      .withNetwork(network)
      .withNetworkAliases("mongo")
      .withBindMounts([{ source: seedDirectory, target: "/seed", mode: "ro" }])
      .withExposedPorts(27017)
      .withHealthCheck({
        test: [
          "CMD",
          "mongosh",
          "--quiet",
          "--eval",
          "quit(db.adminCommand({ ping: 1 }).ok === 1 ? 0 : 1)",
        ],
        interval: 1000,
        timeout: 5000,
        retries: 30,
        startPeriod: 1000,
      })
      .withWaitStrategy(Wait.forHealthCheck())
      .withStartupTimeout(60_000)
      .start();
    containers.push(mongo);

    const azurite = await new GenericContainer(
      "mcr.microsoft.com/azure-storage/azurite:3.35.0",
    )
      .withNetwork(network)
      .withNetworkAliases("azurite")
      .withEnvironment({
        AZURITE_ACCOUNTS: `${AZURITE_ACCOUNT}:${AZURITE_KEY}`,
      })
      // The Azure SDK can advertise a newer API version than the emulator.
      .withCommand([
        "azurite-blob",
        "--blobHost",
        "0.0.0.0",
        "--skipApiVersionCheck",
      ])
      .withExposedPorts(10000)
      .withHealthCheck({
        test: [
          "CMD",
          "node",
          "-e",
          // Azurite returns Bad Request for a request without an account path.
          'require("node:http").get("http://127.0.0.1:10000/", r => process.exit(r.statusCode === 400 ? 0 : 1)).on("error", () => process.exit(1))',
        ],
        interval: 1000,
        timeout: 5000,
        retries: 30,
        startPeriod: 1000,
      })
      .withWaitStrategy(Wait.forHealthCheck())
      .withStartupTimeout(60_000)
      .start();
    containers.push(azurite);

    for (const filename of (await readdir(seedDirectory)).sort()) {
      if (!filename.endsWith(".json")) continue;

      const result = await mongo.exec([
        "mongoimport",
        "--quiet",
        "--db",
        "payload",
        "--collection",
        filename.slice(0, -".json".length),
        "--file",
        `/seed/${filename}`,
        "--jsonArray",
      ]);

      expect(result.exitCode, result.stderr).toBe(0);
    }

    const prefixResult = await mongo.exec([
      "mongosh",
      "payload",
      "--quiet",
      "--eval",
      [
        'db.media.updateMany({}, { $set: { prefix: "media" } });',
        'db.documents.updateMany({}, { $set: { prefix: "documents" } });',
      ].join("\n"),
    ]);
    expect(prefixResult.exitCode, prefixResult.stderr).toBe(0);

    // Keep seed filenames and MIME types, but use local fixtures instead of
    // downloading production uploads. Requests still go through Azure + Payload.
    const blobService = BlobServiceClient.fromConnectionString(
      AZURITE_CONNECTION_STRING.replace(
        "http://azurite:10000",
        `http://${azurite.getHost()}:${azurite.getMappedPort(10000)}`,
      ),
    );
    const storage = blobService.getContainerClient("ci-e2e");
    await storage.create();
    const media = JSON.parse(
      await readFile(path.join(seedDirectory, "media.json"), "utf8"),
    ) as { filename: string; mimeType: string }[];
    const svg = Buffer.from(
      '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#8844cc"/></svg>',
    );
    const images: Record<string, Buffer> = {
      "image/svg+xml": svg,
      "image/jpeg": await sharp(svg).jpeg().toBuffer(),
      "image/png": await sharp(svg).png().toBuffer(),
      "image/webp": await sharp(svg).webp().toBuffer(),
    };
    for (const item of media) {
      if (!item.mimeType.startsWith("image/")) continue;
      const bytes = images[item.mimeType];
      if (!bytes) throw new Error(`Missing e2e fixture for ${item.mimeType}`);
      await storage
        .getBlockBlobClient(`media/${item.filename}`)
        .uploadData(bytes, {
          blobHTTPHeaders: { blobContentType: item.mimeType },
        });
    }

    const web = await new GenericContainer(image)
      .withNetwork(network)
      .withNetworkAliases("web")
      .withEnvironment({
        NODE_ENV: "production",
        PORT: "3000",
        PAYLOAD_MONGO_CONNECTION_STRING: "mongodb://mongo:27017/payload",
        PAYLOAD_SECRET: "ci-e2e-secret",
        PUBLIC_FRONTEND_URL: "http://localhost:3000",
        AZURE_STORAGE_CONNECTION_STRING: AZURITE_CONNECTION_STRING,
        AZURE_STORAGE_CONTAINER_NAME: "ci-e2e",
        AZURE_STORAGE_ACCOUNT_BASEURL: "http://azurite:10000/ci/ci-e2e",
        AZURE_STORAGE_ALLOW_CONTAINER_CREATE: "true",
      })
      .withExposedPorts(3000)
      .withLogConsumer((stream) => {
        stream.on("data", (chunk) => {
          webLogs += chunk.toString();
        });
      })
      .withHealthCheck({
        test: [
          "CMD",
          "node",
          "-e",
          'fetch("http://127.0.0.1:3000/next_api/health").then(r => process.exit(r.status === 200 ? 0 : 1)).catch(() => process.exit(1))',
        ],
        interval: 1000,
        timeout: 5000,
        retries: 60,
        startPeriod: 1000,
      })
      .withWaitStrategy(Wait.forHealthCheck())
      .withStartupTimeout(120_000)
      .start();
    containers.push(web);

    await use(`http://${web.getHost()}:${web.getMappedPort(3000)}`);
  } catch (error) {
    if (webLogs) process.stderr.write(webLogs);
    throw error;
  } finally {
    try {
      await mkdir(path.join(import.meta.dirname, "test-results"), {
        recursive: true,
      });
      await writeFile(
        path.join(import.meta.dirname, `test-results/web-${workerIndex}.log`),
        webLogs,
      );
    } finally {
      await stopContainers(containers, network);
    }
  }
}

export const test = base.extend<object, { e2eURL: string }>({
  e2eURL: [
    // Playwright requires fixture dependencies to be destructured.
    // oxlint-disable-next-line no-empty-pattern
    async ({}, use, workerInfo) => withE2EApp(use, workerInfo.workerIndex),
    { scope: "worker", timeout: 180_000 },
  ],
  baseURL: async ({ e2eURL }, use) => use(e2eURL),
});
export { expect } from "@playwright/test";
