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
import moment, { updateLocale } from "moment";
import type { IlmomasiinaEvent } from "../lib/api/external/ilmomasiina";
import {
  useScopedI18n,
  useCurrentLocale,
  I18nProviderClient,
} from "../locales/client";

type IlmomasiinEventWithDate = IlmomasiinaEvent & { date: string };

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

  const parsedEvents: Event[] = filteredEvents.map((event) => {
    const startDate = new Date(event.date);

    let endDate;

    // If end date doesn't exist, set it to end of the day of startDate.
    if (event.endDate) endDate = new Date(event.endDate);
    else {
      const endOfDay = new Date(event.date);
      endOfDay.setHours(23, 59, 59, 999);
      endDate = endOfDay;
    }

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
  const eventElement = (event: EventProps) => {
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
