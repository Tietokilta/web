import { test, expect, type Browser } from "@playwright/test";

// The images a browser loads with the landing page, from a fresh context so
// that its own cache cannot answer
async function landingImages(browser: Browser, baseURL: string | undefined) {
  const context = await browser.newContext({ baseURL });
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

test("the browser gets optimized images as WebP from the edge cache", async ({
  browser,
  baseURL,
}) => {
  await landingImages(browser, baseURL);
  const images = await landingImages(browser, baseURL);
  expect(images.size).toBeGreaterThan(0);

  for (const [url, headers] of images) {
    expect(headers["content-type"], url).toBe("image/webp");
    expect(headers["cf-cache-status"], url).toBe("HIT");
  }
});
