import { tz } from "@date-fns/tz";
import {
  type UserEventListItem,
  type UserEventListResponse,
} from "@tietokilta/ilmomasiina-models";
import { format } from "date-fns";
import { remark } from "remark";
import strip from "strip-markdown";

export function createEvents(
  events: UserEventListResponse,
  options: {
    host: string;
    origin: string;
    locale: string;
  },
): string {
  return `BEGIN:VCALENDAR\r
PRODID:-//Tietokilta//Ilmomasiina//FI\r
VERSION:2.0\r
METHOD:PUBLISH\r
CALSCALE:GREGORIAN\r
X-WR-CALNAME:Tietokillan tapahtumat | Tietokilta events\r
X-PUBLISHED-TTL:PT1H\r
BEGIN:VTIMEZONE\r
TZID:Europe/Helsinki\r
TZURL:https://www.tzurl.org/zoneinfo/Europe/Helsinki\r
X-LIC-LOCATION:Europe/Helsinki\r
X-PROLEPTIC-TZNAME:LMT\r
BEGIN:STANDARD\r
TZNAME:HMT\r
TZOFFSETFROM:+013949\r
TZOFFSETTO:+013949\r
DTSTART:18780531T000000\r
END:STANDARD\r
BEGIN:STANDARD\r
TZNAME:EET\r
TZOFFSETFROM:+013949\r
TZOFFSETTO:+0200\r
DTSTART:19210501T000000\r
END:STANDARD\r
BEGIN:DAYLIGHT\r
TZNAME:EEST\r
TZOFFSETFROM:+0200\r
TZOFFSETTO:+0300\r
DTSTART:19420403T000000\r
END:DAYLIGHT\r
BEGIN:STANDARD\r
TZNAME:EET\r
TZOFFSETFROM:+0300\r
TZOFFSETTO:+0200\r
DTSTART:19421004T010000\r
END:STANDARD\r
BEGIN:DAYLIGHT\r
TZNAME:EEST\r
TZOFFSETFROM:+0200\r
TZOFFSETTO:+0300\r
DTSTART:19810329T020000\r
RRULE:FREQ=YEARLY;UNTIL=19820328T000000Z;BYMONTH=3;BYDAY=-1SU\r
END:DAYLIGHT\r
BEGIN:STANDARD\r
TZNAME:EET\r
TZOFFSETFROM:+0300\r
TZOFFSETTO:+0200\r
DTSTART:19810927T030000\r
RRULE:FREQ=YEARLY;UNTIL=19820926T000000Z;BYMONTH=9;BYDAY=-1SU\r
END:STANDARD\r
BEGIN:DAYLIGHT\r
TZNAME:EEST\r
TZOFFSETFROM:+0200\r
TZOFFSETTO:+0300\r
DTSTART:19830327T030000\r
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r
END:DAYLIGHT\r
BEGIN:STANDARD\r
TZNAME:EET\r
TZOFFSETFROM:+0300\r
TZOFFSETTO:+0200\r
DTSTART:19830925T040000\r
RRULE:FREQ=YEARLY;UNTIL=19950924T010000Z;BYMONTH=9;BYDAY=-1SU\r
END:STANDARD\r
BEGIN:STANDARD\r
TZNAME:EET\r
TZOFFSETFROM:+0300\r
TZOFFSETTO:+0200\r
DTSTART:19961027T040000\r
RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r
END:STANDARD\r
END:VTIMEZONE\r
${events.map((event) => createEvent(event, options)).join("")}END:VCALENDAR\r
`;
}

function createEvent(
  event: UserEventListItem,
  {
    host,
    origin,
    locale,
  }: {
    host: string;
    origin: string;
    locale: string;
  },
): string {
  if (!event.date) {
    return "";
  }

  const link =
    locale === "en"
      ? `${origin}/en/events/${event.slug}`
      : `${origin}/fi/tapahtumat/${event.slug}`;
  const readMore = locale === "en" ? "Read more:" : "Lue lisää:";
  const description = `${stripMarkdown(event.description ?? "").trim()}\n\n---\n${readMore} ${link}`;

  return [
    "BEGIN:VEVENT",
    `UID:${event.id}@${host}`,
    `SUMMARY:${escapeText(event.title)}`,
    `LOCATION:${escapeText(event.location ?? "")}`,
    `URL:${origin}/events/${event.slug}`,
    `CATEGORIES:${escapeText(event.category)}`,
    `DESCRIPTION:${escapeText(description)}`,
    ...formatDates(event.date, event.endDate),
    "END:VEVENT",
  ]
    .map((line) => `${foldLine(line)}\r\n`)
    .join("");
}

function formatDates(start: string, end?: string | null): string[] {
  const stamp = `DTSTAMP:${formatDateTime(new Date())}Z`;
  const startDate = new Date(start);
  if (!end) {
    // A DATE start without DTEND lasts one day (RFC 5545).
    return [stamp, `DTSTART;VALUE=DATE:${formatDate(startDate)}`];
  }

  return [
    stamp,
    `DTSTART:${formatDateTime(startDate)}Z`,
    `DTEND:${formatDateTime(new Date(end))}Z`,
  ];
}

const formatDate = (date: Date) =>
  format(date, "yyyyMMdd", { in: tz("Europe/Helsinki") });

const formatDateTime = (date: Date) =>
  date.toISOString().slice(0, 19).replace(/[-:]/g, "");

// RFC 5545 3.3.11: TEXT values escape backslashes, semicolons, commas and newlines.
function escapeText(text: string): string {
  return text.replace(/[\\;,]/g, "\\$&").replace(/\r?\n/g, "\\n");
}

const encoder = new TextEncoder();
const byteLength = (text: string) => encoder.encode(text).length;

/**
 * Folds a content line to 75 octets (RFC 5545 3.1), breaking only before
 * spaces. Google Calendar links URLs without unfolding them first, so a fold
 * inside a URL breaks the link. A word longer than a line stays whole.
 */
function foldLine(line: string): string {
  const lines: string[] = [];
  let current = "";
  // Every piece after the first starts with the space it follows.
  for (const piece of line.split(/(?= )/)) {
    // Continuation lines start with the folding space, so they fit one octet less.
    const limit = lines.length === 0 ? 75 : 74;
    if (current && byteLength(current + piece) > limit) {
      lines.push(current);
      current = piece;
    } else {
      current += piece;
    }
  }
  lines.push(current);
  return lines.join("\r\n ");
}

/**
 * Turns markdown into plain text. Stringifying the stripped tree still escapes
 * markdown syntax (`\[`, `&#x20;` before a hard break), so undo that.
 */
function stripMarkdown(text: string): string {
  return remark()
    .use(strip)
    .processSync(text)
    .toString()
    .replace(/\\([!-/:-@[-`{-~])|&#x([\da-f]+);/gi, (_, escaped, hex) =>
      typeof escaped === "string"
        ? escaped
        : String.fromCodePoint(Number.parseInt(hex as string, 16)),
    );
}
