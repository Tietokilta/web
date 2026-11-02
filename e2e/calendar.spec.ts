import { test, expect } from "@playwright/test";
import { createEvents } from "../apps/web/src/lib/ics";
import { event } from "./ilmomasiina";

function calendar(date: string | null, endDate: string | null = null) {
  return createEvents(
    [
      {
        ...event,
        date,
        endDate,
        payments: "disabled" as Parameters<
          typeof createEvents
        >[0][number]["payments"],
        quotas: [],
      },
    ],
    { host: "tietokilta.fi", origin: "https://tietokilta.fi", locale: "fi" },
  ).split("BEGIN:VEVENT")[1];
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
