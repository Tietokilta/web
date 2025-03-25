import { getISOWeek, getISOWeekYear } from "date-fns";
import {
  fetchUpcomingEvents,
  type IlmomasiinaEvent,
} from "../../../lib/api/external/ilmomasiina";
import { getI18n } from "../../../locales/server.ts";
import { EventCardCompact } from "../../event-card/index.tsx";

export default async function EventListInfoscreen({
  showIlmostatus = true,
}: {
  showIlmostatus?: boolean;
}) {
  const t = await getI18n();
  const eventsResponse = await fetchUpcomingEvents();
  const events = Array.isArray(eventsResponse.data) ? eventsResponse.data : [];

  const upcomingEventsDataByWeek = Object.groupBy(
    events,
    ({ date, registrationStartDate, registrationEndDate }) => {
      const dateToUse =
        date ?? registrationStartDate ?? registrationEndDate ?? "";
      return `${getISOWeekYear(dateToUse).toFixed()}-${getISOWeek(dateToUse).toFixed().padStart(2, "0")}`; // YYYY-VV
    },
  );

  return (
    <main id="main" className="flex flex-col align-top">
      <h1 className="mb-2 mt-4 text-center font-mono text-5xl font-bold">
        {t("ilmomasiina.Events")}
      </h1>
      <ul className="flex flex-row flex-wrap">
        {Object.entries(upcomingEventsDataByWeek)
          .filter(
            (
              e: [string, IlmomasiinaEvent[] | undefined],
            ): e is [string, IlmomasiinaEvent[]] => !!e[1],
          )
          .sort((a, b) => a[0].localeCompare(b[0]))
          .slice(0, 2)
          .map(([weekYear, eventsInWeek]) => {
            return (
              <div key={weekYear} className="flex w-1/2 flex-col p-1">
                <span className="text-pretty py-1 text-center text-3xl font-bold">
                  {t("calendar.Week")} {Number(weekYear.split("-")[1])}
                </span>
                <div className="flex flex-col gap-2">
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
