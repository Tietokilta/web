import { env } from "../../../env";

// Built once per deploy, so every deploy pushes Expires a year ahead
export const dynamic = "force-static";

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

// https://www.rfc-editor.org/rfc/rfc9116
export function GET(): Response {
  const expires = new Date(Date.now() + ONE_YEAR_MS).toISOString();
  const body = [
    "Contact: https://github.com/Tietokilta/web/security/advisories/new",
    "Contact: mailto:hallitus@tietokilta.fi",
    `Expires: ${expires}`,
    "Preferred-Languages: fi, en",
    `Canonical: ${new URL("/.well-known/security.txt", env.PUBLIC_FRONTEND_URL).toString()}`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
