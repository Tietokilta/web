import type { Page } from "@playwright/test";
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
  ["/en/weekly-newsletters/csg-weekly-mail-192024", "CSG Weekly mail 19/2024"],
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

for (const url of [
  "/fi/tapahtumat/e2e-testitapahtuma",
  "/en/events/e2e-testitapahtuma",
]) {
  test(`event page ${url} renders from Ilmomasiina`, async ({ page }) => {
    const response = await page.goto(url);
    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { name: "E2E-testitapahtuma", exact: true }),
    ).toBeVisible();
  });
}

test("desktop navigation opens a seeded page and browser back works", async ({
  page,
}) => {
  await page.goto("/fi");
  const menu = page.getByRole("button", { name: "Kilta", exact: true });
  // A hover before hydration is lost, so repeat it until the menu opens
  await expect(async () => {
    await page.mouse.move(0, 0);
    await menu.hover();
    await expect(menu).toHaveAttribute("aria-expanded", "true", {
      timeout: 1000,
    });
  }).toPass();
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

const firstEventPage = [
  "E2E-testitapahtuma",
  "E2E-tapahtuma 2",
  "E2E-tapahtuma 3",
  "E2E-tapahtuma 4",
  "E2E-tapahtuma 5",
];
const secondEventPage = ["E2E-tapahtuma 6", "E2E-tapahtuma 7"];

function shownEvents(page: Page) {
  return page.getByText(/^E2E-(testi)?tapahtuma/).filter({ visible: true });
}

function eventPagination(page: Page) {
  return page
    .getByRole("navigation", { name: "pagination" })
    .filter({ visible: true });
}

test("the landing page pages through upcoming events", async ({ page }) => {
  await page.goto("/fi");
  await expect(shownEvents(page)).toHaveText(firstEventPage);

  await eventPagination(page).getByRole("link", { name: /2$/ }).click();
  await expect(page).toHaveURL(/\/fi\/?\?page=2$/);
  await expect(shownEvents(page)).toHaveText(secondEventPage);

  await eventPagination(page)
    .getByRole("link", { name: "Siirry edelliselle sivulle" })
    .click();
  await expect(page).toHaveURL(/\/fi\/?\?page=1$/);
  await expect(shownEvents(page)).toHaveText(firstEventPage);

  await eventPagination(page)
    .getByRole("link", { name: "Siirry seuraavalle sivulle" })
    .click();
  await expect(shownEvents(page)).toHaveText(secondEventPage);

  await page.goBack();
  await expect(page).toHaveURL(/\/fi\/?\?page=1$/);
  await expect(shownEvents(page)).toHaveText(firstEventPage);
});

test("the landing page opens a linked page of upcoming events", async ({
  page,
}) => {
  await page.goto("/en?page=2");
  await expect(shownEvents(page)).toHaveText(secondEventPage);
  await expect(
    eventPagination(page).locator('[aria-current="page"]'),
  ).toHaveText(/2$/);
});

for (const invalid of ["0", "3", "abc", "1.5"]) {
  test(`the landing page shows the first events for page ${invalid}`, async ({
    page,
  }) => {
    const response = await page.goto(`/fi?page=${invalid}`);
    expect(response?.status()).toBe(200);
    await expect(shownEvents(page)).toHaveText(firstEventPage);
  });
}

test("the landing page pages through upcoming events on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/fi");
  await expect(shownEvents(page)).toHaveText(firstEventPage);

  await eventPagination(page).getByRole("link", { name: /2$/ }).click();
  await expect(shownEvents(page)).toHaveText(secondEventPage);
});

for (const url of ["/en", "/en?page=2"]) {
  test(`${url} links to its canonical page and translations`, async ({
    page,
  }) => {
    await page.goto(url);
    const linkedPath = async (selector: string) => {
      const { pathname, search } = new URL(
        (await page.locator(selector).getAttribute("href")) ?? "",
        "http://localhost",
      );
      return pathname + search;
    };

    expect(await linkedPath('link[rel="canonical"]')).toBe("/en");
    expect(await linkedPath('link[rel="alternate"][hreflang="fi"]')).toBe(
      "/fi",
    );
    expect(await linkedPath('link[rel="alternate"][hreflang="en"]')).toBe(
      "/en",
    );
    expect(
      await linkedPath('link[rel="alternate"][hreflang="x-default"]'),
    ).toBe("/fi");
  });
}

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

test("the root redirects to the language chosen earlier", async ({ page }) => {
  await page.goto("/fi");
  await page.getByRole("link", { name: "In English", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Guild", exact: true }),
  ).toBeVisible();
  await page.goto("/");
  await expect(page).toHaveURL(/\/en$/);
});

test("the events page shows the event calendar", async ({ page }) => {
  await page.goto("/fi/tapahtumat");
  await expect(page.locator(".rbc-calendar")).toBeVisible();
});

test("the invoice generator form renders", async ({ page }) => {
  await page.goto("/fi/laskugeneraattori");
  await expect(
    page.getByRole("textbox", { name: "Laskuttajan nimi", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Lähetä", exact: true }),
  ).toBeVisible();
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

for (const [path, contentType] of [
  ["/.well-known/security.txt", /^text\/plain/],
  ["/favicon.ico", /^image\//],
  ["/apple-touch-icon.png", /^image\/png/],
] as const) {
  test(`${path} is served as a file, not a page`, async ({ request }) => {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toMatch(contentType);
  });
}
