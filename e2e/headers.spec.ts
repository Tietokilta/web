import { test, expect } from "./fixtures";

for (const url of ["/fi", "/fi/kilta/saannot", "/admin", "/api/pages"]) {
  test(`${url} sends the security headers`, async ({ request }) => {
    const headers = (await request.get(url, { maxRedirects: 0 })).headers();
    expect(headers["content-security-policy"]).toBe(
      "frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self'",
    );
    expect(headers["strict-transport-security"]).toBe("max-age=31536000");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["x-powered-by"]).toBeUndefined();
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
