import { test, expect } from "@playwright/test";

// Source: https://www.checklyhq.com/blog/how-to-detect-broken-links-with-playwright/
test("front page has no broken links", async ({ page }) => {
  test.slow();
  await page.goto("/fi");

  // Gather all links from page
  const links = page.locator("a");
  const allLinks = await links.all();
  const allTargets = await Promise.all(
    allLinks.map((link) => link.getAttribute("href")),
  );

  // Filter links
  const validTargets = allTargets.reduce((links, link) => {
    expect.soft(link).toBeTruthy();

    if (link && !link?.startsWith("mailto:") && !link?.startsWith("#"))
      links.add(new URL(link, page.url()).href);
    return links;
  }, new Set<string>());

  // Test links
  for (const url of validTargets) {
    try {
      //console.log(url);
      const res = await page.request.get(url);
      expect.soft(res.ok(), `${url} is broken`).toBeTruthy();
    } catch {
      expect.soft(null, `${url} is broken`).toBeTruthy();
    }
  }
});
