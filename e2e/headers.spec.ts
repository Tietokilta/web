import { test, expect } from "./fixtures";
import { expectSecurityHeaders } from "./security-headers";

// Includes the proxy's locale redirect and a 404 page
for (const url of [
  "/",
  "/fi",
  "/fi/kilta/saannot",
  "/fi/kilta/ei-ole-olemassa",
  "/admin",
  "/api/pages",
]) {
  test(`${url} sends the security headers`, async ({ request }) => {
    expectSecurityHeaders(
      (await request.get(url, { maxRedirects: 0 })).headers(),
    );
  });
}

test("uploaded SVGs keep Payload's script-blocking policy", async ({
  request,
}) => {
  const headers = (await request.get("/api/media/file/TiK-logo.svg")).headers();
  expect(headers["content-type"]).toBe("image/svg+xml");
  expect(headers["content-security-policy"]).toContain("script-src 'none'");
  expect(headers["strict-transport-security"]).toBe("max-age=31536000");
  expect(headers["x-content-type-options"]).toBe("nosniff");
});
