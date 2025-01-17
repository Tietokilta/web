import {
  fetchUpcomingEvents,
  type IlmomasiinaEvent,
} from "../../../lib/api/external/ilmomasiina";
import { getI18n, getScopedI18n } from "../../../locales/server.ts";
import { EventCardCompact } from "../../event-card/index.tsx";

function getWeek(date: Date) {
  // First day of the year
  const firstMondayOfYear = new Date(date.getFullYear(), 0, 1);
  // Monday is 0, Sunday is 6
  const weekday = (firstMondayOfYear.getDay() + 6) % 7;
  // Find first monday of the year
  if (weekday < 3) {
    // If the first day of the year is a Monday, Tuesday or Wednesday
    firstMondayOfYear.setDate(firstMondayOfYear.getDate() - weekday);
  } else {
    // If the first day of the year is a Thursday, Friday, Saturday or Sunday
    firstMondayOfYear.setDate(firstMondayOfYear.getDate() + 7 - weekday);
  }

  // Calculate how many weeks have passed
  const diff = date.getTime() - firstMondayOfYear.getTime();
  const days = diff / (1000 * 60 * 60 * 24 * 7);
  let weeknumber = Math.ceil(days);
  weeknumber =
    date.getFullYear() > new Date().getFullYear()
      ? weeknumber + 52
      : weeknumber;
  return weeknumber;
}

function groupEventsByWeek(
  events: IlmomasiinaEvent[],
): Record<number, IlmomasiinaEvent[]> {
  return events.reduce<Record<number, IlmomasiinaEvent[]>>((acc, event) => {
    const eventDate = event.date
      ? new Date(event.date)
      : new Date(
          event.registrationStartDate ? event.registrationStartDate : "",
        );
    const weekNumber = getWeek(eventDate);
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Removing this causes error
    if (!acc[weekNumber]) {
      acc[weekNumber] = [];
    }
    acc[weekNumber].push(event);
    return acc;
  }, {});
}

export default async function EventListInfoscreen({
  showIlmostatus = true,
}: {
  showIlmostatus?: boolean;
}) {
  const t = await getI18n();
  const eventsResponse = await fetchUpcomingEvents();
  const events = Array.isArray(eventsResponse.data) ? eventsResponse.data : [];

  const upcomingEventsDataByWeek = groupEventsByWeek(events);

  return (
    <main id="main" className="flex flex-col align-top">
      <h1 className="my-6 text-center font-mono text-5xl font-bold">
        {t("ilmomasiina.Tapahtumat")}
      </h1>
      <ul className="flex flex-row flex-wrap">
        {Object.entries(upcomingEventsDataByWeek)
          .slice(1, 4)
          .map((entry) => {
            const eventsInWeek = entry[1];
            return (
              <div key={entry[0]} className="flex w-1/2 flex-col p-2 xl:w-1/3">
                <span className="text-pretty py-2 text-center text-3xl font-bold">
                  {t("calendar.Week")} {entry[0]}
                </span>
                <div className="flex flex-col gap-3">
                  {eventsInWeek.map((event) => {
                    return (
                      <EventCardCompact
                        event={event}
                        showSignup={showIlmostatus}
                        key={event.id}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
      </ul>
    </main>
  );
}
