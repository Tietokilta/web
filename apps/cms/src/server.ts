import express from "express";
import payload from "payload";
import { useCloudStorage, useGoogleAuth } from "./util";

const secret = process.env.PAYLOAD_SECRET;
if (!secret) {
  throw new Error("PAYLOAD_SECRET is not set");
}
const gitSha = process.env.GIT_COMMIT_SHA ?? "dev";

const app = express();
app.use((_, res, next) => {
  res.setHeader("X-Git-Commit-Sha", gitSha);
  next();
});
// Redirect root to Admin panel
app.get("/", (_, res) => {
  res.redirect("/admin");
});
const start = async (): Promise<void> => {
  // Initialize Payload
  await payload.init({
    secret,
    express: app,
    onInit: async (payloadInstance) => {
      payloadInstance.logger.info(
        `Payload Admin URL: ${payloadInstance.getAdminURL()}`,
      );
      if (useCloudStorage()) {
        payloadInstance.logger.info("Using Azure Blob Storage");
      }
      if (useGoogleAuth()) {
        payloadInstance.logger.info("Using Google OAuth2");
      }
      const { PAYLOAD_DEFAULT_USER_EMAIL, PAYLOAD_DEFAULT_USER_PASSWORD } =
        process.env;
      if (PAYLOAD_DEFAULT_USER_EMAIL && PAYLOAD_DEFAULT_USER_PASSWORD) {
        const email = PAYLOAD_DEFAULT_USER_EMAIL;
        const password = PAYLOAD_DEFAULT_USER_PASSWORD;
        if (!email || !password) {
          payloadInstance.logger.warn(
            `PAYLOAD_DEFAULT_USER_EMAIL and PAYLOAD_DEFAULT_USER_PASSWORD are not set, first user has to be created manually through the admin panel`,
          );
        }
        // check if the user exists, if not, create it
        const user = await payloadInstance.find({
          collection: "users",
          where: { email: { equals: email } },
        });
        if (user.totalDocs === 0) {
          payloadInstance.logger.warn(`user ${email} not found, creating...`);
          if (process.env.NODE_ENV !== "production") {
            payloadInstance.logger.warn(
              "NOTE that it is recommended to use the seeding scripts (`pnpm db:reset`) to a get filled database for local development",
            );
          }
          await payloadInstance.create({
            collection: "users",
            data: {
              email,
              password,
            },
          });
        }
      }
    },
  });

  // Add your own express routes here

  app.listen(process.env.PAYLOAD_PORT ?? 3000);
};

void start();
