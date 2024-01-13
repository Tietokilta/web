import dotenv from "dotenv";
import express from "express";
import payload from "payload";

import path from "node:path";

dotenv.config();

const app = express();

// Redirect root to Admin panel
app.get("/", (_, res) => {
  res.redirect("/admin");
});

app.use("/media", express.static(path.join(__dirname, "../uploads")));

const start = async () => {
  // Initialize Payload

  await payload.init({
    secret: process.env.PAYLOAD_SECRET!,
    express: app,
    onInit: async (payload) => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
      if (process.env.PAYLOAD_PUBLIC_LOCAL_DEVELOPMENT === "true") {
        const email = process.env.PAYLOAD_PUBLIC_LOCAL_DEVELOPMENT_EMAIL;
        const password = process.env.PAYLOAD_PUBLIC_LOCAL_DEVELOPMENT_PASSWORD;
        if (!email || !password) {
          throw new Error(
            "PAYLOAD_PUBLIC_LOCAL_DEVELOPMENT_EMAIL and PAYLOAD_PUBLIC_LOCAL_DEVELOPMENT_PASSWORD must be set when PAYLOAD_PUBLIC_LOCAL_DEVELOPMENT is true",
          );
        }
        // check if the user exists, if not, create it
        const user = await payload.find({
          collection: "users",
          where: { email: { equals: email } },
        });
        if (user.totalDocs === 0) {
          payload.logger.warn(`user ${email} not found, creating...`);
          payload.logger.warn(
            "NOTE that it is recommended to use the seeding scripts to a get filled database for local development",
          );
          await payload.create({
            collection: "users",
            data: {
              email,
              password,
            },
          });
          payload.logger.warn("Payload autologin enabled!");
        }
      }
    },
  });

  app.listen(3001);
};

void start();
