import { BackButton } from "../components/back-button";
import EventCard from "../components/event-card";
import { fetchEvents } from "../lib/api/external/ilmomasiina";
import { getLocale, getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("ilmomasiina.all-events");
  const ta = await getTranslations("action");
  const locale = await getLocale();
  const maxAge = 180; // days, maximum for default Ilmomasiina config
  const events = await fetchEvents(locale, maxAge);

  return (
    <main
      id="main"
      className="relative mb-8 flex flex-col items-center gap-2 md:gap-6"
    >
      <div className="relative m-auto flex max-w-full flex-col gap-8 p-4 md:p-6">
        <div className="max-w-4xl space-y-4 md:my-8 md:space-y-8">
          <BackButton>{ta("Back")}</BackButton>
          <h1 className="font-mono text-4xl">{t("Kaikki tapahtumat")}</h1>
          <ul className="space-y-8">
            {events.data?.reverse().map((event) => (
              <EventCard event={event} key={event.id} />
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
