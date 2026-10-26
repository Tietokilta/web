import { defineConfig, devices } from "@playwright/test";

// Checks the deployed site through Cloudflare, so it does not start the app.
export default defineConfig({
  testDir: ".",
  forbidOnly: !!process.env.CI,
  reporter: [["list"]],
  use: {
    baseURL: process.env.PRODUCTION_URL ?? "https://tietokilta.fi",
  },
  projects: [
    { name: "http", testMatch: "production.spec.ts" },
    // Real browsers send their own Accept headers for images
    {
      name: "chromium",
      testMatch: "production-browser.spec.ts",
      use: devices["Desktop Chrome"],
    },
    {
      name: "firefox",
      testMatch: "production-browser.spec.ts",
      use: devices["Desktop Firefox"],
    },
  ],
});
