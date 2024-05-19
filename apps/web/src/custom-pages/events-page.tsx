import Link from "next/link";
import type {
  EventQuota,
  IlmomasiinaEvent,
} from "../lib/api/external/ilmomasiina";
import { fetchEvents } from "../lib/api/external/ilmomasiina";
import { cn, formatDateYear, formatDatetimeYear } from "../lib/utils";
import { BackButton } from "../components/back-button";
import { getCurrentLocale, getScopedI18n } from "../locales/server";
import EventCalendar from "./event-calendar";

async function SignUpText({
  startDate,
  endDate,
  className,
}: {
  startDate?: string | null;
  endDate?: string | null;
  className?: string;
}) {
  const locale = getCurrentLocale();
  const t = await getScopedI18n("ilmomasiina.status");
  if (!startDate || !endDate) {
    return (
      <span className={className}>{t("Tapahtumaan ei voi ilmoittautua")}</span>
    );
  }

  const hasStarted = new Date(startDate) < new Date();
  const hasEnded = new Date(endDate) < new Date();

  if (hasStarted && hasEnded) {
    return (
      <span className={className}>{t("Ilmoittautuminen on päättynyt")}</span>
    );
  }

  if (hasStarted && !hasEnded) {
    return (
      <span className={className}>
        {t("Ilmoittautuminen auki", {
          endDate: formatDatetimeYear(endDate, locale),
        })}
      </span>
    );
  }

  return (
    <span className={className}>
      {t("Ilmoittautuminen alkaa", {
        startDate: formatDatetimeYear(startDate, locale),
      })}
    </span>
  );
}

async function SignupQuotas({
  quotas,
  className,
}: {
  quotas: EventQuota[];
  className?: string;
}) {
  const t = await getScopedI18n("ilmomasiina");
  const totalSignupCount = quotas.reduce(
    (acc, quota) => acc + quota.signupCount,
    0,
  );
  const totalSize = quotas.reduce((acc, quota) => acc + quota.size, 0);

  const isSingleQuota = quotas.length === 1;

  if (isSingleQuota) {
    return (
      <div className={className}>
        <span className="flex w-full justify-between gap-4 whitespace-nowrap font-medium">
          <span className="w-3/4">{t("Ilmoittautuneita")}</span>{" "}
          <span className="w-1/4 text-left">
            {totalSignupCount} / {totalSize}
          </span>
        </span>
      </div>
    );
  }

  return (
    <ul className={cn(className)}>
      <li className="flex w-full justify-between gap-4 whitespace-nowrap font-medium">
        <span className="w-3/4">{t("Ilmoittautuneita")}</span>{" "}
        <span className="w-1/4 text-left">
          {totalSignupCount} / {totalSize}
        </span>
      </li>
      {quotas.map((quota) => (
        <li
          className="flex w-full justify-between gap-4 whitespace-nowrap"
          key={quota.id}
        >
          <span className="w-3/4">{quota.title}</span>{" "}
          <span className="w-1/4 text-left">
            {quota.signupCount} / {quota.size}
          </span>
        </li>
      ))}
    </ul>
  );
}

async function EventCard({ event }: { event: IlmomasiinaEvent }) {
  const t = await getScopedI18n("ilmomasiina.path");

  const locale = getCurrentLocale();
  return (
    <li className="shadow-solid dark:border-dark-fg dark:shadow-dark-fg dark:bg-dark-bg dark:text-dark-text group relative flex max-w-4xl flex-col gap-2 rounded-md border-2 border-gray-900 bg-gray-100 p-4 md:flex-row md:gap-4 md:p-6">
      <Link
        href={`/${locale}/${t("events")}/${event.slug}`}
        className="dark:text-dark-heading text-pretty text-lg font-bold underline-offset-2 before:absolute before:left-0 before:top-0 before:z-0 before:block before:size-full before:cursor-[inherit] group-hover:underline md:w-1/3"
      >
        <h2>{event.title}</h2>
      </Link>

      {event.date ? (
        <time className="md:w-1/6" dateTime={event.date}>
          {formatDateYear(event.date, locale)}
        </time>
      ) : (
        <div className="md:w-1/6" />
      )}
      <SignUpText
        className="md:w-1/4"
        endDate={event.registrationEndDate}
        startDate={event.registrationStartDate}
      />
      {event.quotas.length > 0 ? (
        <SignupQuotas className="md:w-1/4" quotas={event.quotas} />
      ) : null}
    </li>
  );
}

function Calendar({ events }: { events: IlmomasiinaEvent[] }) {
  return (
    <li style={{ height: "38rem" }}>
      <EventCalendar events={events} />
    </li>
  );
}

export default async function Page() {
  const t = await getScopedI18n("ilmomasiina");
  const ta = await getScopedI18n("action");
  const events = await fetchEvents();

  if (!events.ok) {
    // eslint-disable-next-line no-console -- nice to know
    console.warn("Failed to fetch events from Ilmomasiina", events.error);
    throw new Error("Failed to fetch events from Ilmomasiina");
  }

  return (
    <main
      id="main"
      className="relative mb-8 flex flex-col items-center gap-2 md:gap-6"
    >
      <div className="relative m-auto flex max-w-full flex-col gap-8 p-4 md:p-6">
        <div className="max-w-4xl space-y-4 md:my-8 md:space-y-8">
          <BackButton>{ta("Back")}</BackButton>
          <h1 className="dark:text-dark-heading font-mono text-4xl">
            {t("Tapahtumat")}
          </h1>
          <ul className="space-y-8">
            <Calendar events={events.data} />
            {events.data
              .filter((event) => {
                const currentDate = new Date();
                if (event.endDate) {
                  const eventEndDate = new Date(event.endDate);
                  return eventEndDate >= currentDate;
                } else if (event.date) {
                  const eventStartDate = new Date(event.date);
                  return eventStartDate >= currentDate;
                }
                return false;
              })
              .map((event) => (
                <EventCard event={event} key={event.id} />
              ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
