import { getISOWeek, getISOWeekYear } from "date-fns";
import { type UserEventListItem } from "@tietokilta/ilmomasiina-models";
import { fetchUpcomingEvents } from "../../../lib/api/external/ilmomasiina";
import { getLocale, getTranslations } from "../../../locales/server";
import { EventCardCompact } from "../../event-card/index.tsx";

export default async function EventListInfoscreen({
  showIlmostatus = true,
}: {
  showIlmostatus?: boolean;
}) {
  const tIlmo = await getTranslations("ilmomasiina");
  const tCal = await getTranslations("calendar");
  const locale = await getLocale();
  const eventsResponse = await fetchUpcomingEvents(locale);
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
    <main id="main" className="flex flex-col p-4 align-top">
      <h1 className="mt-4 mb-2 text-center font-mono text-5xl font-bold">
        {tIlmo("Events")}
      </h1>
      <ul className="flex flex-row flex-wrap">
        {Object.entries(upcomingEventsDataByWeek)
          .filter(
            (
              e: [string, UserEventListItem[] | undefined],
            ): e is [string, UserEventListItem[]] => !!e[1],
          )
          .sort((a, b) => a[0].localeCompare(b[0]))
          .slice(0, 2)
          .map(([weekYear, eventsInWeek]) => {
            return (
              <div key={weekYear} className="flex w-1/2 flex-col p-1">
                <span className="py-1 text-center text-3xl font-bold text-pretty">
                  {tCal("Week")} {Number(weekYear.split("-")[1])}
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
