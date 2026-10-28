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

test("the browser gets optimized images as WebP from the edge cache", async ({
  browser,
  baseURL,
}) => {
  const firstVisit = await landingImages(browser, baseURL);
  const images = await landingImages(browser, baseURL);
  expect(images.size).toBeGreaterThan(0);

  // Each Cloudflare data center has its own cache, so tell where each visit was served
  const servedBy = (headers?: Record<string, string>) =>
    `${headers?.["cf-cache-status"] ?? "not requested"} from ${headers?.["cf-ray"]?.split("-")[1] ?? "?"}`;
  for (const [url, headers] of images) {
    const served = `${url}: first visit ${servedBy(firstVisit.get(url))}, second ${servedBy(headers)}`;
    expect(headers["content-type"], served).toBe("image/webp");
    expect(headers["cf-cache-status"], served).toBe("HIT");
  }
});
