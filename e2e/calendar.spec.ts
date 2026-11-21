import { test, expect } from "@playwright/test";
import { createEvents } from "../apps/web/src/lib/ics";
import { event } from "./ilmomasiina";

function ics(overrides: Partial<typeof event> = {}) {
  return createEvents(
    [
      {
        ...event,
        ...overrides,
        payments: "disabled" as Parameters<
          typeof createEvents
        >[0][number]["payments"],
        quotas: [],
      },
    ],
    { host: "tietokilta.fi", origin: "https://tietokilta.fi", locale: "fi" },
  );
}

function calendar(date: string | null, endDate: string | null = null) {
  return ics({ date, endDate } as Partial<typeof event>).split(
    "BEGIN:VEVENT",
  )[1];
}

for (const [date, expected] of [
  ["2027-03-04T22:00:00.000Z", "20270305"], // Reported M0 event
  ["2027-06-04T21:00:00.000Z", "20270605"], // Summer time
  ["2027-03-28T21:00:00.000Z", "20270329"], // After DST starts
  ["2027-10-31T22:00:00.000Z", "20271101"], // After DST ends
  ["2027-12-31T22:00:00.000Z", "20280101"], // Year boundary
] as const) {
  test(`all-day event at ${date} uses its Helsinki date`, () => {
    const entry = calendar(date);
    expect(entry).toContain(`DTSTART;VALUE=DATE:${expected}`);
    // RFC 5545: a DATE start without DTEND lasts one day.
    expect(entry).not.toContain("DTEND");
  });
}

test("timed events keep their UTC start and end", () => {
  const entry = calendar(
    "2027-03-04T22:00:00.000Z",
    "2027-03-05T02:00:00.000Z",
  );
  expect(entry).toContain("DTSTART:20270304T220000Z");
  expect(entry).toContain("DTEND:20270305T020000Z");
});

test("events without a start date are omitted", () => {
  expect(calendar(null)).toBeUndefined();
});

// RFC 5545 3.1: CRLF line breaks, a space after each fold
const unfold = (ics: string) => ics.replaceAll("\r\n ", "");

test("lines are folded to 75 octets without splitting links", () => {
  const calendarText = ics({
    slug: "winebeads",
    description: `Väsyttääkö marraskuun pimeys? ${"Hamahelmiä ".repeat(30)}Lue https://example.com/${"a".repeat(80)} ja tule!`,
  });

  const lines = calendarText.split("\r\n");
  expect(lines.at(-1)).toBe("");
  for (const line of lines) {
    expect(line).not.toContain("\n");
    // Only a link longer than a line may exceed the limit.
    if (!line.includes("example.com")) {
      expect(Buffer.byteLength(line)).toBeLessThanOrEqual(75);
    }
  }

  const description = unfold(calendarText)
    .split("\r\n")
    .find((line) => line.startsWith("DESCRIPTION:"));
  // Every URL must sit whole on one physical line for apps that skip unfolding.
  for (const url of [
    "https://tietokilta.fi/fi/tapahtumat/winebeads",
    `https://example.com/${"a".repeat(80)}`,
  ]) {
    expect(description).toContain(url);
    expect(lines.some((line) => line.includes(url))).toBe(true);
  }
});

test("text values are escaped", () => {
  const entry = ics({
    title: "Sitsit; kokous, ja muuta",
    location: "Otakaari 1, Espoo",
  });
  expect(entry).toContain("SUMMARY:Sitsit\\; kokous\\, ja muuta\r\n");
  expect(entry).toContain("LOCATION:Otakaari 1\\, Espoo\r\n");
});

test("descriptions are plain text without markdown escapes", () => {
  const description = unfold(
    ics({
      description:
        "**Agenda** \\\n17.00 Doors open \\\n18.15 Break\n\nteemu.teekkari \\[at] example.com & co",
    }),
  )
    .split("\r\n")
    .find((line) => line.startsWith("DESCRIPTION:"));
  expect(description).toContain(
    "DESCRIPTION:Agenda \\n17.00 Doors open \\n18.15 Break\\n\\nteemu.teekkari [at] example.com & co\\n",
  );
});

test("folding keeps emoji whole", () => {
  // This offset put the old 60-unit fold point inside a surrogate pair.
  const calendarText = ics({ description: `ab${"🔥 ".repeat(40)}` });
  expect(unfold(calendarText)).toContain(`ab${"🔥 ".repeat(39)}🔥`);
  expect(calendarText).not.toMatch(
    /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/,
  );
});
