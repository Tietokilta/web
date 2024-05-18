"use client";

import {
  Calendar as ReactCalendar,
  momentLocalizer,
  type View,
  type Event,
  type EventProps,
  Views,
} from "react-big-calendar";
import { useState, useCallback } from "react";
import "./event-calendar.css";
import moment from "moment";
import type { IlmomasiinaEvent } from "../lib/api/external/ilmomasiina";

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
  // Filter events without a start date.
  const filtered = events.filter(
    (event): event is IlmomasiinEventWithDate => !!event.date,
  );

  const parsedEvents: Event[] = filtered.map((event) => {
    const startDate = new Date(event.date);

    let endDate;

    // If end date doesn't exist, set it to end of the day of startDate.
    if (event.endDate) endDate = new Date(event.endDate);
    else {
      const endOfDay = new Date(event.date);
      endOfDay.setHours(23, 59, 59, 999);
      endDate = endOfDay;
    }

    // Url of the event.
    const eventUrl = eventsUrl + event.slug;

    return {
      id: event.id,
      start: startDate,
      end: endDate,
      title: event.title,
      resource: {
        url: eventUrl,
      },
    };
  });

  // Make calendar events into clickable links.
  const eventCard = (event: EventProps) => {
    return (
      <a className="block h-full" href={event.event.resource.url}>
        {event.title}
      </a>
    );
  };

  const messages = {
    week: "Viikko",
    work_week: "Työviikko",
    day: "Päivä",
    month: "Kuukausi",
    previous: "Edellinen",
    next: "Seuraava",
    today: "Tänään",
  };

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
          event: eventCard,
        },
        week: {
          event: eventCard,
        },
        month: {
          event: eventCard,
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

export default EventCalendar;
