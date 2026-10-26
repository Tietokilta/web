import { defineConfig } from "@playwright/test";

// Checks the deployed site through Cloudflare, so it does not start the app.
export default defineConfig({
  testDir: ".",
  testMatch: "production.spec.ts",
  forbidOnly: !!process.env.CI,
  reporter: [["list"]],
  use: {
    baseURL: process.env.PRODUCTION_URL ?? "https://tietokilta.fi",
  },
});
