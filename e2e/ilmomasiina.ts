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

// The landing page lists upcoming events five per page, so seven give it a second page
const listedEvents = [
  event,
  ...Array.from({ length: 6 }, (_, i) => ({
    ...event,
    id: `e2e-event-${i + 2}`,
    slug: `e2e-listatapahtuma-${i + 2}`,
    title: `E2E-listatapahtuma ${i + 2}`,
    date: `2099-01-0${i + 2}T16:00:00.000Z`,
    endDate: `2099-01-0${i + 2}T20:00:00.000Z`,
  })),
];

const routes: Record<string, unknown> = {
  "/api/events": listedEvents.map((listed) => ({ ...listed, quotas: [quota] })),
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
    const body = routes[new URL(request.url ?? "/", "http://x").pathname];
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
