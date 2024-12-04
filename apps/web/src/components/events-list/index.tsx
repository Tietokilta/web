import Link from "next/link";
import { useEffect } from "react";
import {
  type EventQuota,
  fetchEvents,
  type IlmomasiinaEvent,
} from "../../lib/api/external/ilmomasiina";
import {
  formatDateTime,
  formatDatetimeYear,
  getQuotasWithOpenAndQueue,
} from "../../lib/utils.ts";

function OpenSignup({
  startDate,
  endDate,
  className,
}: {
  startDate?: string | null;
  endDate?: string | null;
  className?: string;
}) {
  if (!startDate || !endDate) {
    return <span className={className}>Tapahtumaan ei voi ilmoittautua</span>;
  }
  const hasStarted = new Date(startDate) < new Date();
  const hasEnded = new Date(endDate) < new Date();

  if (hasStarted && hasEnded) {
    return <span className={className}>Ilmoittautuminen on päättynyt</span>;
  }

  if (hasStarted && !hasEnded) {
    return (
      <span className={className}>
        Ilmo auki {formatDatetimeYear(endDate, "fi")} asti.
      </span>
    );
  }

  return <span> Ilmo aukeaa {formatDatetimeYear(startDate, "fi")}. </span>;
}

function SignupQuotas({
  showQuotas,
  quotas,
  openQuotaSize,
  className,
}: {
  showQuotas: boolean;
  quotas: EventQuota[];
  openQuotaSize: number;
  className?: string;
}) {
  const isSingleQuota =
    (quotas.length === 1 && !openQuotaSize) ||
    (quotas.length === 0 && openQuotaSize);

  function renderNoSignup() {
    return <span>Tapahtumaan ei voi ilmoittautua.</span>;
  }

  function renderSignup() {
    return (
      <span>
        Ilmoittautuneita: {isSingleQuota ? renderSingle() : renderMultiple()}
      </span>
    );
  }

  function renderSingle() {
    return (
      <div className="flex w-full justify-between">
        <span>
          {quotas[0].title.length - 3 > 8
            ? `${quotas[0].title.slice(0, 8)}...`
            : quotas[0].title}
        </span>
        <span>
          {quotas[0].signupCount} / {quotas[0].size}
        </span>
      </div>
    );
  }

  function renderMultiple() {
    const allQuotas = getQuotasWithOpenAndQueue(quotas, openQuotaSize);
    return (
      <ul>
        <li className="flex flex-col justify-end">
          {allQuotas.map((quota) => (
            <div className="flex w-full justify-between" key={quota.id}>
              <span>
                {quota.title.length - 3 > 8
                  ? `${quota.title.slice(0, 8)}...`
                  : quota.title}
              </span>
              <span>
                {quota.signupCount} / {quota.size}
              </span>
            </div>
          ))}
        </li>
      </ul>
    );
  }

  return (
    <div className={className}>
      {showQuotas ? renderSignup() : renderNoSignup()}
    </div>
  );
}

function EventCard({
  event,
  showSignup = true,
}: {
  event: IlmomasiinaEvent;
  showSignup: boolean;
}) {
  var showSignupQuotas = true;
  const signupStartDate = event.registrationStartDate;
  const signupEndDate = event.registrationEndDate;
  const eventDate = event.date ? new Date(event.date) : new Date();

  if (event.registrationClosed === true || !signupEndDate || !signupStartDate) {
    showSignupQuotas = false;
  }

  return (
    //eslint-disable-next-line tailwindcss/no-custom-classname -- custom classnames is needed
    <li className="shadow-solid relative flex max-w-3xl flex-col gap-2 rounded-md border-2 border-gray-900 bg-gray-100 p-4">
      <div className="flex flex-row justify-between">
        <div className={`flex grow ${showSignupQuotas ? "flex-col" : ""}`}>
          <Link
            href={`/fi/tapahtumat/${event.slug}`}
            className="text-pretty text-lg font-bold group-hover:underline"
          >
            <h2>{`${event.title}, ${formatDateTime(
              eventDate.toISOString(),
            )}`}</h2>
          </Link>

          {showSignupQuotas ? (
            <OpenSignup endDate={signupEndDate} startDate={signupStartDate} />
          ) : null}
        </div>
        {showSignup ? (
          <SignupQuotas
            showQuotas={showSignupQuotas}
            quotas={event.quotas}
            openQuotaSize={event.openQuotaSize}
            className="ml-5 w-1/3 shrink-0"
          />
        ) : null}
      </div>
    </li>
  );
}

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
    // @ts-ignore
    const eventDate = event.date
      ? new Date(event.date)
      : new Date(event.registrationStartDate);
    const weekNumber = getWeek(eventDate);
    if (!acc[weekNumber]) {
      acc[weekNumber] = [];
    }

    acc[weekNumber].push(event);
    return acc;
  }, {});
}

export default function Page({
  events,
  setEvents,
  showIlmostatus = true,
}: {
  events: IlmomasiinaEvent[];
  setEvents: React.Dispatch<React.SetStateAction<IlmomasiinaEvent[]>>;
  showIlmostatus?: boolean;
}) {
  useEffect(() => {
    async function loadEvents() {
      const fetchedEvents = await fetchEvents();
      setEvents(fetchedEvents.data ?? []);
    }
    void loadEvents();
  }, [setEvents]);

  const upcomingEventsDataByWeek = groupEventsByWeek(events);

  return (
    <main id="main" className="flex flex-col align-top">
      <h1 className="my-6 text-center font-mono text-5xl font-bold">
        Tapahtumat
      </h1>
      <ul className="flex flex-row flex-wrap">
        {Object.entries(upcomingEventsDataByWeek)
          .slice(1, 4)
          .map((entry) => {
            const eventsInWeek = entry[1];
            return (
              <div key={entry[0]} className="flex w-1/2 flex-col p-2 xl:w-1/3">
                <span className="text-pretty py-2 text-center text-3xl font-bold">
                  Week {entry[0]}
                </span>
                <div className="flex flex-col gap-3">
                  {eventsInWeek.map((event) => {
                    return (
                      <EventCard
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
