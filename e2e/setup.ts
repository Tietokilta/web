import { spawn, type ChildProcess } from "node:child_process";
import { once } from "node:events";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { createServer } from "node:net";
import path from "node:path";
import { BlobServiceClient } from "@azure/storage-blob";
import { expect } from "@playwright/test";
import sharp from "sharp";
import {
  GenericContainer,
  Wait,
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

async function stopContainers(containers: StartedTestContainer[]) {
  for (const container of containers.reverse()) await container.stop();
}

export default async function setup() {
  const containers: StartedTestContainer[] = [];
  let server: ChildProcess | undefined;
  let webLogs = "";

  async function cleanup() {
    if (server && server.exitCode === null && server.signalCode === null) {
      const exited = once(server, "exit");
      server.kill("SIGTERM");
      const timeout = setTimeout(() => server?.kill("SIGKILL"), 5000);
      try {
        await exited;
      } finally {
        clearTimeout(timeout);
      }
    }
    try {
      await mkdir(path.join(import.meta.dirname, "test-results"), {
        recursive: true,
      });
      await writeFile(
        path.join(import.meta.dirname, "test-results/web.log"),
        webLogs,
      );
    } finally {
      await stopContainers(containers);
    }
  }

  try {
    const mongo = await new GenericContainer("mongo:7")
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

    const blobEndpoint = `http://${azurite.getHost()}:${azurite.getMappedPort(10000)}`;
    const port = await availablePort();
    const environment = {
      NODE_ENV: "production",
      SKIP_ENV_VALIDATION: "false",
      GIT_COMMIT_SHA: process.env.GIT_COMMIT_SHA ?? "development",
      PORT: String(port),
      PAYLOAD_MONGO_CONNECTION_STRING: `mongodb://${mongo.getHost()}:${mongo.getMappedPort(27017)}/payload`,
      PAYLOAD_SECRET: "ci-e2e-secret",
      PUBLIC_FRONTEND_URL: `http://127.0.0.1:${port}`,
      AZURE_STORAGE_CONNECTION_STRING: AZURITE_CONNECTION_STRING.replace(
        "http://azurite:10000",
        blobEndpoint,
      ),
      AZURE_STORAGE_CONTAINER_NAME: "ci-e2e",
      AZURE_STORAGE_ACCOUNT_BASEURL: `${blobEndpoint}/ci/ci-e2e`,
      AZURE_STORAGE_ALLOW_CONTAINER_CREATE: "true",
    };

    const webDirectory = path.join(repoRoot, "apps/web");
    server = spawn(
      process.execPath,
      [
        path.join(webDirectory, "node_modules/next/dist/bin/next"),
        "start",
        "--hostname",
        "127.0.0.1",
        "--port",
        String(port),
      ],
      {
        cwd: webDirectory,
        env: { ...process.env, ...environment },
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
    server.stdout?.on("data", (chunk) => {
      webLogs += chunk.toString();
    });
    server.stderr?.on("data", (chunk) => {
      webLogs += chunk.toString();
    });
    let startupError: Error | undefined;
    server.on("error", (error) => {
      startupError = error;
    });
    const url = `http://127.0.0.1:${port}`;
    await expect
      .poll(
        async () => {
          if (startupError) throw startupError;
          if (server?.exitCode !== null)
            throw new Error(`Next.js exited during startup: ${webLogs}`);
          return fetch(`${url}/next_api/health`, {
            signal: AbortSignal.timeout(5000),
          })
            .then((response) => response.status)
            .catch(() => 0);
        },
        {
          timeout: 120_000,
          message: "Next.js production server should become healthy",
        },
      )
      .toBe(200);
    process.env.E2E_BASE_URL = url;
    return cleanup;
  } catch (error) {
    if (webLogs) process.stderr.write(webLogs);
    await cleanup();
    throw error;
  }
}

async function availablePort(): Promise<number> {
  const listener = createServer();
  listener.listen(0, "127.0.0.1");
  await once(listener, "listening");
  const address = listener.address();
  if (!address || typeof address === "string")
    throw new Error("Could not allocate a port");
  await new Promise<void>((resolve, reject) =>
    listener.close((error) => (error ? reject(error) : resolve())),
  );
  return address.port;
}
