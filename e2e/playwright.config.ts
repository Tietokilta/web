import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  globalSetup: "./setup.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [["list"], ["html", { open: "never" }]],
  projects: [
    {
      name: "chromium",
      testMatch: "site.spec.ts",
      use: devices["Desktop Chrome"],
    },
    {
      name: "firefox",
      testMatch: "site.spec.ts",
      use: devices["Desktop Firefox"],
    },
    // HTTP-only checks that do not depend on the browser
    { name: "http", testMatch: ["cache.spec.ts", "payload.spec.ts"] },
  ],
  use: {
    locale: "fi-FI",
    timezoneId: "Europe/Helsinki",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
});
