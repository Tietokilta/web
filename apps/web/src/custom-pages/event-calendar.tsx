"use client";
import {
  Calendar as ReactCalendar,
  type View,
  type Event,
  type EventProps,
  Views,
  momentLocalizer,
} from "react-big-calendar";
import { useState, useCallback } from "react";
import "./event-calendar.css";
// eslint-disable-next-line import/named -- these are reimports from moment
import moment, { tz, updateLocale } from "moment-timezone";
import type { IlmomasiinaEvent } from "../lib/api/external/ilmomasiina";
import {
  useScopedI18n,
  useCurrentLocale,
  I18nProviderClient,
} from "../locales/client";

type IlmomasiinEventWithDate = IlmomasiinaEvent & { date: string };
type CalendarEvent = Omit<Event, "resource"> & { resource: { url: string } };

function EventCalendar({
  events,
  eventsUrl,
  locale,
}: {
  events: IlmomasiinaEvent[];
  eventsUrl: string;
  locale: string;
}) {
  const t = useScopedI18n("calendar");
  const ta = useScopedI18n("action");

  // Filter events without a start date.
  const filteredEvents = events.filter(
    (event): event is IlmomasiinEventWithDate => !!event.date,
  );

  const parsedEvents: CalendarEvent[] = filteredEvents.map((event) => {
    const startDate = tz(event.date, "Europe/Helsinki").toDate();

    const endDate = event.endDate
      ? tz(event.endDate, "Europe/Helsinki").toDate()
      : tz(event.date, "Europe/Helsinki").endOf("day").toDate();

    // Url of the event page.
    const eventUrl = eventsUrl + event.slug;

    return {
      start: startDate,
      end: endDate,
      title: event.title,
      resource: {
        url: eventUrl,
      },
    };
  });

  // Make calendar events into clickable links.
  const eventElement = (event: EventProps<CalendarEvent>) => {
    return (
      <a className="block h-full" href={event.event.resource.url}>
        {event.title}
      </a>
    );
  };

  // Translations for control buttons
  const messages = {
    week: t("Week"),
    work_week: t("Work Week"),
    day: t("Day"),
    month: t("Month"),
    previous: ta("Previous"),
    next: ta("Next"),
    today: t("Today"),
  };

  // Set Monday as the first day of the week
  updateLocale(locale, {
    week: {
      dow: 1,
    },
  });

  const localizer = momentLocalizer(moment);

  // State hooks that fix React strict mode functionality
  // See: https://github.com/vercel/next.js/issues/56206
  const [view, setView] = useState<View>(Views.MONTH);
  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };

  const [date, setDate] = useState(new Date());
  const onNavigate = useCallback(
    (newDate: Date) => {
      setDate(newDate);
    },
    [setDate],
  );

  return (
    <ReactCalendar
      view={view}
      defaultView={Views.MONTH}
      views={["month", "week", "day"]}
      onNavigate={onNavigate}
      localizer={localizer}
      showMultiDayTimes
      date={date}
      components={{
        day: {
          event: eventElement,
        },
        week: {
          event: eventElement,
        },
        month: {
          event: eventElement,
        },
      }}
      messages={messages}
      culture={locale}
      popup
      scrollToTime={date}
      events={parsedEvents}
      onView={handleOnChangeView}
    />
  );
}

function CalendarWrapper({ events }: { events: IlmomasiinaEvent[] }) {
  const locale = useCurrentLocale();
  const eventsUrl = `/${locale}/events/`;
  return (
    <I18nProviderClient locale={locale}>
      <EventCalendar events={events} eventsUrl={eventsUrl} locale={locale} />
    </I18nProviderClient>
  );
}
export default CalendarWrapper;
