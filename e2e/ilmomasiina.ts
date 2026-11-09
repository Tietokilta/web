import { once } from "node:events";
import { createServer, type Server } from "node:http";

// Shaped like Ilmomasiina's public API, without any signups
export const event = {
  id: "e2e-event",
  slug: "e2e-testitapahtuma",
  title: "E2E-testitapahtuma",
  category: "",
  description: "Tapahtuma e2e-testejä varten.",
  date: "2099-01-01T16:00:00.000Z",
  endDate: "2099-01-01T20:00:00.000Z",
  registrationStartDate: "2098-12-01T10:00:00.000Z",
  registrationEndDate: "2098-12-31T10:00:00.000Z",
  location: "Otaniemi",
  facebookUrl: null,
  webpageUrl: null,
  price: null,
  openQuotaSize: 0,
  signupsPublic: true,
  nameQuestion: true,
  emailQuestion: true,
  payments: "disabled",
  defaultLanguage: "fi",
  languages: {},
};

const quota = {
  id: "e2e-quota",
  title: "Osallistujat",
  size: 20,
  price: 0,
  signupCount: 0,
};

// Enough later events for the landing page to need a second page of five
const laterEvents = Array.from({ length: 6 }, (_, i) => ({
  ...event,
  id: `e2e-event-${(i + 2).toFixed()}`,
  slug: `e2e-tapahtuma-${(i + 2).toFixed()}`,
  title: `E2E-tapahtuma ${(i + 2).toFixed()}`,
  date: `2099-02-0${(i + 1).toFixed()}T16:00:00.000Z`,
  endDate: `2099-02-0${(i + 1).toFixed()}T20:00:00.000Z`,
}));

const routes: Record<string, unknown> = {
  "/api/events": [event, ...laterEvents].map((listed) => ({
    ...listed,
    quotas: [quota],
  })),
  [`/api/events/${event.slug}`]: {
    ...event,
    registrationClosed: false,
    millisTillOpening: 0,
    questions: [],
    quotas: [{ ...quota, signups: [] }],
  },
};

/** Keeps the tests independent of the production Ilmomasiina. */
export async function startFakeIlmomasiina(): Promise<{
  url: string;
  server: Server;
}> {
  const server = createServer((request, response) => {
    const pathname = new URL(request.url ?? "/", "http://x").pathname;
    // Any page on another origin, for the info screen to embed
    if (pathname === "/e2e-embed") {
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      response.end(
        "<!doctype html><title>E2E-upotus</title><h1>E2E-upotus</h1>",
      );
      return;
    }
    const body = routes[pathname];
    response.writeHead(body ? 200 : 404, {
      "Content-Type": "application/json",
    });
    response.end(JSON.stringify(body ?? { message: "Not found" }));
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  if (!address || typeof address === "string")
    throw new Error("Could not start the fake Ilmomasiina");
  return { url: `http://127.0.0.1:${address.port}`, server };
}
