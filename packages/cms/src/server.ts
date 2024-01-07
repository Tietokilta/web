import dotenv from "dotenv";
import express from "express";
import payload from "payload";

dotenv.config();

const app = express();

// Redirect root to Admin panel
app.get("/", (_, res) => {
  res.redirect("/admin");
});

const start = async () => {
  // Initialize Payload

  await payload.init({
    secret: process.env.PAYLOAD_SECRET!,
    express: app,
    onInit: (payload) => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
  });

  app.listen(3001);
};

void start();
