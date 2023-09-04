import express from "express";
import payload from "payload";
import { seedPayload } from "./seeding/seed";

require("dotenv").config();
const app = express();

// Redirect root to Admin panel
app.get("/", (_, res) => {
  res.redirect("/admin");
});

const start = async () => {
  // Initialize Payload

  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    mongoURL: process.env.MONGODB_URI,
    express: app,
    onInit: async (payload) => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
      if (process.env.PAYLOAD_PUBLIC_LOCAL_DEVELOPMENT_AND_SEEDING === "true") {
        await seedPayload(payload);
      }
    },
  });

  app.listen(3001);
};

start();
