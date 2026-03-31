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
import { tz } from "@date-fns/tz";
import { enUS } from "date-fns/locale/en-US";
import { fi as fin } from "date-fns/locale/fi";
import Link from "next/link";
import {
  type UserEventListResponse,
  type UserEventListItem,
} from "@tietokilta/ilmomasiina-models";
import { useTranslations, useLocale } from "../locales/client";
import type { Locale } from "../locales/server";

type EventWithDate = UserEventListItem & { date: string };
type CalendarEvent = Omit<Event, "resource"> & {
  resource: { url: string; category: string };
};

const CATEGORY_COLORS = [
  "#7ef98c", // primary-500 (green) — default
  "#d690f6", // secondary-500 (purple)
  "#e75d86", // danger-400 (pink)
  "#f2e67d", // warning-400 (yellow)
  "#93e552", // success-400 (lime)
  "#9ff9a9", // primary-400 (light green)
  "#e7c4f7", // secondary-300 (lavender)
  "#ea8ca9", // danger-300 (salmon)
  "#b1becb", // gray-500 (slate)
  "#f1e04d", // warning-500 (gold)
] as const;

const CATEGORY_COLOR_OVERRIDES: Record<string, string> = {
  AthleTiKs: "#F9A857",
};

function getCategoryColor(category: string): string {
  if (!category) return CATEGORY_COLORS[0];
  if (category in CATEGORY_COLOR_OVERRIDES)
    return CATEGORY_COLOR_OVERRIDES[category]!;
  // djb2 hash
  let hash = 5381;
  for (let i = 0; i < category.length; i++) {
    hash = (hash * 33) ^ category.charCodeAt(i);
  }
  return CATEGORY_COLORS[Math.abs(hash) % CATEGORY_COLORS.length];
}

// Make calendar events into clickable links.
function EventElement(props: EventProps<CalendarEvent>) {
  return (
    <Link className="block h-full" href={props.event.resource.url}>
      {props.title}
    </Link>
  );
}

function EventCalendar({
  events,
  eventsUrl,
  locale,
}: {
  events: UserEventListResponse;
  eventsUrl: string;
  locale: Locale;
}) {
  const t = useTranslations("calendar");

  // Filter events without a start date.
  const filteredEvents = events.filter(
    (event): event is EventWithDate => !!event.date,
  );

  const parsedEvents: CalendarEvent[] = filteredEvents.map((event) => {
    const startDate = tz("Europe/Helsinki")(event.date);

    const endDate = event.endDate
      ? tz("Europe/Helsinki")(event.endDate)
      : endOfDay(event.date, { in: tz("Europe/Helsinki") });

    // Url of the event page.
    const eventUrl = eventsUrl + event.slug;

    return {
      start: startDate,
      end: endDate,
      title: event.title,
      resource: {
        url: eventUrl,
        category: event.category,
      },
    };
  });

  // Translations for control buttons
  const messages = {
    week: t("Week"),
    work_week: t("Work Week"),
    day: t("Day"),
    month: t("Month"),
    previous: t("Previous"),
    next: t("Next"),
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

  const eventPropGetter = useCallback(
    (event: CalendarEvent) => ({
      style: {
        backgroundColor: getCategoryColor(event.resource.category),
      },
    }),
    [],
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
          event: EventElement,
        },
        week: {
          event: EventElement,
        },
        month: {
          event: EventElement,
        },
      }}
      messages={messages}
      culture={locale}
      popup
      scrollToTime={date}
      events={parsedEvents}
      eventPropGetter={eventPropGetter}
      onView={handleOnChangeView}
    />
  );
}

function CalendarWrapper({ events }: { events: UserEventListResponse }) {
  const locale = useLocale();
  const eventsUrl = `/${locale}/events/`;
  return (
    <EventCalendar events={events} eventsUrl={eventsUrl} locale={locale} />
  );
}
export default CalendarWrapper;
