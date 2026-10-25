import { test as base } from "@playwright/test";

export const admin = {
  email: "root@tietokilta.fi",
  password: "ci-e2e-admin-password",
};

export const test = base.extend({
  // Playwright requires fixture dependencies to be destructured.
  // oxlint-disable-next-line no-empty-pattern
  baseURL: async ({}, use) => {
    const url = process.env.E2E_BASE_URL;
    if (!url) throw new Error("E2E setup did not start the app");
    await use(url);
  },
});
export { expect } from "@playwright/test";
