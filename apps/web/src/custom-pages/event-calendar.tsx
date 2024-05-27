"use client";
import {
  Calendar as ReactCalendar,
  type View,
  type Event,
  type EventProps,
  Views,
  dateFnsLocalizer,
} from "react-big-calendar";
import { useState, useCallback } from "react";
import "./event-calendar.css";
import { format, parse, startOfWeek, getDay, endOfDay } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { enUS } from "date-fns/locale/en-US";
import { fi as fin } from "date-fns/locale/fi";
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
    const startDate = toZonedTime(event.date, "Europe/Helsinki");

    const endDate = event.endDate
      ? toZonedTime(event.endDate, "Europe/Helsinki")
      : endOfDay(toZonedTime(event.date, "Europe/Helsinki"));

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

  const locales = {
    en: enUS,
    fi: fin,
  };

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => {
      return startOfWeek(new Date(), { weekStartsOn: 1 });
    },
    getDay,
    locales,
  });

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
