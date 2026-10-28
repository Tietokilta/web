import { test, expect } from "@playwright/test";

// Whether a second request hits the cache is checked over HTTP in
// production.spec.ts; a fresh browser may reach another data center's cache
test("the browser gets optimized images as WebP that the edge caches", async ({
  page,
}) => {
  const image = page.waitForResponse(
    (response) => new URL(response.url()).pathname === "/_next/image",
  );
  await page.goto("/fi");
  const headers = await (await image).allHeaders();

  expect(headers["content-type"]).toBe("image/webp");
  expect(headers["cf-cache-status"]).toMatch(
    /^(HIT|MISS|EXPIRED|STALE|UPDATING|REVALIDATED)$/,
  );
});
