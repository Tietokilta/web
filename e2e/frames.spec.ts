import type { Page } from "@playwright/test";
import { test, expect } from "./fixtures";

// Framing breaks silently when security headers change, so cover both directions.

async function signIn(page: Page) {
  const token = process.env.E2E_ADMIN_TOKEN;
  const url = process.env.E2E_BASE_URL;
  if (!token || !url) throw new Error("E2E setup did not sign in the admin");
  await page
    .context()
    .addCookies([{ name: "payload-token", value: token, url }]);
}

// The seeded "Säännöt" page
const rulesPageId = "65a2d95d598aa16e52bc885a";

test("live preview shows the edited page inside the admin", async ({
  page,
}) => {
  await signIn(page);
  await page.goto(`/admin/collections/pages/${rulesPageId}?locale=fi`);

  const toggler = page.locator("#live-preview-toggler");
  // A click before hydration is lost, so repeat it until the preview opens
  await expect(async () => {
    await toggler.click();
    await expect(toggler).toHaveClass(/--active/, { timeout: 1000 });
  }).toPass();

  // The preview route needs the admin's cookie inside the frame to enter draft mode
  const preview = page
    .locator('iframe[src*="/next_api/preview"]')
    .contentFrame();
  await expect(
    preview.getByRole("heading", { name: "Säännöt", exact: true }).first(),
  ).toBeVisible();
});

test("the info screen embeds a page from another origin", async ({ page }) => {
  // The global setup points the info screen at the fake Ilmomasiina
  await page.goto("/fi/infoscreen");
  await expect(
    page
      .getByTitle("E2E-upotus")
      .contentFrame()
      .getByRole("heading", { name: "E2E-upotus" }),
  ).toBeVisible();
});
