"use client";

import {
  Calendar as ReactCalendar,
  momentLocalizer,
  type View,
  Views,
} from "react-big-calendar";
import type { Event, EventProps } from "react-big-calendar";
import { useState, useCallback } from "react";
import moment from "moment";

import type { IlmomasiinaEvent } from "../lib/api/external/ilmomasiina";

type IlmomasiinEventWithDate = IlmomasiinaEvent & { date: string };

function EventCalendar({
  events,
  eventsUrl,
}: {
  events: IlmomasiinaEvent[];
  eventsUrl: string;
}) {
  const filtered = events.filter(
    (event): event is IlmomasiinEventWithDate => !!event.date,
  );

  const parsedEvents: Event[] = filtered.map((event) => {
    const startDate = new Date(event.date);

    let endDate;

    if (event.endDate) endDate = new Date(event.endDate);
    else {
      const endOfDay = new Date(event.date);
      endOfDay.setHours(23, 59, 59, 999);
      endDate = endOfDay;
    }

    const eventUrl = `${eventsUrl}${event.slug}`;

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

  // function onSelectEvent(event: Event) {
  //   console.log(event);
  // }

  const eventCard = (event: EventProps) => {
    return (
      <a className="block h-full" href={event.event.resource.url}>
        {event.title}
      </a>
    );
  };

  const localizer = momentLocalizer(moment);

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
      popup
      events={parsedEvents}
      onView={handleOnChangeView}
    />
  );
}

export default EventCalendar;
