import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Tietokilta/);
});

test("upcoming events link", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Tulevat tapahtumat" }).click();

  await expect(page.getByRole("heading", { name: "Tapahtumat" })).toBeVisible();
});
