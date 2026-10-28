import { test, expect, type Browser } from "@playwright/test";

// The images a browser loads with the landing page, from a fresh context so
// that its own cache cannot answer
async function landingImages(browser: Browser, baseURL: string | undefined) {
  const context = await browser.newContext({ baseURL });
  // Each visit would otherwise start the hero from a different random photo
  await context.addInitScript(() => {
    Math.random = () => 0;
  });
  const page = await context.newPage();
  const responses = new Map<string, Record<string, string>>();
  page.on("response", async (response) => {
    if (new URL(response.url()).pathname === "/_next/image")
      responses.set(response.url(), await response.allHeaders());
  });
  await page.goto("/fi", { waitUntil: "networkidle" });
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
