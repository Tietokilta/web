import { readdir } from "node:fs/promises";
import path from "node:path";
import {
  GenericContainer,
  Network,
  Wait,
  type StartedNetwork,
  type StartedTestContainer,
} from "testcontainers";
import { expect, test } from "vitest";

const AZURITE_ACCOUNT = "ci";
const AZURITE_KEY = "Y2ktc21va2UtdGVzdC1rZXk=";
const AZURITE_CONNECTION_STRING = [
  "DefaultEndpointsProtocol=http",
  `AccountName=${AZURITE_ACCOUNT}`,
  `AccountKey=${AZURITE_KEY}`,
  `BlobEndpoint=http://azurite:10000/${AZURITE_ACCOUNT}`,
].join(";");

const repoRoot = path.resolve(import.meta.dirname, "../../..");
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

test("the production image serves the Finnish homepage", async () => {
  const image = process.env.SMOKE_IMAGE;
  if (!image) throw new Error("SMOKE_IMAGE must point to the image under test");

  const network = await new Network().start();
  const containers: StartedTestContainer[] = [];
  let webLogs = "";

  try {
    const mongo = await new GenericContainer("mongo:7")
      .withNetwork(network)
      .withNetworkAliases("mongo")
      .withBindMounts([{ source: seedDirectory, target: "/seed", mode: "ro" }])
      .withExposedPorts(27017)
      .withWaitStrategy(Wait.forLogMessage("Waiting for connections"))
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
      .withCommand(["azurite-blob", "--blobHost", "0.0.0.0"])
      .withExposedPorts(10000)
      .withWaitStrategy(Wait.forListeningPorts())
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

    const web = await new GenericContainer(image)
      .withNetwork(network)
      .withNetworkAliases("web")
      .withEnvironment({
        NODE_ENV: "production",
        PORT: "3000",
        PAYLOAD_MONGO_CONNECTION_STRING: "mongodb://mongo:27017/payload",
        PAYLOAD_SECRET: "ci-smoke-secret",
        PUBLIC_FRONTEND_URL: "http://localhost:3000",
        AZURE_STORAGE_CONNECTION_STRING: AZURITE_CONNECTION_STRING,
        AZURE_STORAGE_CONTAINER_NAME: "ci-smoke",
        AZURE_STORAGE_ACCOUNT_BASEURL: "http://azurite:10000/ci/ci-smoke",
        AZURE_STORAGE_ALLOW_CONTAINER_CREATE: "true",
      })
      .withExposedPorts(3000)
      .withLogConsumer((stream) => {
        stream.on("data", (chunk) => {
          webLogs += chunk.toString();
        });
      })
      .withWaitStrategy(
        Wait.forHttp("/next_api/health", 3000, {
          abortOnContainerExit: true,
        }).forStatusCode(200),
      )
      .withStartupTimeout(120_000)
      .start();
    containers.push(web);

    const response = await fetch(
      `http://${web.getHost()}:${web.getMappedPort(3000)}/fi`,
    );

    expect(response.status).toBe(200);
  } catch (error) {
    if (webLogs) process.stderr.write(webLogs);
    throw error;
  } finally {
    await stopContainers(containers, network);
  }
}, 180_000);
