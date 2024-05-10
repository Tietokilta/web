import Link from "next/link";
import type {
  EventQuota,
  IlmomasiinaEvent,
} from "../lib/api/external/ilmomasiina";
import { fetchEvents } from "../lib/api/external/ilmomasiina";
import { cn, formatDate, formatDatetimeYear } from "../lib/utils";
import { BackButton } from "../components/back-button";
import { getCurrentLocale, getScopedI18n } from "../locales/server";

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

function EventCard({ event }: { event: IlmomasiinaEvent }) {
  const locale = getCurrentLocale();
  return (
    <li>
      <Link
        className="shadow-solid group flex max-w-4xl flex-col gap-2 rounded-md border-2 border-gray-900 bg-gray-100 p-4 md:flex-row md:gap-4 md:p-6"
        href={`/${locale}/events/${event.slug}`}
      >
        <h2 className="text-pretty text-lg font-bold underline-offset-2 group-hover:underline md:w-1/3">
          {event.title}
        </h2>

        {event.date ? (
          <time className="md:w-1/6" dateTime={event.date}>
            {formatDate(event.date, locale)}
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
      </Link>
    </li>
  );
}

export default async function Page() {
  const t = await getScopedI18n("ilmomasiina");
  const ta = await getScopedI18n("action");
  const events = await fetchEvents();

  if (!events.ok) {
    console.warn("Failed to fetch events from Ilmomasiina", events.error);
    throw new Error("Failed to fetch events from Ilmomasiina");
  }

  return (
    <main className="relative mb-8 flex flex-col items-center gap-2 md:gap-6">
      <div className="relative m-auto flex max-w-full flex-col gap-8 p-4 md:p-6">
        <div className="max-w-4xl space-y-4 md:my-8 md:space-y-8">
          <BackButton buttonText={ta("Back")} />
          <h1 className="font-mono text-4xl">{t("Tapahtumat")}</h1>
          <ul className="space-y-8">
            {events.data.map((event) => (
              <EventCard event={event} key={event.id} />
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
