import { remark } from "remark";
import strip from "strip-markdown";
import { type IlmomasiinaEvent } from "./api/external/ilmomasiina";

export function createEvents(
  events: IlmomasiinaEvent[],
  {
    host,
    origin,
  }: {
    host: string;
    origin: string;
  },
): string {
  return `BEGIN:VCALENDAR\r
PRODID:-//Tietokilta//Ilmomasiina//FI\r
VERSION:2.0\r
CALSCALE:GREGORIAN\r
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
END:VTIMEZONE
${events
  .map((event) => createEvent(event, { host, origin }))
  .filter(Boolean)
  .join("\r\n")}
END:VCALENDAR`;
}

function createEvent(
  event: IlmomasiinaEvent,
  {
    host,
    origin,
  }: {
    host: string;
    origin: string;
  },
): string {
  if (!event.date) {
    return "";
  }

  return `BEGIN:VEVENT\r
UID:${event.id}@${host}\r
SUMMARY:${event.title}\r
LOCATION:${event.location}\r
URL:${origin}/events/${event.slug}\r
CATEGORIES:${event.category}\r
DESCRIPTION:
 ${formatDescription(event.description)}
 ${foldICSText(`\\n\\n---\\nLue lisää: ${origin}/fi/tapahtumat/${event.slug}\\nRead more: ${origin}/en/events/${event.slug}`)}
${formatDates(event.date, event.endDate)}
END:VEVENT`;
}

function formatDates(start: string, end?: string | null) {
  const startDate = new Date(start);
  if (!end) {
    // Make the event an all-day event if there's no end date.
    return `DTSTAMP:${formatDateTime(startDate)}Z\r
DTSTART;VALUE=DATE:${formatDate(startDate)}\r
DTEND;VALUE=DATE:${formatDate(startDate)}`;
  }

  const endDate = new Date(end);

  return `DTSTAMP:${formatDateTime(startDate)}Z\r
DTSTART:${formatDateTime(startDate)}Z\r
DTEND:${formatDateTime(endDate)}`;
}

const formatDate = (date: Date) =>
  date.toISOString().slice(0, 10).replace(/-/g, "");

const formatDateTime = (date: Date) =>
  date.toISOString().slice(0, 19).replace(/[-:]/g, "");

function formatDescription(description: string): string {
  return foldICSText(escapeNewLines(stripMarkdown(description)));
}

function foldICSText(text: string): string {
  const MAX_LENGTH = 60;
  let foldedText = "";

  for (let i = 0; i < text.length; i += MAX_LENGTH) {
    const chunk = text.substring(i, i + MAX_LENGTH);

    // If it's not the first line, prepend a space to the folded line.
    if (i !== 0) {
      foldedText += "\r\n ";
    }

    foldedText += chunk;
  }

  return foldedText;
}

function escapeNewLines(text: string): string {
  return text.replace(/\n/g, "\\n");
}

function stripMarkdown(text: string): string {
  return remark().use(strip).processSync(text).toString();
}
