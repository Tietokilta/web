import type { APIRequestContext, APIResponse } from "@playwright/test";
import { test as base, expect, admin } from "./fixtures";

// The `request` fixture acts as the signed-in editor and `visitor` as an anonymous reader.
const test = base.extend<{ visitor: APIRequestContext }>({
  visitor: async ({ playwright, baseURL }, use) => {
    const visitor = await playwright.request.newContext({ baseURL });
    await use(visitor);
    await visitor.dispose();
  },
});

// Edits revalidate shared cache entries, so keep the header checks from racing them.
test.describe.configure({ mode: "default" });

const cmsPages = [
  "/fi/kilta/saannot",
  "/en/guild/rules",
  "/fi/viikkotiedotteet",
  "/fi/viikkotiedotteet/tietokillan-viikkotiedote-192024",
  "/en/weekly-newsletters/csg-weekly-mail-192024",
];

const landingPages = ["/fi", "/en"];

const eventPages = [
  "/fi/tapahtumat/e2e-testitapahtuma",
  "/en/events/e2e-testitapahtuma",
];

// Shared caches cannot see Payload edits, so they may serve a page for a
// minute and must drop it within an hour.
const sharedCacheControl = "s-maxage=60, stale-while-revalidate=3540";
// Event pages follow the 30 s revalidation of their Ilmomasiina data
const eventCacheControl = "s-maxage=30, stale-while-revalidate=3570";

const cachedPages = [
  ...[...cmsPages, ...landingPages].map(
    (url) => [url, sharedCacheControl] as const,
  ),
  ...eventPages.map((url) => [url, eventCacheControl] as const),
];

const personalPages = ["/fi/signups/abc/def", "/fi/payment/abc/def"];

const localizedResponses = [
  ...cmsPages,
  ...personalPages,
  ...landingPages,
  "/fi/infoscreen",
  "/fi/kilta/ei-ole-olemassa",
  "/fi/tapahtumat/ei-ole-olemassa",
  ...eventPages,
];

async function expectOk(response: APIResponse) {
  expect(response.ok(), await response.text()).toBe(true);
}

async function getTwice(request: APIRequestContext, url: string) {
  const first = await request.get(url, { maxRedirects: 0 });
  expect(first.status(), url).toBe(200);
  const second = await request.get(url, { maxRedirects: 0 });
  expect(second.status(), url).toBe(200);
  return [first, second] as const;
}

async function signIn(request: APIRequestContext) {
  await expectOk(await request.post("/api/users/login", { data: admin }));
}

function cacheDirectives(response: APIResponse) {
  return new Map(
    (response.headers()["cache-control"] ?? "")
      .split(",")
      .map((directive): [string, string] => {
        const [name, value = ""] = directive.trim().split("=");
        return [name, value];
      }),
  );
}

// Next serves a stale page while re-rendering it, so a re-render with stale
// data would keep the old content cached until the page's revalidate period.
async function expectOnNextRequest(
  request: APIRequestContext,
  url: string,
  text: string,
) {
  expect(await (await request.get(url)).text()).toContain(text);
}

for (const [url, cacheControl] of cachedPages) {
  test(`${url} is served from the shared cache`, async ({ visitor }) => {
    const [first, second] = await getTwice(visitor, url);

    for (const response of [first, second]) {
      expect(response.headers()["cache-control"]).toBe(cacheControl);
      expect(response.headers()["set-cookie"]).toBeUndefined();
    }
    // STALE is also served from the cache, with a background re-render
    expect(second.headers()["x-nextjs-cache"]).toMatch(/^(HIT|STALE)$/);
  });
}

for (const url of localizedResponses) {
  test(`${url} is private or expires from shared caches within a minute`, async ({
    visitor,
  }) => {
    const directives = cacheDirectives(
      await visitor.get(url, { maxRedirects: 0 }),
    );

    if (directives.has("private")) {
      expect(directives.has("no-store")).toBe(true);
    } else {
      const fresh = Number(directives.get("s-maxage"));
      const stale = Number(directives.get("stale-while-revalidate") ?? 0);
      expect(fresh).toBeLessThanOrEqual(60);
      expect(fresh + stale).toBeLessThanOrEqual(3600);
    }
  });
}

for (const url of personalPages) {
  test(`${url} with an edit token is never stored by shared caches`, async ({
    visitor,
  }) => {
    const directives = cacheDirectives(
      await visitor.get(url, { maxRedirects: 0 }),
    );
    expect(directives.has("private")).toBe(true);
    expect(directives.has("no-store")).toBe(true);
  });
}

test("a cached page answers a matching conditional request with 304", async ({
  visitor,
}) => {
  const [, cached] = await getTwice(visitor, cmsPages[0]);
  const etag = cached.headers()["etag"];
  expect(etag).toBeTruthy();

  const conditional = await visitor.get(cmsPages[0], {
    headers: { "If-None-Match": etag },
  });
  expect(conditional.status()).toBe(304);
});

test("the cookie-dependent root redirect is never cached", async ({
  visitor,
}) => {
  const response = await visitor.get("/", { maxRedirects: 0 });
  expect(response.status()).toBe(307);
  expect(response.headers()["cache-control"]).toMatch(/private.*no-store/);
});

test("a published page edit reaches the next visitor", async ({
  request,
  visitor,
}) => {
  const url = "/fi/kilta/palautelomake";
  const description = `Cache test description ${Date.now()}`;
  await getTwice(visitor, url);

  await signIn(request);
  await expectOk(
    await request.patch("/api/pages/664a00fb33b015537cf07ade?locale=fi", {
      data: { description, _status: "published" },
    }),
  );

  await expectOnNextRequest(visitor, url, description);
});

test("a footer edit reaches the next visitor", async ({ request, visitor }) => {
  const url = "/fi/kilta/yhteystiedot";
  const label = `Cache test footer ${Date.now()}`;
  await getTwice(visitor, url);

  await signIn(request);
  const footer = (await (
    await request.get("/api/globals/footer?locale=fi&depth=0")
  ).json()) as { layout: { links?: { label: string }[] }[] };
  const link = footer.layout.find((block) => block.links?.length)?.links?.[0];
  if (!link) throw new Error("Seeded footer has no links");
  link.label = label;
  await expectOk(
    await request.post("/api/globals/footer?locale=fi", {
      data: { layout: footer.layout },
    }),
  );

  await expectOnNextRequest(visitor, url, label);
});

test("a landing page edit reaches the next visitor", async ({
  request,
  visitor,
}) => {
  const text = `Cache test hero ${Date.now()}`;
  await getTwice(visitor, "/fi");

  await signIn(request);
  const landingPage = (await (
    await request.get("/api/globals/landing-page?locale=fi&depth=0")
  ).json()) as { heroTexts: { text: string }[] };
  await expectOk(
    await request.post("/api/globals/landing-page?locale=fi", {
      data: { heroTexts: [...landingPage.heroTexts, { text }] },
    }),
  );

  await expectOnNextRequest(visitor, "/fi", text);
});

test("an announcement edit reaches the next landing page visitor", async ({
  request,
  visitor,
}) => {
  const title = `Cache test announcement ${Date.now()}`;
  await getTwice(visitor, "/fi");

  await signIn(request);
  const landingPage = (await (
    await request.get("/api/globals/landing-page?locale=fi&depth=0")
  ).json()) as { announcement: string };
  await expectOk(
    await request.patch(`/api/news/${landingPage.announcement}?locale=fi`, {
      data: { title },
    }),
  );

  await expectOnNextRequest(visitor, "/fi", title);
});

test("preview mode shows drafts while visitors keep the published page", async ({
  request,
  visitor,
}) => {
  const url = "/fi/virallinen/kiitokset";
  const description = `Cache test draft ${Date.now()}`;
  await getTwice(visitor, url);

  await signIn(request);
  const preview = await request.get(
    `/next_api/preview?url=${encodeURIComponent(url)}`,
    { maxRedirects: 0 },
  );
  expect(preview.status()).toBe(307);
  await expectOk(
    await request.patch(
      "/api/pages/664a3058535bd11c1b1c59bd?locale=fi&draft=true",
      { data: { description, _status: "draft" } },
    ),
  );

  expect(await (await request.get(url)).text()).toContain(description);
  expect(await (await visitor.get(url)).text()).not.toContain(description);
});

for (const url of [
  "https://example.com",
  "//example.com",
  "/\\example.com",
  "/\t/example.com",
  "/\t\\example.com",
]) {
  test(`preview does not redirect to ${url}`, async ({ request }) => {
    await signIn(request);
    const preview = await request.get(
      `/next_api/preview?url=${encodeURIComponent(url)}`,
      { maxRedirects: 0 },
    );
    expect(preview.status()).toBe(404);
  });
}
