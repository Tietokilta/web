import { test, expect } from "./fixtures";

// Every client component receives its props inside the page's HTML, so data
// that only the server needs must not reach them.
const htmlBudget = 300_000;

for (const url of [
  "/fi/kilta/saannot",
  "/en/guild/rules",
  "/fi/viikkotiedotteet",
  "/fi",
]) {
  test(`${url} stays within the HTML budget`, async ({ request }) => {
    const html = await (await request.get(url)).body();
    expect(html.length).toBeLessThanOrEqual(htmlBudget);
  });
}

const linkedPageFields = ["id", "title", "path", "icon", "description"];

function linkedPages(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) return value.flatMap(linkedPages);
  if (!value || typeof value !== "object") return [];
  const object = value as Record<string, unknown>;
  const isPage = "path" in object && "title" in object;
  return [
    ...(isPage ? [object] : []),
    ...Object.values(object).flatMap(linkedPages),
  ];
}

for (const global of ["main-navigation", "footer", "landing-page"]) {
  test(`pages linked from ${global} carry only what links need`, async ({
    request,
  }) => {
    const response = await request.get(
      `/api/globals/${global}?locale=fi&depth=10`,
    );
    const pages = linkedPages(await response.json());
    expect(pages.length).toBeGreaterThan(0);

    for (const page of pages) {
      expect(
        Object.keys(page).filter((key) => !linkedPageFields.includes(key)),
        String(page.path),
      ).toEqual([]);
    }
  });
}
