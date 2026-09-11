import { test, expect } from "./fixtures";

test.afterEach(async ({ page }) => {
  expect(await page.pageErrors(), "Uncaught browser errors").toEqual([]);
});

test("the root redirects to the Finnish landing page", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page).toHaveURL(/\/fi$/);
  await expect(page).toHaveTitle(/Tietokilta/);
  await expect(
    page.getByRole("heading", { name: "Tietokilta", exact: true }),
  ).toBeVisible();
});

for (const [url, heading] of [
  ["/fi/kilta/saannot", "Säännöt"],
  ["/en/guild/rules", "Rules"],
  ["/fi/kilta/opinnot", "Opinnot"],
  ["/fi/viikkotiedotteet", "Viikkotiedotteet"],
]) {
  test(`seeded page ${url} renders`, async ({ page }) => {
    const response = await page.goto(url);
    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { name: heading, exact: true }).first(),
    ).toBeVisible();
    await expect(page.getByRole("main")).toBeVisible();
  });
}

test("desktop navigation opens a seeded page and browser back works", async ({
  page,
}) => {
  await page.goto("/fi");
  const menu = page.getByRole("button", { name: "Kilta", exact: true });
  await menu.hover();
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await page.getByRole("link", { name: "Säännöt", exact: true }).click();
  await expect(page).toHaveURL(/\/fi\/kilta\/saannot$/);
  await expect(
    page.getByRole("heading", { name: "Säännöt", exact: true }),
  ).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/fi$/);
  await expect(
    page.getByRole("heading", { name: "Tietokilta", exact: true }),
  ).toBeVisible();
});

test("the landing page can switch languages", async ({ page }) => {
  await page.goto("/fi");
  await page.getByRole("link", { name: "In English", exact: true }).click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(
    page.getByRole("heading", { name: "Tietokilta", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Guild", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Suomeksi", exact: true }).click();
  await expect(page).toHaveURL(/\/fi$/);
});

test("mobile navigation opens and follows a link", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/fi");
  await page.getByRole("button", { name: "Avaa valikko", exact: true }).click();
  const menu = page.getByRole("dialog");
  await expect(menu).toBeVisible();
  await menu.getByRole("button", { name: "Kilta Avaa", exact: true }).click();
  await menu.getByRole("link", { name: "Opinnot", exact: true }).click();
  await expect(page).toHaveURL(/\/fi\/kilta\/opinnot$/);
  await expect(
    page.getByRole("heading", { name: "Opinnot", exact: true }),
  ).toBeVisible();
  await expect(menu).not.toBeVisible();
});

test("landing page images load through Payload and Next image optimization", async ({
  page,
}) => {
  await page.goto("/fi");
  const images = page.locator("img:visible");
  await expect(images.first()).toBeVisible();
  expect(await images.count()).toBeGreaterThan(1);
  for (const image of await images.all()) {
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveJSProperty("complete", true);
    await expect
      .poll(
        () =>
          image.evaluate((element: HTMLImageElement) => element.naturalWidth),
        {
          message: `Image failed to load: ${await image.getAttribute("src")}`,
        },
      )
      .toBeGreaterThan(0);
  }
  // Ensure this covers CMS media and the optimizer, not just bundled icons.
  await expect(
    page.locator('img[src^="/_next/image?"]:visible').first(),
  ).toHaveJSProperty("complete", true);
  const mediaURL = await page
    .locator('img[src^="/api/media/file/"]')
    .first()
    .evaluate((element: HTMLImageElement) => element.src);
  const mediaResponse = await page.request.get(mediaURL);
  expect(mediaResponse.ok()).toBe(true);
  expect(mediaResponse.headers()["content-type"]).toMatch(/^image\//);
});
