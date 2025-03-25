import { BackButton } from "../components/back-button";
import EventCard from "../components/event-card";
import { fetchEvents } from "../lib/api/external/ilmomasiina";
import { getScopedI18n } from "../locales/server";

export default async function Page() {
  const t = await getScopedI18n("ilmomasiina.all-events");
  const ta = await getScopedI18n("action");
  const maxAge = 180; // days, maximum for default Ilmomasiina config
  const events = await fetchEvents(maxAge);

  return (
    <main
      id="main"
      className="relative mb-8 flex flex-col items-center gap-2 md:gap-6"
    >
      <div className="relative m-auto flex max-w-full flex-col gap-8 p-4 md:p-6">
        <div className="max-w-4xl space-y-4 md:my-8 md:space-y-8">
          <BackButton>{ta("Back")}</BackButton>
          <h1 className="font-mono text-4xl">{t("All events")}</h1>
          <ul className="space-y-8">
            {events.data
              ?.reverse()
              .map((event) => <EventCard event={event} key={event.id} />)}
          </ul>
        </div>
      </div>
    </main>
  );
}
