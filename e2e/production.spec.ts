import { test, expect, type APIRequestContext } from "@playwright/test";

const cmsPage = "/fi/kilta/saannot";

// A fresh query string gives each run its own cache entries, which the app ignores.
const fresh = (path: string) =>
  `${path}${path.includes("?") ? "&" : "?"}smoke=${Date.now()}-${Math.random()}`;

async function getTwice(
  request: APIRequestContext,
  url: string,
  headers: Record<string, string> = {},
) {
  const first = await request.get(url, { headers, maxRedirects: 0 });
  const second = await request.get(url, { headers, maxRedirects: 0 });
  return [first, second] as const;
}

test("content pages are served from the edge cache", async ({ request }) => {
  const [, second] = await getTwice(request, fresh(cmsPage));

  expect(second.status()).toBe(200);
  expect(second.headers()["cf-cache-status"]).toBe("HIT");
});

test("the edge refreshes a cached page within a minute", async ({
  request,
}) => {
  test.setTimeout(120_000);
  const url = fresh(cmsPage);
  await getTwice(request, url);
  await new Promise((resolve) => setTimeout(resolve, 61_000));

  const later = await request.get(url);
  if (later.headers()["cf-cache-status"] === "HIT") {
    expect(Number(later.headers()["age"])).toBeLessThanOrEqual(60);
  }
});

for (const path of [
  "/",
  "/fi",
  "/admin",
  "/api/pages?limit=1",
  "/api/globals/footer",
  "/fi/signups/smoke/test",
]) {
  test(`${path} is never served from the edge cache`, async ({ request }) => {
    const [, second] = await getTwice(request, fresh(path));
    expect(second.headers()["cf-cache-status"]).not.toBe("HIT");
  });
}

test("preview requests skip the edge cache", async ({ request }) => {
  const url = fresh(cmsPage);
  await getTwice(request, url);

  const preview = await request.get(url, {
    headers: { Cookie: "__prerender_bypass=smoke" },
  });
  expect(preview.headers()["cf-cache-status"]).not.toBe("HIT");
});

test("a browser gets a compressed page even after a request without compression", async ({
  request,
}) => {
  // Cloudflare keeps the origin's bytes to preserve strong ETags, so it must
  // cache a separate copy per compression instead of serving the first one
  const url = fresh(cmsPage);
  await request.get(url, { headers: { "Accept-Encoding": "identity" } });

  const browser = await request.get(url, {
    headers: { "Accept-Encoding": "gzip, deflate, br, zstd" },
  });
  expect(browser.headers()["content-encoding"]).toMatch(/^(gzip|br|zstd)$/);
});

test("the edge answers a matching conditional request with 304", async ({
  request,
}) => {
  const url = fresh(cmsPage);
  const [, cached] = await getTwice(request, url);
  const etag = cached.headers()["etag"];
  expect(etag).toBeTruthy();

  const conditional = await request.get(url, {
    headers: { "If-None-Match": etag },
  });
  expect(conditional.status()).toBe(304);
});

test("assets referenced by a cached page exist", async ({ request }) => {
  const [, cached] = await getTwice(request, cmsPage);
  const assets = [
    ...new Set((await cached.text()).match(/\/_next\/static\/[^"'\s)]+/g)),
  ];
  expect(assets.length).toBeGreaterThan(0);

  for (const asset of assets) {
    expect((await request.get(asset)).status(), asset).toBe(200);
  }
});

test("optimized images are cached at the edge once per format", async ({
  request,
}) => {
  const landing = await (await request.get("/fi")).text();
  const image = landing
    .match(/\/_next\/image\?[^"\s]+/)?.[0]
    .replaceAll("&amp;", "&");
  if (!image) throw new Error("The landing page has no optimized images");
  const url = fresh(image);
  const webp = { Accept: "image/avif,image/webp,*/*" };
  const any = { Accept: "*/*" };

  // A browser caches the WebP copy first, which must not reach other clients
  await getTwice(request, url, webp);
  const [anyFirst, anySecond] = await getTwice(request, url, any);
  for (const response of [anyFirst, anySecond]) {
    expect(response.headers()["content-type"]).not.toBe("image/webp");
  }
  expect(anySecond.headers()["cf-cache-status"]).toBe("HIT");

  const webpAgain = await request.get(url, { headers: webp });
  expect(webpAgain.headers()["content-type"]).toBe("image/webp");
  expect(webpAgain.headers()["cf-cache-status"]).toBe("HIT");
});
