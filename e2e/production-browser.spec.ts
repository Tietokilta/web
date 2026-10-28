import { test, expect, type Browser } from "@playwright/test";

// The images a browser loads with the landing page, from a fresh context so
// that its own cache cannot answer
async function landingImages(browser: Browser, baseURL: string | undefined) {
  const context = await browser.newContext({ baseURL });
  const page = await context.newPage();
  const headers = new Map<string, Promise<Record<string, string>>>();
  page.on("response", (response) => {
    if (new URL(response.url()).pathname === "/_next/image")
      headers.set(response.url(), response.allHeaders());
  });
  await page.goto("/fi");
  // The hero adds its photos only after hydration, which can outlast network idle
  const images = page.locator('main img[src^="/_next/image"]');
  await expect(images.first()).toBeAttached();
  await expect
    .poll(() =>
      images.evaluateAll((elements) =>
        elements.every((image) => (image as HTMLImageElement).complete),
      ),
    )
    .toBe(true);
  const responses = new Map(
    await Promise.all(
      [...headers].map(async ([url, pending]) => [url, await pending] as const),
    ),
  );
  await context.close();
  return responses;
}

// Whether a second request hits the cache is checked over HTTP in
// production.spec.ts; a fresh browser may reach another data center's cache
test("the browser gets optimized images as WebP that the edge caches", async ({
  browser,
  baseURL,
}) => {
  const images = await landingImages(browser, baseURL);
  expect(images.size).toBeGreaterThan(0);

  for (const [url, headers] of images) {
    expect(headers["content-type"], url).toBe("image/webp");
    expect(headers["cf-cache-status"], url).toMatch(
      /^(HIT|MISS|EXPIRED|STALE|UPDATING|REVALIDATED)$/,
    );
  }
});
