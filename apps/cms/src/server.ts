import express from "express";
import payload from "payload";

const secret = process.env.PAYLOAD_SECRET;
if (!secret) {
  throw new Error("PAYLOAD_SECRET is not set");
}

const app = express();

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
      if (process.env.PAYLOAD_LOCAL_DEVELOPMENT === "true") {
        const email = process.env.PAYLOAD_DEVELOPMENT_AUTOLOGIN_EMAIL;
        const password = process.env.PAYLOAD_DEVELOPMENT_AUTOLOGIN_PASSWORD;
        if (!email || !password) {
          throw new Error(
            "PAYLOAD_DEVELOPMENT_AUTOLOGIN_EMAIL and PAYLOAD_DEVELOPMENT_AUTOLOGIN_PASSWORD must be set when PAYLOAD_LOCAL_DEVELOPMENT is true",
          );
        }
        // check if the user exists, if not, create it
        const user = await payloadInstance.find({
          collection: "users",
          where: { email: { equals: email } },
        });
        if (user.totalDocs === 0) {
          payloadInstance.logger.warn(`user ${email} not found, creating...`);
          payloadInstance.logger.warn(
            "NOTE that it is recommended to use the seeding scripts (`pnpm db:reset`) to a get filled database for local development",
          );
          await payloadInstance.create({
            collection: "users",
            data: {
              email,
              password,
            },
          });
          payloadInstance.logger.warn("Payload autologin enabled!");
        }
      }
    },
  });

  // Add your own express routes here

  app.listen(process.env.PAYLOAD_PORT ?? 3000);
};

void start();
