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

const dataCenter = (headers?: Record<string, string>) =>
  headers?.["cf-ray"]?.split("-")[1];

// Each Cloudflare data center has its own cache, and fresh browser contexts
// can reach different ones, so only a visit to the same one can hit the cache
async function revisitInOneDataCenter(
  browser: Browser,
  baseURL: string | undefined,
) {
  let previous = await landingImages(browser, baseURL);
  for (let attempt = 0; attempt < 5; attempt++) {
    const visit = await landingImages(browser, baseURL);
    const sameDataCenter = [...visit].every(
      ([url, headers]) => dataCenter(headers) === dataCenter(previous.get(url)),
    );
    if (sameDataCenter) return visit;
    previous = visit;
  }
  throw new Error("No two visits in a row reached the same data center");
}

test("the browser gets optimized images as WebP from the edge cache", async ({
  browser,
  baseURL,
}) => {
  const images = await revisitInOneDataCenter(browser, baseURL);
  expect(images.size).toBeGreaterThan(0);

  for (const [url, headers] of images) {
    const served = `${url} from ${dataCenter(headers) ?? "?"}`;
    expect(headers["content-type"], served).toBe("image/webp");
    expect(headers["cf-cache-status"], served).toBe("HIT");
  }
});
