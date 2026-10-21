import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  testMatch: "site.spec.ts",
  globalSetup: "./setup.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [["list"], ["html", { open: "never" }]],
  projects: [
    { name: "chromium", use: devices["Desktop Chrome"] },
    { name: "firefox", use: devices["Desktop Firefox"] },
    { name: "webkit", use: devices["Desktop Safari"] },
  ],
  use: {
    locale: "fi-FI",
    timezoneId: "Europe/Helsinki",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
});
