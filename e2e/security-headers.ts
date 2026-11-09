import { expect } from "@playwright/test";

/** Checks the headers next.config.mjs sends on every page. */
export function expectSecurityHeaders(headers: Record<string, string>) {
  expect(headers["content-security-policy"]).toBe(
    "frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self'",
  );
  expect(headers["strict-transport-security"]).toBe("max-age=31536000");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["x-powered-by"]).toBeUndefined();
}
