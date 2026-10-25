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
];

// Shared caches cannot see Payload edits, so pages they may store must
// expire within a minute and be dropped within an hour.
const personalPages = ["/fi/signups/abc/def", "/fi/payment/abc/def"];

const localizedResponses = [
  ...cmsPages,
  ...personalPages,
  "/fi",
  "/fi/infoscreen",
  "/fi/kilta/ei-ole-olemassa",
  "/fi/tapahtumat/ei-ole-olemassa",
  "/fi/tapahtumat/e2e-testitapahtuma",
  "/en/events/e2e-testitapahtuma",
  "/en/weekly-newsletters/csg-weekly-mail-192024",
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
